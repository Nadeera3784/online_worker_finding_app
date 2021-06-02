import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text } from "react-native-elements";
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

class Home extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            categories:{},
            user_data:{
                user_type:0,
            }
        }
    }
    componentDidMount(){
        this.fetchData();
    }
    fetchData = async () => {
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        await AsyncStorage.getItem('user_data').then((user_data)=> user_data ? this.setState({user_data:JSON.parse(user_data)}) : null);
        this.setState({ready:false});
        axiosService.get('/categories',{
            params:{},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                AsyncStorage.setItem('categories',JSON.stringify(response.data.data));
                this.setState({categories:response.data.data});
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
    continueNext = async (category_id,category_name) => {
        await AsyncStorage.setItem('selected_category',category_id.toString()).then((category_id) => category_id ? this.setState({category_id:category_id}) : null);
        await AsyncStorage.setItem('category_name',category_name.toString()).then((category_name) => category_name ? this.setState({category_name:category_name}) : null);
        this.props.navigation.navigate('OrderSelectServiceIssue');
    }
    showCategory(category,id){
        return (
            <TouchableOpacity onPress={()=> this.continueNext(category.id,category.name)} style={styles.item_panel}>
                <Image source={{uri:category.image}} resizeMode="center" style={{width:'100%',height:100,paddingBottom:20}}/>
                <Text style={{fontSize:16,textAlign:'center'}}>{category.name}</Text>
            </TouchableOpacity>
        )
    }
    render(){
        return (
            <View style={{paddingTop:20,flex:1,}}>
                {this.state.ready ? null : <Animation/>}
               <View style={{ flex: 9, alignItems: 'center', justifyContent: 'center', }}>
                    <View>
                        <View style={styles.container}>
                            <FlatList
                                horizontal={false}
                                data={this.state.categories}
                                keyExtractor={item => item.id.toString()}
                                renderItem={({ item, index }) => this.showCategory(item, index)}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.container_bottom}>
                    <View style={styles.botton_action_center}>
                        <TouchableOpacity style={styles.bottom_items} onPress={()=> this.props.navigation.navigate('Home')}>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='cart-plus'
                                        size={24}
                                        color='white'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>New Order</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottom_items} onPress={()=> this.state.user_data.user_type == 0 ? this.props.navigation.navigate('MyOrders') : this.props.navigation.navigate('MyReceivedOrder') }>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='shopping-bag'
                                        size={24}
                                        color='white'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>My Orders</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.bottom_items} onPress={()=> this.props.navigation.navigate('Myaccount')}>
                            <View>
                                <Text style={{textAlign:'center'}}>
                                    <Icon
                                        name='user'
                                        size={24}
                                        color='white'
                                    />
                                </Text>
                                <Text style={{textAlign:'center',color:'#fff'}}>Profile</Text>
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
        flexDirection: 'row',
        width:'100%'
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
        backgroundColor:Colors.yellow,
    },
    botton_action_center:{
        flex: 1, flexDirection: 'row' ,
    },
    bottom_items:{
        flex: 1, alignItems: 'center', justifyContent: 'center' 
    }
});
export default Home;