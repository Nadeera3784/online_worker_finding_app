import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image} from 'react-native';
import { Button, CheckBox, Input } from 'react-native-elements';
import {Colors} from "../assets";
import { ScrollView } from 'react-native-gesture-handler';
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

class Register extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            showAlert:false,
            name:'',
            username:'',
            mobile:'',
            email:'',
            password:'',
            date:new Date(),
            address:'',
            mobile_number:'',
            is_show_change_password:false,
            is_user:true,
            is_worker:false,
        }
    }
    componentDidMount(){
        this.setState({ready:true});
    }
    handleType(id){
        if(id == 0){
            this.setState({is_user:true});
            this.setState({is_worker:false});
        }else{
            this.setState({is_user:false});
            this.setState({is_worker:true});
        }
    }
    Register = async () => {
        this.setState({ready:false});
        let type_u=0;
        if(this.state.is_worker){
            type_u=1;
        }
        await axiosService.post('/register',{
            name:this.state.name,
            address:this.state.address,
            email:this.state.email,
            password:this.state.register_password,
            mobile_number:this.state.mobile_number,
            username:this.state.username,
            type_u:type_u,
            device_name:'unknown',
        }).then((response) => {
            if(response.data.status == 1){
                AsyncStorage.setItem('token',response.data.token).then((token)=>{this.setState({token:token})});
                AsyncStorage.setItem('user_data',JSON.stringify(response.data.user_data)).then((data) => this.setState({user_data:data}));
                this.props.navigation.navigate('Home');
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
    render(){
       
        return (
                <View style={styles.container}>
                    <AwesomeAlert
                            show={this.state.showAlert}
                            showProgress={false}
                            title={this.state.alertTitle}
                            message={this.state.alertMessage}
                            closeOnTouchOutside={true}
                            closeOnHardwareBackPress={true}
                            onDismiss={ () => this.setState({showAlert:false})}
                        />
                    {this.state.ready ? null : <Animation/>}
                    <ScrollView>
                    <View style={this.state.ready ? {backgroundColor:'#fff'} : {display:'none'}}>  
                    <Image source={require('../assets/images/logo.png')}
                            resizeMode="center"
                            style={styles.main_logo}
                        />
                        <Input
                            placeholder='Full name'
                            leftIcon={
                                <Icon
                                name='user'
                                size={24}
                                color='black'
                                />
                            }
                            onChangeText={(name)=> this.setState({name:name}) }
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
                            onChangeText={(address)=> this.setState({address:address}) }
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
                            onChangeText={(mobile)=> this.setState({mobile_number:mobile}) }
                            inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                        />
                        <Input
                            placeholder='Email'
                            leftIcon={
                                <Icon
                                name='envelope'
                                size={24}
                                color='black'
                                />
                            }
                            onChangeText={(email)=> this.setState({email:email}) }
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
                            onChangeText={(username)=> this.setState({username:username}) }
                            inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
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
                            onChangeText={(password)=> this.setState({password:password}) }
                            inputContainerStyle={{borderRadius:5,borderColor:'#ddd',borderWidth:1,padding:3}}
                        />
                         <View style={{flex:1,justifyContent:'center'}}>
                            <CheckBox
                                title='Nomral User'
                                checkedIcon='dot-circle-o'
                                uncheckedIcon='circle-o'
                                checked={this.state.is_user}
                                onPress={()=> this.handleType(0)}
                            />
                                <CheckBox
                                    title='Service Provider'
                                    checkedIcon='dot-circle-o'
                                    uncheckedIcon='circle-o'
                                    checked={this.state.is_worker}
                                    onPress={()=> this.handleType(1)}
                                />
                         </View>
                        <View>
                            <Button
                                title="Register"
                                buttonStyle={{backgroundColor:Colors.yellow,minHeight:50,borderRadius:20,}}
                                onPress={()=> this.Register()}
                            />
                        </View>
                    </View>
                    </ScrollView>
                </View>
            
        );
    }
    
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding:1,
    },  
    main_logo:{
        width:'100%',
    },
});
export default Register;