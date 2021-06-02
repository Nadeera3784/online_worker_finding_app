import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,Linking} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button,Tab,Card  } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosService from "../tools/axiosService";
import AwesomeAlert from "react-native-awesome-alerts";

const Animation = () =>{
    return (
        <View style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:200}}>
             <View style={{width:40,height:40}}>
                <ActivityIndicator size="large" color={Colors.yellow} />
            </View>
        </View>
    )
}

class ViewOrder extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            order:null,
            is_worker:false,
            date:new Date(),
            user_data:{
                user_type:0,
            },status:0,
            acceptAlert:false,
            rejectALert:false,
            showAlert:false,
            alertMessage:'',
            alertTitle:'',
            completeAlert:false,
        }
    }

    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.ActiveMe();
        });
        this.ActiveMe();
    }

    ActiveMe(){
        this.setState({'order_id':this.props.route.params.order_id});
        this.fetchData();
    }

    ChangeOrderStatus = async (status) =>{
        this.setState({ready:false});
        let url='/accept-order/'+this.state.order_id;
        if(status ==2){
            url='/cancel-order/'+this.state.order_id;
        }else if(status == 3){
            url='/complete-order/'+this.state.order_id;
        }
        await axiosService.post(url,{

        },{headers:{'Accept'    : 'application/json','Content-Type': 'multipart/form-data',Authorization: `Bearer ${this.state.token}`}}).then((response) => {
            
            if(response.data.status == 1){
                this.setState({alertTitle:'Success'});
                this.setState({alertMessage:'Order has been updated'});
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
        await AsyncStorage.getItem('user_data').then((user_data)=> user_data ? this.setState({user_data:JSON.parse(user_data)}) : null);
        this.setState({ready:false});
        await axiosService.get('/get-order-details/'+this.state.order_id,{
            params:{},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                this.setState({order_id:response.data.order.id});
                this.setState({category_name:response.data.order.category.name});
                this.setState({issue_name:response.data.order.issue.name});

                this.setState({description:response.data.order.description});
                this.setState({date:new Date(response.data.order.date)});
                this.setState({time:response.data.order.time});

                this.setState({worker_name:response.data.order.worker.name});
                this.setState({worker_mobile:response.data.order.worker.mobile_number});
                this.setState({worker_email:response.data.order.worker.email});

                this.setState({worker_address:response.data.order.worker.address});
                this.setState({area_name:response.data.order.area.name});
                this.setState({address:response.data.order.address});
                this.setState({image:response.data.order.image});
                this.setState({status:response.data.order.status});
            }else{
                this.setState({alertTitle:'Unable to get my order'});
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

    render(){
        return (
            <View style={{paddingTop:5,flex:1,}}>
                {this.state.ready ? null : <Animation/>}
                <AwesomeAlert
                    show={this.state.acceptAlert}
                    showProgress={false}
                    title='Confirm to accept'
                    message='Please confirm to accept this order and order will be started'
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No"
                    confirmText="Confirm"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.ChangeOrderStatus(1);
                    }}
                    onDismiss={ () => this.setState({acceptAlert:false})}
                />
                <AwesomeAlert
                    show={this.state.rejectALert}
                    showProgress={false}
                    title='Confirm to decline'
                    message='Please confirm to decline this order and order will be cancelled'
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No"
                    confirmText="Confirm"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.ChangeOrderStatus(2);
                    }}
                    onDismiss={ () => this.setState({rejectALert:false})}
                />
                <AwesomeAlert
                    show={this.state.completeAlert}
                    showProgress={false}
                    title='Confirm to complete'
                    message='Please confirm to complete this order and order will be finished'
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={false}
                    showCancelButton={true}
                    showConfirmButton={true}
                    cancelText="No"
                    confirmText="Confirm"
                    onCancelPressed={() => {
                        this.hideAlert();
                    }}
                    onConfirmPressed={() => {
                        this.ChangeOrderStatus(2);
                    }}
                    onDismiss={ () => this.setState({completeAlert:false})}
                />
                <AwesomeAlert
                    show={this.state.showAlert}
                    showProgress={false}
                    title={this.state.alertTitle}
                    message={this.state.alertMessage}
                    closeOnTouchOutside={true}
                    closeOnHardwareBackPress={true}
                    onDismiss={ () => this.setState({showAlert:false})}
                />
                <View style={this.state.ready ? { flex: 9,padding:10,display:'flex' } : {display:'none'}}>
                    <ScrollView>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Order ID</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>#{this.state.order_id}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Category</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.category_name}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Issue</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.issue_name}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Description</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.description}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Requested Date</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.date.toDateString()}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Requested Time</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.time}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Service Provider Name</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.worker_name}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Service Provider Mobile</Text>
                            <TouchableOpacity onPress={()=>Linking.openURL(`tel:${this.state.worker_mobile}`)}>
                                <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.worker_mobile}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Service Provider Email</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.worker_email}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Service Provider Address</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.worker_address}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',width:'100%',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Area</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.area_name}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Location Address</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.address}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Issue Image</Text>
                            <Image source={{uri:this.state.image}} resizeMode='center' style={{width:'100%',height:200}}></Image>
                        </View>
                    </ScrollView>
                </View>
                <View style={this.state.ready  ?  this.state.user_data.user_type == 0 ? styles.container_bottom_green : styles.container_bottom_yellow :  {display:'none'}}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={this.state.user_data.user_type == 0 ?  {alignItems:'center',justifyContent:'center'} : {display:'none'}} onPress={()=>Linking.openURL(`tel:${this.state.worker_mobile}`)}>
                            <Text style={{color:'#fff',fontSize:24}}>
                                <Icon
                                    name='phone'
                                    size={24}
                                    color='white'
                                    
                                />
           
                                <Text style={{color:'#fff',paddingRight:10}}>
                                <></> {this.state.worker_mobile}  
                                </Text>  
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.user_data.user_type == 0 && this.state.status ==1 ?  styles.bottom_items : {display:'none'}} onPress={()=> this.setState({completeAlert:true})}>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='check'
                                        size={24}
                                        color='green'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>Complete</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.user_data.user_type == 1 && this.state.status ==0 ?  styles.bottom_items : {display:'none'}} onPress={()=> this.setState({acceptAlert:true})}>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='check'
                                        size={24}
                                        color='green'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>Accept</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={this.state.user_data.user_type == 1 && this.state.status ==0  ?  styles.bottom_items : {display:'none'}} onPress={()=> this.setState({rejectALert:true})}>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='times'
                                        size={24}
                                        color='red'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>Decline</Text>
                            </View>
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
    item_panel:{
        width:'33.33%',
        padding:20,
        alignItems:'center'
    },
    container_bottom_green: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.green,
    },
    container_bottom_yellow: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: Colors.yellow,
    },
    botton_action_center:{
        flex: 1, flexDirection: 'row' ,
    },
    bottom_items:{
        flex: 1, alignItems: 'center', justifyContent: 'center' 
    }
});
export default ViewOrder;
