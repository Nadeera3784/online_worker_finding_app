import React from 'react';
import {
    StyleSheet,
    Text,
    Image,
    View
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = ({ navigation }) => {
    setTimeout(() => {
        AsyncStorage.getItem('token').then((item)=> item ? navigation.navigate('Home') : navigation.navigate('Login') );
    }, 2000);
   return (
    <View style={{backgroundColor:'white'}}>
        <Image source={require('../assets/images/logo.png')}
                    resizeMode="center"
                    style={styles.main_logo}
        />
    </View>
   );
}


const styles = StyleSheet.create({

    reg_button:{
        width:'60%',
        height:50,
        padding:12,
        backgroundColor:'#fff',
        borderWidth:1,
        borderColor:'#ddd',
        textAlign:'center',
        borderRadius:5,
    },
    main_logo:{
        width:'100%',
        marginTop:260,
    },
    info_text:{
        fontSize:24,
        textAlign:'center',
    }
});


export default Splash;