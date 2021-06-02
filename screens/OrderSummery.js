import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from 'axios';
import axiosService from "../tools/axiosService";
const Animation = () =>{
    return (
        <View style={{width:'100%',display:'flex',justifyContent:'center',alignItems:'center',marginTop:200}}>
             <View style={{width:40,height:40}}>
                <ActivityIndicator size="large" color={Colors.yellow} />
            </View>
        </View>
    )
}

class OrderSummery extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:true,
            category:'',
            issue:'',
            description:'',
            date:new Date(),
            time:'',
            area:'',
            address:'',
        }
    }
    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.ActiveMe();
        });
        this.ActiveMe();
    }
    ActiveMe(){
        this.setState({'description':this.props.route.params.description});
        this.setState({'photo':this.props.route.params.photo});
        this.setState({'file_name':this.props.route.params.filename});
        this.setState({'file_type':this.props.route.params.filetype});
        this.setState({'date':this.props.route.params.date});
        this.setState({'time':this.props.route.params.time});

        console.log(this.props.route.params);
        this.fetchData();
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    fetchData = async () => {
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        await AsyncStorage.getItem('selected_category').then((c)=> c ? this.setState({category:c}) : null);
        await AsyncStorage.getItem('selected_issue').then((i)=> i ? this.setState({issue:i}) : null);
        await AsyncStorage.getItem('selected_area').then((a)=> a ? this.setState({area:a}) : null);

        await AsyncStorage.getItem('category_name').then((c)=> c ? this.setState({category_name:c}) : null);
        await AsyncStorage.getItem('issue_name').then((i)=> i ? this.setState({issue_name:i}) : null);
        await AsyncStorage.getItem('area_name').then((a)=> a ? this.setState({area_name:a}) : null);

        await AsyncStorage.getItem('map_lan').then((i)=> i ? this.setState({map_lan:i}) : null);
        await AsyncStorage.getItem('map_lat').then((a)=> a ? this.setState({map_lat:a}) : null);
        await AsyncStorage.getItem('worker_id').then((a)=> a ? this.setState({worker_id:a}) : null);
        

        await AsyncStorage.getItem('user_data').then((a)=> a ? this.setState({user_data:JSON.parse(a)}) : null);
        this.setState({address:this.state.user_data.address});
    }

    PlaceOrder = async ()=>{
        this.setState({ready:false});

        var fd = new FormData();
        fd.append('file', { uri: this.state.photo, name: this.state.file_name, type:this.state.file_type });
        fd.append('category_id',this.state.category);
        fd.append('type','0');
        fd.append('service_issue',this.state.issue);
        fd.append('service_area',this.state.area);
        fd.append('description',this.state.description);
        fd.append('address',this.state.address);
        fd.append('service_date',this.state.date.toISOString());
        fd.append('perferred_time',this.state.time);
        fd.append('map_lan',this.state.map_lan);
        fd.append('map_lat',this.state.map_lat);
        fd.append('worker_id',this.state.worker_id);
        fd.append('sasindu',1);
       
        await axiosService.post('/place-order',fd,{headers:{'Accept'    : 'application/json','Content-Type': 'multipart/form-data',Authorization: `Bearer ${this.state.token}`}}).then((response) => {
            if(response.data.status == 1){
                this.props.navigation.navigate('OrderThank',{order_id:response.data.data.order_id});
            }else{
                this.setState({alertTitle:'Invalid Order Details'});
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
            <View style={{paddingTop:5,flex:1,}}>
                {this.state.ready ? null : <Animation/>}
                <View style={this.state.ready ? { flex: 9,padding:10,display:'flex' } : {display:'none'}}>
                    <ScrollView>
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
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',width:'100%',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Area</Text>
                            <Text style={{marginTop:5,color:Colors.green,fontSize:16,fontWeight:'bold'}}>{this.state.area_name}</Text>
                        </View>
                        <View style={styles.container,{padding:5,borderBottomColor:'#eee',borderBottomWidth:1}}>
                            <Text h4 h4Style={{textAlign:'left'}}>Location Address</Text>
                            <Input
                                placeholder='Service Address'
                                onChangeText={address => this.setState({address:address})}
                                multiline = {true}
                                numberOfLines = {2}
                                value={this.state.address}
                            />
                        </View>
                    </ScrollView>
                </View>
                <View style={this.state.ready ? styles.container_bottom : {display:'none'}}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={()=>this.PlaceOrder()}>
                            <Text style={{color:'#fff',fontSize:24}}>
                                <Text style={{color:'#fff',paddingRight:10}}>
                                    Place a Order  
                                </Text>  
                                <Text> <></>
                                    <Icon
                                        name='check-circle'
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
    item_panel:{
        width:'33.33%',
        padding:20,
        alignItems:'center'
    },
    container_bottom: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor:Colors.green,
    },
    botton_action_center:{
        flex: 1, flexDirection: 'row' ,
    },
    bottom_items:{
        flex: 1, alignItems: 'center', justifyContent: 'center' 
    }
});
export default OrderSummery;