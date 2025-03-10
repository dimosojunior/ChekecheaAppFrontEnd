import React, { useState,useCallback,useRef, useEffect } from 'react';
import  {
  View,StyleSheet,Image,
  ActivityIndicator,
  ImageBackground,
  Linking,
  Animated,
  Alert,
  ScrollView,
  Dimensions,
  Pressable,
  Platform,Text,TouchableOpacity,TextInput,FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native';

import {MaterialIcons,Entypo,MaterialCommunityIcons,FontAwesome5, Ionicons,Feather,AntDesign, FontAwesome} from '@expo/vector-icons';

import COLORS  from '../Constant/colors';

import {useFonts} from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import {globalStyles} from '../Styles/GlobalStyles';
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
//import { useNavigation } from '@react-navigation/native';
import { EndPoint } from '../Constant/links';
import LotterViewScreen from '../Screens/LotterViewScreen';

import Header from '../Header/header';
import { useFocusEffect } from '@react-navigation/native';

const { width, height } = Dimensions.get('screen');

export default function HomeScreen ({navigation}) {


  

  let [fontsLoaded] = useFonts({
    
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
    
    
  
});


  const [dateTime, setDateTime] = useState({
    day: '',
    date: '',
    time: '',
  });

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();

      // Days of the week
      const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      // Formatting time with leading zeros
      const formatTime = (value) => (value < 10 ? `0${value}` : value);

      // Get current day, date, and time
      const day = days[now.getDay()];
      const date = `${now.getDate()}-${now.getMonth() + 1}-${now.getFullYear()}`;
      const time = `${formatTime(now.getHours())}:${formatTime(
        now.getMinutes()
      )}:${formatTime(now.getSeconds())}`;

      setDateTime({ day, date, time });
    };

    // Update every second
    const intervalId = setInterval(updateDateTime, 1000);

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);



