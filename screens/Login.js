import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image} from 'react-native';
import { Button, Input } from 'react-native-elements';
import {Colors} from "../assets";
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

class Login extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:true,
            email:'',
            password:'',
        }
    }
    Login = async ()=> {
        console.log('login');
         //Login Function
         this.setState({ready:false});
         await axiosService.post('/login',{
             email:this.state.email,
             password:this.state.password,
             device_name:'unknown'
         }).then(response => {
             if(response.data.status == 1){
                 console.log(response.data);
                 AsyncStorage.setItem('token',response.data.token).then((token)=>{this.setState({token:token})});
                 AsyncStorage.setItem('user_data',JSON.stringify(response.data.user_data)).then((data) => this.setState({user_data:data}));
                 this.props.navigation.navigate('Home');
             }else{
                 this.setState({alertTitle:'Invalid Login Details'});
                 this.setState({alertMessage:response.data.message});
                 this.setState({showAlert:true});
             }
         }).catch(error => {
             let error_m='Server error';
             if (error.response.status == 422){
                 error_m='';
             const arr = Object.keys(error.response.data.errors).map((key) => [error.response.data.errors[key]]);
             arr.map((data,index) =>{
                 error_m=error_m +`
 ` + data;
             });
             }
             this.setState({alertTitle:'Error'});
             this.setState({alertMessage:error_m});
             this.setState({showAlert:true});
         });
         this.setState({ready:true});
    }
    render(){
        return (
            <View style={styles.container}>
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
                <View style={this.state.ready ? {backgroundColor:'#fff'} : {display:'none'}}>  
                    <Image source={require('../assets/images/logo.png')}
                        resizeMode="center"
                        style={styles.main_logo}
                    />
                    <Input
                        placeholder='Username or Email'
                        leftIcon={
                            <Icon
                                name='user'
                                size={24}
                                color='black'
                            />
                        }
                        onChangeText={(email)=> this.setState({email:email})}
                        inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:5}}
                    />
                    <Input
                        placeholder='Password'
                        leftIcon={
                            <Icon
                            name='lock'
                            size={24}
                            color='black'
                            />
                        }
                        secureTextEntry={true}
                        onChangeText={(password)=> this.setState({password:password})}
                        inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:5}}
                    />
                    
                    <Button
                        title="Login"
                        type="solid"
                        buttonStyle={{backgroundColor:Colors.yellow,minHeight:50,borderRadius:20}}
                        onPress={()=> this.Login()}
                    />
                    <View style={{marginTop:20}}>
                        <Button
                            title="Register"
                            buttonStyle={{backgroundColor:Colors.primary,minHeight:50,borderRadius:20,}}
                            onPress={()=> this.props.navigation.navigate('Register')}
                        />
                    </View>
                </View>
            </View>
        );
    }
    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding:15,
    },  
    main_logo:{
        width:'100%',
    },
});
export default Login;