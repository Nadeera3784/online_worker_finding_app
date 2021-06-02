import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button,Tab,Card  } from "react-native-elements";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosService from "../tools/axiosService";

class ActiveOrders extends React.Component {
    render(){
        return (
            <View></View>
        )
    }
}

export default ActiveOrders;