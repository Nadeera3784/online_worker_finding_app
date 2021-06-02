import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { CheckBox, Text } from "react-native-elements";
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'; 
import Geolocation from '@react-native-community/geolocation';
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
function log(eventName, e) {
    console.log(eventName, e.nativeEvent);
}
function moveToNext(){
    alert(1);
}
class OrderSelectMapArea extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:true,
            map_lat:37.78825,
            map_lan: -122.4324,
        }
    }
    SetRegiion = async (position)=>{
        let region = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };
        this.setState({
            map_lan: region.longitude,
            map_lat: region.latitude,
        });
        await AsyncStorage.setItem('map_lan',  this.state.map_lan.toString());
        await AsyncStorage.setItem('map_lat',this.state.map_lat.toString());
    }
    
    componentDidMount() {
        this.props.navigation.setParams({ 
            handleFilterPress: this.moveNext.bind(this) 
        });
        Geolocation.getCurrentPosition(
            position => this.SetRegiion(position)
            
        ),
        error => alert(JSON.stringify(error)), {
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1000
        }
    }
    moveNext() {
        this.props.navigation.navigate('OrderSelectWorker',{location_id:''});
    }
    onMarkerDragEnd = async (coord) => {
        this.setState({
            map_lan: coord.nativeEvent.coordinate.longitude,
            map_lat: coord.nativeEvent.coordinate.latitude,
        });
        await AsyncStorage.setItem('map_lan',  this.state.map_lan.toString());
        await AsyncStorage.setItem('map_lat',this.state.map_lat.toString());
        
    };
    render(){
        return (
            <MapView
                    style={{ flex: 1, }}
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    followUserLocation
                    onTouchEnd={(e)=> log('touch',e)}
                    loadingEnabled={true}
                    initialRegion={{
                    latitude: this.state.map_lat,
                    longitude: this.state.map_lan,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421}}
                >
                <Marker 
                    coordinate={{ latitude: this.state.map_lat, longitude: this.state.map_lan }}
                    onSelect={e => log('onSelect', e)}
                    onDrag={e => log('onDrag', e)}
                    onDragStart={e => log('onDragStart', e)}
                    onDragEnd={e => this.onMarkerDragEnd(e)}
                    onPress={e => log('onPress', e)}
                    draggable
                ></Marker>
            </MapView>
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
    map: {
        ...StyleSheet.absoluteFillObject,
      },
});
export default OrderSelectMapArea;