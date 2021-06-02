import {Colors} from "../assets";
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {ActivityIndicator,StyleSheet,View,Image,TouchableOpacity,FlatList} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { Text,Input,Button,Tab,Card  } from "react-native-elements";
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

class MyOrders extends React.Component {
    constructor(){
        super();
        this.state ={
            ready:false,
            show_peding_tab:true,
            show_in_progress_tab:false,
            show_completed_tab:false,
            active_data:{},
            pending_data:{},
            cancelled_data:{},
        }
    }
    componentDidMount(){
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            this.ActiveMe();
        });
        this.ActiveMe();
    }
    ActiveMe(){
        this.fetchData();
    }
    fetchData = async () => {
        await AsyncStorage.getItem('token').then((token)=> token ? this.setState({token:token}) : null);
        this.setState({ready:false});
        await axiosService.get('/myorder',{
            params:{},headers:{Authorization: `Bearer ${this.state.token}`}
        }).then((response) => {
            if(response.data.status == 1){
                this.setState({active_data:response.data.active});
                this.setState({pending_data:response.data.pending});
                this.setState({cancelled_data:response.data.cancelled});
            }else{
                this.setState({alertTitle:'Unable to get my orders list'});
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
    componentWillUnmount() {
        this._unsubscribe();
    }
    ViewTabs(id){
        if(id == 0){
            this.setState({
                show_completed_tab:false,
                show_in_progress_tab:false,
                show_peding_tab:true
            });
        }else if(id ==1){
            this.setState({
                show_completed_tab:false,
                show_in_progress_tab:true,
                show_peding_tab:false
            });
        }else if(id ==2){
            this.setState({
                show_completed_tab:true,
                show_in_progress_tab:false,
                show_peding_tab:false
            });
        }
    }
    RenderOrder(item,id){
        return (
            <Card>
                <Card.Title>#{item.id} - {item.issue.name}</Card.Title>
                <Card.Divider/>
                <Image source={{uri:item.image}} resizeMode="center" style={{width:'100%',height:100}}></Image>
                <Text style={{marginBottom: 10}}>
                    <Icon
                        name='user'
                        size={24}
                        color='#222'
                        
                    />
                    <></> {item.worker.name}
                </Text>
                <Text style={{marginBottom: 10}}>
                    <Icon
                        name='clock-o'
                        size={24}
                        color='#222'
                        
                    />
                    <></> {new Date(item.date).toDateString()}
                </Text>
                <Text style={{marginBottom: 10}}>
                    <Icon
                        name='pencil'
                        size={24}
                        color='#222'
                        
                    />
                    {item.description}
                </Text>
                <Button
                    buttonStyle={{backgroundColor:Colors.yellow}}
                    title='View order'
                    type="solid"
                    titleStyle={{fontSize:20}}
                    onPress={()=> this.props.navigation.navigate('ViewOrder',{order_id:item.id})}
                />
            </Card>
        )
    }
    render(){
        return (
            <View >
                {this.state.ready ? null : <Animation/>}
                <View style={this.state.ready ? {padding:2} : {display:'none'}}>
                    <Tab>
                        <Tab.Item title="Active" key={0}  active={this.state.show_in_progress_tab ? true : false} titleStyle={{fontSize:12}}  onPressOut={()=> this.ViewTabs(0)} />
                        <Tab.Item title="Pending" key={1} active={this.state.show_completed_tab ? true : false} titleStyle={{fontSize:12}} onPressOut={()=> this.ViewTabs(1)}/>
                        <Tab.Item title="Completed" key={2} active={this.state.show_completed_tab ? true : false} titleStyle={{fontSize:12}} onPressOut={()=> this.ViewTabs(2)} />
                    </Tab>
                    
                    <View style={this.state.show_peding_tab ? null: {display:'none'}}>
                        <FlatList
                            horizontal={false}
                            data={this.state.active_data}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.RenderOrder(item, index)}
                        />
                    </View>
                    <View style={this.state.show_in_progress_tab ? null : {display:'none'}}>
                        <FlatList
                            horizontal={false}
                            data={this.state.pending_data}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.RenderOrder(item, index)}
                        />
                    </View>
                    <View style={this.state.show_completed_tab ? {display:'flex'} : {display:'none'}}>
                        <FlatList
                            horizontal={false}
                            data={this.state.cancelled_data}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item, index }) => this.RenderOrder(item, index)}
                        />
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
        backgroundColor:'#ff5',
    }, 
});
export default MyOrders;