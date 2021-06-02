import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button } from "react-native-elements";
import AsyncStorage from '@react-native-async-storage/async-storage';
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

class OrderSelectWorker extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            search_query:'',
            workers:{},
            selected_worker_id:0,
            itemsact:0,
            location_id:'',
            show_empty:false,
        }
    }
    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.ActiveMe();
        });
        this.fetchData();
        this.ActiveMe();
    }
    componentWillUnmount() {
        this._unsubscribe();
    }
    ActiveMe(){
        this.setState({location_id:this.props.route.params.location_id});
        this.fetchData();
    }
    searchFunc = async (search)=> {
        this.setState({show_empty:false});
        this.setState({search_query:search});
        this.setState({ready:false});
        this.setState({itemsact:0});
        await axiosService.get('/service-provider',{
            params:{location:this.state.location_id > 0 ? this.state.location_id : '',search:this.state.search_query},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                if(response.data.data.length > 0){
                    AsyncStorage.setItem('workers',JSON.stringify(response.data.data));
                    this.setState({workers:response.data.data});
                }else{
                    this.setState({show_empty:true});
                    this.setState({workers:{}});
                }
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
    fetchData = async () => {
        this.setState({show_empty:false});
        this.setState({itemsact:0});
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : this.popme());
        this.setState({ready:false});
        await axiosService.get('/service-provider',{
            params:{location:this.state.location_id > 0 ? this.state.location_id : ''},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            console.log(response.data);
            if(response.data.status == 1){
                if(response.data.data.length > 0){
                    AsyncStorage.setItem('workers',JSON.stringify(response.data.data));
                    this.setState({workers:response.data.data});
                }else{
                    this.setState({show_empty:true});
                    this.setState({workers:{}});
                }
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
    showWorker(item,id){
        return (
            <TouchableOpacity onPress={()=> this.SelectWorkerId(item.id)} style={styles.item_panel}>
                <Image source={{uri:item.avatar}} resizeMode="center" style={{width:'100%',height:100,paddingBottom:20,borderRadius:1000}}/>
                <Text style={{fontSize:14,textAlign:'center'}}>{item.name}</Text>
                    <View style={this.state.itemsact == item.id ? {position:'absolute',top:30,right:0} : {display:'none'}}>
                        <Icon
                            name='check-circle'
                            size={24}
                            color={Colors.green}
                        />
                    </View>
            </TouchableOpacity>
        )
    }

    SelectWorkerId(id){
        this.setState({itemsact:id});
    }
    continueNext = async () => {
        if(this.state.itemsact != 0 && this.state.itemsact !=''){
            await AsyncStorage.setItem('worker_id',this.state.itemsact.toString());
            this.props.navigation.navigate('OrderDetails');
        }
    }
    render(){
        return (
            <View style={{paddingTop:5,flex:1,}}>
                <View style={{ flex: 9, alignItems: 'center', justifyContent: 'center', }}>
                    <View style={{flexDirection:'row',}}>
                        <Input
                            placeholder='Search worker'
                            leftIcon={{ type: 'font-awesome', name: 'search' }}
                            onChangeText={text => this.searchFunc(text)}
                            value={this.state.search_query}
                        />
                        
                    </View>
                    <View style={{justifyContent:'flex-start'}}>
                        <Button
                            buttonStyle={{backgroundColor:Colors.yellow,marginTop:0}}
                            title={this.state.location_id ? "Filter Location" : "Filter Location"}
                            type="solid"
                            titleStyle={{fontSize:16}}
                            onPress={()=>this.props.navigation.navigate('OrderFilterLocation')}
                        />
                    </View>
                    {this.state.ready ? null : <Animation/>}
                    <View style={styles.container}>
                        <FlatList
                            horizontal={false}
                            data={this.state.workers}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.showWorker(item, index)}
                        />
                    </View>
                    <View style={this.state.show_empty ? {display:'flex',flex:9,justifyContent:'center'} : {display:'none'}}>
                        <View style={{padding:10}}>
                            <Text style={{textAlign:'center',fontSize:20,color:'red'}}>Not found any service provider</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.container_bottom}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={{alignItems:'center',justifyContent:'center'}} onPress={()=>this.continueNext()}>
                            <Text style={{color:'#fff',fontSize:24}}>
                                <Text style={{color:'#fff',paddingRight:10}}>
                                    Select  
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
    item_panel:{
        width:'33.33%',
        padding:20,
        alignItems:'center',
    },
    item_panelActive:{
        width:'33.33%',
        padding:20,
        alignItems:'center',
        borderRadius:1000,
        backgroundColor:Colors.green
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
export default OrderSelectWorker;