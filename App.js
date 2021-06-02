/**
 * Online Owkring Finder App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  Image,
  TouchableOpacity,
  Button,
  Text,
  View
} from 'react-native';
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/FontAwesome';
import {
    Splash,
    Login,
    Register,
    Home,
    OrderSelectServiceIssue,
    OrderSelectServiceArea,
    OrderSelectMapArea,
    OrderSelectWorker,
    OrderDetails,
    OrderSummery,
    Myaccount,
    MyOrders,
    
} from "./screens";
import { Colors } from './assets';
import OrderFilterLocation from './screens/OrderFilterLocation';
import OrderThank from './screens/OrderThank';
import ViewOrder from './screens/ViewOrder';
import MyReceivedOrder from './screens/MyReceivedOrder';

const theme = {
  ...DefaultTheme,
  colors: {
      ...DefaultTheme.colors,
      border: "transparent",
  },
};
const Stack = createStackNavigator();
function LogoTitle() {
    return (
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '80%'}}>
            <Image
                style={{  height: 50,width:'100%',alignSelf:'center' }}
                resizeMode="cover"
                source={require("./assets/images/logo.png")}
            />
        </View>
    );
}
const App = () => {
    return (
        <NavigationContainer theme={theme}>
            <Stack.Navigator
                initialRouteName={'StartScreen'}
                screenOptions={{
                    headerStyle: { elevation: 0 },
                    cardStyle: { backgroundColor: '#fff' }
                }}
            >
            {/* Screens */}
            <Stack.Screen
                name="StartScreen"
                component={Splash}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: 'white',
                        height:80,
                    },
                    
                    headerTitle: props => <LogoTitle {...props} />,
                    headerHideShadow: false,
                    headerLeft: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                            <Icon
                            name='list'
                            size={24}
                            color='black'
                            />
                        </TouchableOpacity>
                       
                    ),
                    
                   
                }}
            />
            <Stack.Screen
                name="OrderSelectServiceIssue"
                component={OrderSelectServiceIssue}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "Select Serive Type",
                    
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                           <Text style={{color:'#fff'}}>CANCEL</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                }}
            />
            <Stack.Screen
                name="OrderSelectServiceArea"
                component={OrderSelectServiceArea}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "Select Serive Area",
                   
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                           <Text style={{color:'#fff'}}>CANCEL</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                }}
            />
            <Stack.Screen
                name="OrderSelectMapArea"
                component={OrderSelectMapArea}
                options={({navigation,route}) => ({
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTintColor:'#fff',
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTitle: "Select Location",
                   
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}  onPress={()=>route.params.handleFilterPress()}>
                           <Text style={{color:'#fff',fontSize:16}}>Next</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                })}
            />
            <Stack.Screen
                name="OrderSelectWorker"
                component={OrderSelectWorker}
                
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTintColor:'#fff',
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTitle: "Select Service Provider",
                   
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                           <Text style={{color:'#fff',fontSize:16}}>Next</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                }}
            />
            <Stack.Screen
                name="OrderDetails"
                component={OrderDetails}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "About Issue",
                   
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                           <Text style={{color:'#fff',fontSize:16}}>Cancel</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                }}
            />
            <Stack.Screen
                name="OrderSummery"
                component={OrderSummery}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTitle: "Order Summery",
                  
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}}>
                           <Text style={{color:'#fff',fontSize:16}}>Cancel</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                }}
            />
            <Stack.Screen
                name="Myaccount"
                component={Myaccount}
                options={({navigation,route}) => ({
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "My Profile",
                    headerRight: () => (
                        <TouchableOpacity style={{padding:10,marginTop:0}} onPress={()=>route.params.handleFilterPress()}>
                           <Text style={{color:'#fff',fontSize:18,fontWeight:'bold'}}>
                                <Icon
                                name='sign-out'
                                size={18}
                                color='#fff'
                                /> <></>
                               Logout</Text>
                        </TouchableOpacity>
                       
                    ),
                   
                   
                })}
            />
            <Stack.Screen
                name="MyOrders"
                component={MyOrders}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTitle: "My Order List",
                   
                    
                   
                }}
            />
            <Stack.Screen
                name="MyReceivedOrder"
                component={MyReceivedOrder}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTitle: "My Order Lists",
                }}
            />
            <Stack.Screen
                name="OrderFilterLocation"
                component={OrderFilterLocation}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "Filter By Location",
                   
                }}
            />
            <Stack.Screen
                name="ViewOrder"
                component={ViewOrder}
                options={{
                    headerStyle:{
                        shadowColor: 'black',
                        shadowOpacity: 0.26,
                        shadowOffset: { width: 0, height: 2},
                        shadowRadius: 10,
                        elevation: 3,
                        backgroundColor: Colors.yellow,
                        height:70,
                    },
                    headerTitleStyle:{
                        color:'#fff'
                    },
                    headerTintColor:'#fff',
                    headerTitle: "View Order",
                   
                }}
            />
             <Stack.Screen
                name="OrderThank"
                component={OrderThank}
                options={{ headerShown: false }}
            />
             <Stack.Screen
                name="Register"
                component={Register}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            </Stack.Navigator>
        </NavigationContainer >
    )
}
export default App;
