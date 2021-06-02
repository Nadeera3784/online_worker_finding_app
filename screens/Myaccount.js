import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosService from "../tools/axiosService";
import AwesomeAlert from "react-native-awesome-alerts";
import  * as ImagePicker from 'react-native-image-picker';
const Animation = () =>{
    return (
        <View style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:200}}>
             <View style={{width:40,height:40}}>
                <ActivityIndicator size="large" color={Colors.yellow} />
            </View>
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

class Myaccount extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            name:'',
            username:'',
            mobile:'',
            date:new Date(),
            address:'',
            c_password:'',
            password:null,
            password_confirmation:null,
            is_show_change_password:false,
            profile_uploader:false,
            showAlert:false,
            alertMessage:'',
            alertTitle:'',
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
        this.setState({profile_uploader:false})
    }
    componentDidMount(){
        this.props.navigation.setParams({ 
            handleFilterPress: this.logOut.bind(this) 
        });
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.ActiveMe();
        });
        this.ActiveMe();
    }
    ActiveMe(){
        this.fetchData();
    }
    SaveInfo = async ()=>{
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        this.setState({ready:false});
        var fd = new FormData();
        if(this.state.photo){
            fd.append('file', { uri: this.state.photo, name: this.state.fileName, type:this.state.filetype });
        }
        
        fd.append('username',this.state.username);
        fd.append('address',this.state.address);
        fd.append('name',this.state.name);
        fd.append('mobile',this.state.mobile);
        fd.append('c_password',this.state.c_password);
        if(this.state.password && this.state.password !=''){
            fd.append('password_confirmation',this.state.password);
            fd.append('password',this.state.password_confirmation);
        }

        await axiosService.post('/save-my-info',fd,{headers:{'Accept'    : 'application/json','Content-Type': 'multipart/form-data',Authorization: `Bearer ${this.state.token}`}}).then((response) => {
            
            if(response.data.status == 1){
                this.setState({alertTitle:'Success'});
                this.setState({alertMessage:'Profile has been updated'});
                this.setState({showAlert:true});
            }else{
                this.setState({alertTitle:'Unable to update user info, please try again later'});
                this.setState({alertMessage:response.data.message});
                this.setState({showAlert:true});
            }
        }).catch((error) => {
            console.log(error);
            let error_m='Server error';
                 error_m='';
               
             const arr = Object.keys(error.response.data.errors).map((key) => [error.response.data.errors[key]]);
             arr.map((data,index) =>{
                 error_m=error_m +`
 ` + data;
             });
            this.setState({alertTitle:'Error'});
            this.setState({alertMessage:error_m});
            this.setState({showAlert:true});
        });
        this.setState({ready:true});
    }
    fetchData = async ()=>{
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        this.setState({ready:false});
        await axiosService.get('/my-profile/',{
            params:{},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                this.setState({username:response.data.username});
                this.setState({name:response.data.name});
                this.setState({mobile:response.data.mobile});
                this.setState({address:response.data.address});
                this.setState({avatar:response.data.avatar});
            }else{
                this.setState({alertTitle:'Unable to get my profile info'});
                this.setState({alertMessage:response.data.message});
                this.setState({showAlert:true});
            }
        }).catch((error) => {
            console.log(error.response);
            let error_m='Server error';
                 error_m='';
               
             const arr = Object.keys(error.response.data.errors).map((key) => [error.response.data.errors[key]]);
             arr.map((data,index) =>{
                 error_m=error_m +`
 ` + data;
             });
            this.setState({alertTitle:'Error'});
            this.setState({alertMessage:error_m});
            this.setState({showAlert:true});
        });
        this.setState({ready:true});
    }
    logOut = async ()=>{
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        this.setState({ready:false});
        await axiosService.post('/logout',{
           
        },{headers:{Authorization: `Bearer ${this.state.token}`,'Accept'    : 'application/json'}}).then((response) => {
            if(response.data.status == 1){
                AsyncStorage.clear();
                this.props.navigation.navigate('Login');
            }else{
                this.setState({alertTitle:'Unable to logout'});
                this.setState({alertMessage:response.data.message});
                this.setState({showAlert:true});
            }
        }).catch((error) => {
            console.log(error.response);
            let error_m='Server error';
                 error_m='';
               
             const arr = Object.keys(error.response.data.errors).map((key) => [error.response.data.errors[key]]);
             arr.map((data,index) =>{
                 error_m=error_m +`
 ` + data;
             });
            this.setState({alertTitle:'Error'});
            this.setState({alertMessage:error_m});
            this.setState({showAlert:true});
        });
        this.setState({ready:true});
    }
    handle(){
        if(this.state.is_show_change_password == false){
            this.setState({is_show_change_password:true});
        }else{
            this.setState({is_show_change_password:false});
        }
    }
    render(){
        return (
            <View style={{paddingTop:5,flex:1,}}>
                {this.state.ready ? null : <Animation/>}
                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    title={this.state.alertTitle}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    onDismiss={ () => this.setState({showAlert:false})}
                />
                <AwesomeAlert
                    show={this.state.profile_uploader}
                    showProgress={false}
                    title='Select profile picture'
                    message={false}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="Take from Camera"
                    confirmText="Selete From Library"
                    confirmButtonColor={Colors.primary}
                    cancelButtonColor={Colors.yellow}
                    onCancelPressed={() => {
                        this.handleChoosePhoto(1);
                    }}
                    onConfirmPressed={() => {
                        this.handleChoosePhoto(0);
                    }}
                />
                <View style={this.state.ready ? { padding:10 } : {display:'none'}}>
                    <ScrollView>
                        <View>
                            <View style={{flex:1,justifyContent:'center',marginBottom:30}}>
                                <Image source={{ uri: this.state.photo ? this.state.photo : this.state.avatar  }} resizeMode="center" style={{width:'100%',height:100,paddingBottom:20,borderRadius:1000}}/>
                                <TouchableOpacity onPress={()=>this.setState({profile_uploader:true})}  style={{position:'absolute',bottom:-20,left:'46%'}}>
                                    <Icon
                                        name='camera'
                                        size={24}
                                        color={Colors.yellow}
                                    />
                                </TouchableOpacity>
                            </View>
                            <Input
                                placeholder='Full name'
                                leftIcon={
                                    <Icon
                                    name='user'
                                    size={24}
                                    color='black'
                                    />
                                }
                                value={this.state.name}
                                onChangeText={(name) => this.setState({name:name})}
                                inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                            />
                            <Input
                                placeholder='Address'
                                leftIcon={
                                    <Icon
                                    name='home'
                                    size={24}
                                    color='black'
                                    />
                                }
                                value={this.state.address}
                                onChangeText={(address) => this.setState({address:address})}
                                inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                            />
                            <Input
                                placeholder='Mobile Number'
                                leftIcon={
                                    <Icon
                                    name='mobile'
                                    size={24}
                                    color='black'
                                    />
                                }
                                value={this.state.mobile}
                                onChangeText={(mobile) => this.setState({mobile:mobile})}
                                inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                            />
                            
                            <Input
                                placeholder='Username'
                                leftIcon={
                                    <Icon
                                        name='user'
                                        size={24}
                                        color='black'
                                    />
                                }
                                value={this.state.username}
                                onChangeText={(username) => this.setState({username:username})}
                                inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                            />
                            <Button
                                title="Change Password"
                                buttonStyle={{backgroundColor:Colors.white,minHeight:40,borderRadius:20,}}
                                titleStyle={{color:Colors.primary,textAlign:'left'}}
                                onPress={()=> this.handle()}
                            />
                            <View style={this.state.is_show_change_password ? {display:'flex'} : {display:'none'}}>
                                <Input
                                    placeholder='New Password'
                                    leftIcon={
                                        <Icon
                                            name='lock'
                                            size={24}
                                            color='black'
                                        />
                                    }
                                    secureTextEntry={true}
                                    onChangeText={(password) => this.setState({password:password})}
                                    inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                                />
                                <Input
                                    placeholder='Confirm New Password'
                                    leftIcon={
                                        <Icon
                                        name='lock'
                                        size={24}
                                        color='black'
                                        />
                                    }
                                    secureTextEntry={true}
                                    onChangeText={(password_confirmation) => this.setState({password_confirmation:password_confirmation})}
                                    inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                                />
                            </View>
                            <Input
                                placeholder='Current Password'
                                leftIcon={
                                    <Icon
                                    name='lock'
                                    size={24}
                                    color='black'
                                    />
                                }
                                secureTextEntry={true}
                                onChangeText={(c_password) => this.setState({c_password:c_password})}
                                inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                            />
                            <View>
                                <Button
                                    title="Update Profile"
                                    buttonStyle={{backgroundColor:Colors.yellow,minHeight:50,borderRadius:20,}}
                                    onPress={()=>this.SaveInfo()}
                                />
                            </View>
                        </View>
                    </ScrollView>
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
});
export default Myaccount;