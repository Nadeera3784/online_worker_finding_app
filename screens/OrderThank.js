import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

class OrderThank extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:true,
           order_id:'',
        }
    }
    componentDidMount(){
        this.setState({'order_id':this.props.route.params.order_id});
    }
    render(){
        return (
            <View style={{paddingTop:5,flex:1,justifyContent:'center',marginTop:100}}>
                {this.state.ready ? null : <Animation/>}
                <Text style={{textAlign:'center',fontSize:20,color:Colors.green}}>Thank you!!!</Text>
                <Text style={{textAlign:'center',fontSize:18,color:Colors.green}}>Your order (#{this.state.order_id}) has been submited to our service team and we will notify you when order is ready!</Text>
                <View style={{marginTop:20}}>
                    <Button
                        buttonStyle={{backgroundColor:Colors.green}}
                        title='Back To Home'
                        type="solid"
                        titleStyle={{fontSize:20}}
                        onPress={()=> this.props.navigation.navigate('Home')}
                    />
                </View>
            </View>
        )
    }
}

export default OrderThank;