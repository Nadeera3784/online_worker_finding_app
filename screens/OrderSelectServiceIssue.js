import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, Text } from "react-native-elements";
import axiosService from "../tools/axiosService";
import AwesomeAlert from 'react-native-awesome-alerts';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Animation = () =>{
    return (
        <View style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:200}}>
             <View style={{width:40,height:40}}>
                <ActivityIndicator size="large" color={Colors.yellow} />
            </View>
        </View>
    )
}

class OrderSelectServiceIssue extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            issues:{},
            category_id:null,
        }
    }
    componentDidMount(){
        this.fetchDat();
    }
    fetchDat = async ()=>{
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : this.popme());
        await AsyncStorage.getItem('selected_category').then((selected_category)=> selected_category ? this.setState({category_id:selected_category}) : this.popme());
        this.setState({ready:false});
        await axiosService.get('/service-issues',{
            params:{
                category_id:this.state.category_id 
            },headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                AsyncStorage.setItem('issues',JSON.stringify(response.data.data));
                this.setState({issues:response.data.data});
            }else{
                this.setState({alertTitle:'Invalid Register Details'});
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
    handleCheck = (checkedId,name) => {
        this.setState({checkedId});
        this.setState({issue_name:name});
    }
    showItems (item,id) {
        const checkedId =this.state.checkedId;
        return (
            <CheckBox
                left
                title={item.name}
                key={item.id}
                checkedIcon='dot-circle-o'
                uncheckedIcon='circle-o'
                checked={item.id == checkedId}
                onPress={() => this.handleCheck(item.id,item.name)}
            />
        )
    }
    continueNext = async ()=> {
        await AsyncStorage.setItem('selected_issue',this.state.checkedId.toString()).then((issue_id) => issue_id ? this.setState({issue_id:issue_id}) : null);
        await AsyncStorage.setItem('issue_name',this.state.issue_name.toString()).then((issue_name) => issue_name ? this.setState({issue_name:issue_name}) : null);
        this.props.navigation.navigate('OrderSelectServiceArea');
    }
    render(){
        return (
            <View style={styles.container}>
                {this.state.ready ? null : <Animation/>}
                <View style={{ flex: 9, }}>
                    <FlatList
                        horizontal={false}
                        data={this.state.issues}
                        extraData={this.state.checked}
                        keyExtractor={item => item.id.toString()}
                        renderItem={({ item, index }) => this.showItems(item, index)}
                    />
                </View>
                <View style={styles.container_bottom}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={()=> this.continueNext()}>
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
        flexDirection: 'column'
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
});
export default OrderSelectServiceIssue;