// kwaajili ya kupata taarifa za aliyelogin
const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');

  useEffect(() => {
    AsyncStorage.getItem("userToken").then(token => {
      setUserToken(token)
    })
    fetchUserData();
  }, [userData]);

  const fetchUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        const parsedUserData = JSON.parse(userDataJSON);
        setUserData(parsedUserData);

        //console.log(parsedUserData);
        //console.log(userDataJSON);
      }
    } catch (error) {
      // console.log(error);
    }
  };


 useEffect(() => {
    checkLoggedIn();


  }, [userToken]);

  const checkLoggedIn = async () => {
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
  };




    const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };



  return (

       <>{!fontsLoaded ? (<View/>):(

          <View style={globalStyles.container}>


  <Header />

  <ScrollView 
        keyboardShouldPersistTaps="handled"
        >







  <View style={{
    padding:20,
      backgroundColor:"#54524e",
      borderRadius:15,
      marginBottom:10,
      marginHorizontal:20,
      elevation: 3,
    shadowOffset: { width: 1, height: 1 },
    shadowColor: Platform.OS === "android" ? COLORS.white : COLORS.white,
    shadowOpacity: 1,
    shadowRadius: 2,
  }}>
            <View style={{
              flexDirection:"row",
              alignItems:"center",
              justifyContent:"space-between",
              width:'90%',

            }}>
             
              <Image style={{
                height:50,width:50,
                borderRadius:30,
                width:'20%',
              }} 
             source={require('../assets/splash.png')} 
              >
              </Image>
              <Text style={{
                color:'#0c9b56',
                fontFamily:'Bold',
                marginLeft:10,
                width:'80%',
              }}>
              WANAFUNZI APP
              </Text>
              

             
            </View>

            <View style={{flexDirection:"row", 
            marginTop:10,
            justifyContent:"space-around",
            alignItems:'center',
          }}>
            <View style={{
              flexDirection:'column',
            }}>
              <Text style={{
                fontFamily:'Medium',
                marginLeft:5,
                color:"wheat"
              }}>
              {dateTime.day}</Text>

               <Text style={{
                fontFamily:'Medium',
                marginLeft:5,
                color:"white"
              }}>
              {dateTime.date}, {dateTime.time}</Text>
              </View>

              <View style={{
                borderRadius:7,
                backgroundColor:'green',
                
                paddingHorizontal:20,
                paddingVertical:10
              }}>
                <Text style={{
                  color:"white",
                  fontFamily:'Light',
                }}>
                {userData && userData.JinaLaKituo && userData.JinaLaKituo.JinaLaKituo}</Text>
              </View>
            </View>
           
          </View>












{/*mwanzo wa item*/}

  <Pressable 
   onPress={() => navigation.navigate('Madarasa Yote')}

style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='th-large' 
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        ATTENDENCE
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
        onPress={() => navigation.navigate('Madarasa Yote')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}

 






{/*mwanzo wa item*/}

  <Pressable 
   onPress={() => navigation.navigate('Mikataba Hai')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='book' 
         onPress={() => navigation.navigate('Madarasa Yote Matokeo')}
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        JAZA MATOKEO
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
       onPress={() => navigation.navigate('Madarasa Yote Matokeo')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}








{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Madarasa Yote Angalia Matokeo')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-times' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        TAZAMA MATOKEO
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
       onPress={() => navigation.navigate('Madarasa Yote Angalia Matokeo')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}





{/*mwanzo wa item*/}

  <Pressable 
  onPress={() => navigation.navigate('Madarasa Yote Madarasa')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-secret' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        MADARASA
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
         onPress={() => navigation.navigate('Madarasa Yote Madarasa')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}





{/*mwanzo wa item*/}

  <Pressable 
 onPress={() => navigation.navigate('Madarasa Wanafunzi2')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='users' 
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        WANAFUNZI
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
      onPress={() => navigation.navigate('Madarasa Wanafunzi2')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}










{/*mwanzo wa item*/}

  <Pressable 
 // onPress={() => navigation.navigate('Wamemaliza Hawajakopa Tena')}
style={globalStyles.ItemHomeScreenPressableContainer}

  >
 {/* mwanzowa view kubwa*/}
  <View 
  style={globalStyles.ItemHomeScreenContainer}
  >

{/* mwanzo wa view ya icon*/}
    <View 
     style={globalStyles.ItemHomeScreenFirstLeftContainer}
   >
   {/*  <Image style={{
      height:60,
      width:60
    }} 
     source={require('../assets/i2.jpg')} 
     >
     </Image>*/}
        <FontAwesome name='user-o' 
        
      size={30}
      //color="black" 
      style={globalStyles.ItemHomeScreenLeftContainerIcon}      
       />
    </View>
  {/* mwiso wa view ya icon*/}

   
      <View 
       style={globalStyles.ItemHomeScreenMiddleContainer}

    >
        <Text 
        style={globalStyles.ItemHomeScreenMiddleContainerText1}
        
        >
        MALIPO
        </Text>
       
      </View>

      <View 
      style={globalStyles.ItemHomeScreenRightContainer}
     >
        {/*<Text style={{color:'black',fontWeight:"600"}}>difference</Text>*/}
        {/*<Text style={{color:'red',fontWeight:"600"}}>percentage </Text>*/}

       <Ionicons name='arrow-forward-circle' 
         //onPress={() => navigation.navigate('Wamemaliza Hawajakopa Tena')}
      size={30}
      //color="black" 
      //color="red"
      style={globalStyles.ItemHomeScreenRightContainerIcon}
         />
      
      </View>

   

  </View>
{/* mwisho wa view kubwa*/}
          </Pressable>

{/*mwisho wa item */}




</ScrollView>




   <AwesomeAlert
                show={showAlert}
                showProgress={false}
                // title="Overdose Stores"
                closeOnTouchOutside={true}
                closeOnHardwareBackPress={false}
                showCancelButton={false}
                showConfirmButton={true}
                confirmText="OK"
                confirmButtonColor="green"
                onConfirmPressed={hideAlert}
                 confirmButtonStyle={globalStyles.alertButton}
                contentContainerStyle={globalStyles.alertContainer}
                customView={
                  <View style={globalStyles.alertContent}>
                    <Image source={require('../assets/icon.png')} style={globalStyles.alertImage} />
                    <Text style={globalStyles.alertTitle}>Mfugaji Smart</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />
          </View>


          )}</>

          );
}

const styles = StyleSheet.create({
 
});