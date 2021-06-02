import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Button, CheckBox, Input, Text } from "react-native-elements";
import  * as ImagePicker from 'react-native-image-picker';
import DatePicker from 'react-native-date-picker';
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosService from "../tools/axiosService";
const Animation = () =>{
    return (
        <View style={{width:40,height:40}}>
            <ActivityIndicator size="large" color={Colors.yellow} />
        </View>
    )
}
const getMimeType = (ext) => {
    // mime type mapping for few of the sample file types
    switch (ext) {
        case 'pdf': return 'application/pdf';
        case 'jpg': return 'image/jpeg';
        case 'jpeg': return 'image/jpeg';
        case 'png': return 'image/png';
    }
}
class OrderDetails extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:true,
            description:'',
            photo: null,
            date:new Date(),
            is_date_show:false,
            morning:false,
            noon:false,
            night:false,
            profile_uploader:false,
        }
    }
    handleChoosePhoto = (type=0) => {
        let options = {
            title: 'Update Profile',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
            saveToPhotos:true,
        };
        if(type == 0){
            ImagePicker.launchImageLibrary(options, res => {
                if (res.didCancel) {
                    //console.log('User cancelled image picker');
                } else if (res.error) {
                    //console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    //console.log('User tapped custom button: ', res.customButton);
                    //alert(res.customButton);
                } else {
                const source = { uri: res.uri };
                console.log(res);
                    
                    let filename = res.uri.split('/').pop();
                    const extArr = /\.(\w+)$/.exec(filename);
                    let type = getMimeType(extArr[1]);
                    this.setState({
                        filePath: res,
                        fileData: res.data,
                        fileUri: res.uri,
                        photo: res.uri,
                        fileName:filename,
                        filetype:type,
                    });
                }
            });
        }else{
            ImagePicker.launchCamera(options, res => {
                if (res.didCancel) {
                    //console.log('User cancelled image picker');
                } else if (res.error) {
                    //console.log('ImagePicker Error: ', res.error);
                } else if (res.customButton) {
                    //console.log('User tapped custom button: ', res.customButton);
                    //alert(res.customButton);
                } else {
                const source = { uri: res.uri };

                    let filename = res.uri.split('/').pop();
                    const extArr = /\.(\w+)$/.exec(filename);
                    let type = getMimeType(extArr[1]);
                    this.setState({
                        filePath: res,
                        fileData: res.data,
                        fileUri: res.uri,
                        photo: res.uri,
                        fileName:filename,
                        filetype:type,
                    });
                }
            });
        }
    }
    handlePerfectTime(did){
        if(did == 0){
            this.setState({morning:true});
            this.setState({night:false});
            this.setState({noon:false});
            this.setState({time:'Morning'});
        }else if(did == 1){
            this.setState({morning:false});
            this.setState({night:false});
            this.setState({noon:true});
            this.setState({time:'Noon'});
        }else if(did == 2){
            this.setState({morning:false});
            this.setState({night:true});
            this.setState({noon:false});
            this.setState({time:'Night'});
        }
    }
    handleNext = async ()=>{
        if(this.state.description == ''){
            this.setState({alertTitle:'Empty Description'});
            this.setState({alertMessage:'Please let know us about your issue in description'});
            this.setState({showAlert:true});
        }else{
            this.setState({ready:false});
                // await AsyncStorage.setItem('description',this.state.description);
                // await AsyncStorage.setItem('photo',this.state.photo);
                // await AsyncStorage.setItem('date',this.state.date);
                // await AsyncStorage.setItem('morning',this.state.morning);
                // await AsyncStorage.setItem('noon',this.state.noon);
                // await AsyncStorage.setItem('night',this.state.night);
            this.setState({ready:true});
            this.props.navigation.navigate('OrderSummery',{
                'description':this.state.description,
                'photo':this.state.photo,
                'filename':this.state.fileName,
                'filetype':this.state.filetype,
                'date':this.state.date,
                'time':this.state.time,
            });
        }
        
    }
    render(){
        return (
            <View style={{paddingTop:5,flex:1,}}>
                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    title={this.state.alertTitle}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    onDismiss={ () => this.setState({showAlert:false})}
                />
                <View style={{ flex: 9, alignItems: 'center', justifyContent: 'center', }}>
                    <ScrollView>
                        <View style={styles.container}>
                            <Input
                                placeholder='Please describe your issue clearly in order to provide our best solution for you'
                                onChangeText={text => this.setState({description:text})}
                                multiline = {true}
                                numberOfLines = {6}
                                value={this.state.description}
                            />
                        </View>
                        <Text style={{padding:10,fontSize:16}}>Select Service Date</Text>
                        <View style={styles.container}>
                            
                            <View style={this.state.is_date_show ? {display:'none'} : {width: '100%',alignItems:'center',justifyContent: 'center'}}>
                                <Button
                                    buttonStyle={{backgroundColor:Colors.yellow}}
                                    title={this.state.date.toDateString()}
                                    type="solid"
                                    titleStyle={{fontSize:20}}
                                    onPress={()=> this.setState({is_date_show:true})}
                                />
                            </View>
                            <View  style={this.state.is_date_show ? {display:'flex',width: '100%',alignItems:'center',justifyContent: 'center'} : {display:'none'}}>
                                <DatePicker
                                    date={this.state.date}
                                    onDateChange={(date) => this.setState({date:date})}
                                    style={{display:'flex'}}
                                />
                                <Button
                                    buttonStyle={{backgroundColor:Colors.yellow,marginTop:10}}
                                    title="Set Service Date"
                                    type="solid"
                                    titleStyle={{fontSize:20}}
                                    onPress={()=> this.setState({is_date_show:false})}
                                />
                            </View>
                            
                        </View>
                        <Text style={{padding:10,fontSize:16}}>Select Service Time</Text>
                        <View style={styles.container}>
                            <CheckBox
                                center
                                title='Morning'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.morning}
                                onPress={()=> this.handlePerfectTime(0)}
                            />
                            <CheckBox
                                center
                                title='Noon'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.noon}
                                onPress={()=> this.handlePerfectTime(1)}
                            />
                            <CheckBox
                                center
                                title='Night'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.night}
                                onPress={()=> this.handlePerfectTime(2)}
                            />
                        </View>
                        <Text style={{padding:10,fontSize:16}}>Upload Photo</Text>
                        <View style={styles.container}>
                            <View style={{flex:1}}>
                                <View style={{width: '100%',borderTopWidth:1,borderTopColor:'#999',marginTop:10,paddingTop:10,paddingLeft:15,paddingRight:15,}}>
                                    <Button  icon={{ name: "photo" }} title="Choose Photo" buttonStyle={{display: 'flex',width:'100%',height:50,backgroundColor:Colors.green,justifyContent:'center',alignContent:'center',alignItems:'center'}} titleStyle={{textAlign:'center'}} onPress={()=> this.handleChoosePhoto(0)} />
                                </View>
                            </View>
                            <View style={{flex:1}}>
                                <View style={{width: '100%',borderTopWidth:1,borderTopColor:'#999',marginTop:10,paddingTop:10,paddingLeft:15,paddingRight:15,}}>
                                    <Button  icon={{ name: "camera" }} title="Open Cameara" buttonStyle={{display: 'flex',width:'100%',height:50,backgroundColor:Colors.green,justifyContent:'center',alignContent:'center',alignItems:'center'}} titleStyle={{textAlign:'center'}} onPress={() => this.handleChoosePhoto(1)} />
                                </View>
                            </View>
                        </View>
                        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center',backgroundColor:'#eee',width:'100%',height:200,marginTop:10}}>
                            <Image
                                source={{ uri: this.state.photo ? this.state.photo : null  }}
                                style={{ width: '100%', height: 200 }}
                                resizeMode="cover"
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={styles.container_bottom}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={()=>this.handleNext()}>
                            <Text style={{color:'#fff',fontSize:24}}>
                                <Text style={{color:'#fff',paddingRight:10}}>
                                    Continue 
                                </Text>  
                                <Text> <></>
                                    <Icon
                                        name='arrow-circle-right'
                                        size={24}
                                        color='white'
                                        
                                    />
                                </Text> 
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row'
    },  
    main_logo:{
        width:'100%',
    },
    container_bottom: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor:Colors.yellow,
    },
    botton_action_center:{
        flex: 1, flexDirection: 'row' ,
    },
    bottom_items:{
        flex: 1, alignItems: 'center', justifyContent: 'center' 
    }
});
export default OrderDetails;