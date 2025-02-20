
import  {View,StyleSheet,Platform,Image,Text,TouchableOpacity,FlatList,Dimensions} from 'react-native';

// import {WalletCoinCard} from './WalletCoinCard';
// import {CoinCard} from './CoinCard';
import { useNavigation } from '@react-navigation/native';

import {MaterialIcons,Entypo,MaterialCommunityIcons,FontAwesome5, Ionicons,Feather,AntDesign, FontAwesome} from '@expo/vector-icons';

import COLORS  from '../Constant/colors';
import React, {useState, useEffect, useContext} from 'react';
import {globalStyles} from '../Styles/GlobalStyles';
import {useFonts} from 'expo-font';

export default function DirectHeader(  {title, screenName} ) {

    let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});



const navigation = useNavigation();

   
  const goBackPage = () => {
    navigation.navigate(screenName);
    //navigation.goBack();
  }

const GoHome = () => {
    navigation.navigate('Home Stack');
  }


  return (

     <>{!fontsLoaded ? (<View/>):(
  
 <View style={{
  backgroundColor:'#54524e',
  marginBottom: 10,
}}>          
             


      <View style={styles.headerbar}>
          <TouchableOpacity 
          onPress={goBackPage}
          >
            
        
                   <Ionicons name='arrow-back' 
      size={28} onPress={goBackPage} style={globalStyles.iconHeaderFile} />

                
          </TouchableOpacity>

          <Text style={{fontSize:20,
            fontFamily:"Regular",color:'black'}}>W - A</Text>
         <TouchableOpacity 
           onPress={GoHome}
          >
          <FontAwesome name="home" size={26} color="#c07d18"/>
          </TouchableOpacity>
      </View>





              








          </View>

     )}</>
  );
}

const styles = StyleSheet.create({
      headerbar:{
        paddingTop:30,
        // paddingBottom:20,
        paddingHorizontal:20,
        flexDirection:"row",
        backgroundColor: '#54524e', //"#fff",
        alignItems:"center",
        justifyContent:"space-between",
        marginBottom:20,

        elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: Platform.OS === "android" ? COLORS.white : COLORS.white,
    shadowOpacity: 1,
    shadowRadius: 2,
    },
    filters:
    {
        flexDirection:"row",
        marginTop:10,
        marginHorizontal:5,
        justifyContent:"space-between"
    },
    footer:{
      position:"absolute",
      left:1,
      right:1,
      bottom:0,
      backgroundColor:"#fff",
      paddingHorizontal:25,
      paddingTop:20
    }
     });

