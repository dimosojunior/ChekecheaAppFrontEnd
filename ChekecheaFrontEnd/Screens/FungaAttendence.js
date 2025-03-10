import React, { useState, useEffect } from 'react';
import { View, SafeAreaView,Modal,Pressable,KeyboardAvoidingView, ImageBackground, TextInput, Alert, Image, StyleSheet, ActivityIndicator, Text, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { EndPoint } from '../Constant/links';
import { globalStyles } from '../Styles/GlobalStyles';
import LottieView from 'lottie-react-native';
import { EventRegister } from 'react-native-event-listeners';
import { Ionicons, FontAwesome, MaterialCommunityIcons } from '@expo/vector-icons';
import { useFonts } from 'expo-font';
import AwesomeAlert from 'react-native-awesome-alerts';
import { COLORS, SIZES } from '../Screens/src/Constant';
import LotterViewScreen from '../Screens/LotterViewScreen';

import {Picker} from '@react-native-picker/picker';
import * as ImagePicker from 'expo-image-picker';
//import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from 'expo-document-picker';
import MinorHeader from '../Header/MinorHeader';

const { width, height } = Dimensions.get('window');

const FungaAttendence = ({ navigation, route }) => {

   const { Darasa, Mkondo } = route.params;

//const navigation = useNavigation();


  let [fontsLoaded] = useFonts({
    'Bold': require('../assets/fonts/Poppins-Bold.ttf'),
    'Medium': require('../assets/fonts/Poppins-Medium.ttf'),
    'SemiBold': require('../assets/fonts/Poppins-SemiBold.ttf'),
    'Regular': require('../assets/fonts/Poppins-Regular.ttf'),
    'Thin': require('../assets/fonts/Poppins-Thin.ttf'),
    'Light': require('../assets/fonts/Poppins-Light.ttf'),
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };




const [modalVisible, setModalVisible] = useState(false);
const [isModalVisible, setIsModalVisible] = useState(false); // New state variable
const [displayContentsState, setdisplayContentsState] = useState(false);

// const [OngezaPichaOpen, setOngezaPichaOpen] = useState(false);
// const [OngezaPichaClose, setOngezaPichaClose] = useState(false);





const [PichaYaMteja, setPichaYaMteja] = useState(null);



//MWANZO WA PICK IMAGE FROM THE PHONE
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });
 
      setPichaYaMteja(result.assets[0].uri); // Use assets array
      //console.log("PROJECT IMAGE", PichaYaMteja)
     // processImage(); // Use assets array
    // console.log("RESULT 1" ,result);
  };

const [OngezaPichaOpen, setOngezaPichaOpen] = useState(false);
const [OngezaPichaClose, setOngezaPichaClose] = useState(false);




const [WenyeDharuraLeo, setWenyeDharuraLeo] = useState('');
const [IdadiYaMikatabaMipyaLeo, setIdadiYaMikatabaMipyaLeo] = useState('');
const [ImetokaKituoJirani, setImetokaKituoJirani] = useState('');
const [ImeendaKituoJirani, setImeendaKituoJirani] = useState('');
const [ImeendaKwaBosi, setImeendaKwaBosi] = useState('');
const [ImetokaKwaBosi, setImetokaKwaBosi] = useState(0);
const [Mkopo, setMkopo] = useState('');
const [Posho, setPosho] = useState('');
const [MatumiziMengine, setMatumiziMengine] = useState('');
const [IdadiYaMikopoYaLeo, setIdadiYaMikopoYaLeo] = useState('');


const [KituoIlichoendaHela, setKituoIlichoendaHela] = useState('');
const [KituoIlichotokaHela, setKituoIlichotokaHela] = useState('');


  const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [phone, setPhone] = useState('');
  const [company_name, setcompany_name] = useState('');

  const [Location, setLocation] = useState('');
  //const [Maelezo, setMaelezo] = useState('');


  const [profileImage, setProfileImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem("userToken").then(token => {
      setUserToken(token)
    })
  }, [userData]);

  useEffect(() => {
    checkLoggedIn();
  }, [userToken]);

  const checkLoggedIn = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('userToken');
    setUserToken(token);
    if (userToken) {
      try {
        const userResponse = await axios.get(
          EndPoint + '/Account/user_data/',
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );



        const userData = userResponse.data;
        setIsLoading(false);
        setEmail(userData.email);
        setUsername(userData.username);
        setPhone(userData.phone);
        setcompany_name(userData.company_name);
         //setMaelezo(userData.Maelezo);
          setLocation(userData.Location);
        
       

      } catch (error) {
        handleErrorMessage(error);

      }
    }
  };

  const [error, setError] = useState(null);
  const [isPending, setPending] = useState(false);
  const emailRegex = /\S+@\S+\.\S+/;

  

  const handleErrorMessage = (error) => {
    if (error.response) {
      // Handle server errors here if needed
      setIsLoading(false);
    } if (error.message === 'Network Error') {
      showAlertFunction('Tatizo la mtandao, washa data na ujaribu tena.');
      setIsLoading(false);
    } else {
      showAlertFunction('Kuna tatizo kwenye ufungaji wa attendence');
      setIsLoading(false);
    }
  };





  // State variable to store the RoomClasses data
  const [JinaLaKituo, setJinaLaKituo] = useState([]);
 const [selectedJinaLaKituo, setSelectedJinaLaKituo] = useState(null);
 
  // Fetch Universities
  useEffect(() => {
    fetch(`${EndPoint}/Add/AllVituoVyote/`)
      .then((response) => response.json())
      .then((data) => {
        setJinaLaKituo(data);
        //console.log("Well");
        
        // Set the default selectedRoomClass if needed
        //setSelectedRoomClass(data[0]); // For example, set the first RoomClass as default
      })
      .catch((error) => {
        //console.error('Error fetching Product categories:', error);
        //showAlertFunction("Error fetching Universities");
      });
  }, []);





const handleRegistration = async () => {
    setIsLoading(true);
    const token = await AsyncStorage.getItem('userToken');

    if (userToken) {
        const formData = new FormData();


        //     if (selectedJinaLaKituo) {
        //   formData.append('JinaLaKituo', selectedJinaLaKituo);
        // } else {
        //   showAlertFunction('Tafadhali chagua jina la kituo.');
        //   setIsLoading(false);
        //   return;
        // }


        
        if (WenyeDharuraLeo) {
            formData.append('WenyeDharuraLeo', WenyeDharuraLeo);
        } else {
            showAlertFunction('Tafadhali ingiza jumla ya wanafunzi wenye dharura au 0');
            setIsLoading(false);
            return;
        }



        axios.post(EndPoint + `/AddDailyAttendenceSummaryView/?Darasa=${Darasa}&Mkondo=${Mkondo}`, formData, {
            headers: {
                Authorization: `Token ${userToken}`,
                'Content-Type': 'multipart/form-data',
            },
        }).then(response => {
          //navigation.navigate('Wanafunzi Wote Attendence', Darasa, Mkondo); 
            setIsLoading(false);
            showAlertFunction("Umefanikiwa kufunga attendence ya leo");
            setdisplayContentsState(true);
            //console.log("Well");
            setWenyeDharuraLeo('');
           

        }).catch(error => {
            setIsLoading(false);
            setdisplayContentsState(false);
            console.log("ERRORR", error);
            handleErrorMessage(error);
        });
    }
};
  return (
    <>
      {!fontsLoaded ? (<View />) : (
        <>
          {!isLoading ? (
           

          
      
       <KeyboardAvoidingView style={styles.mainCon}>

       <MinorHeader />
        <ScrollView 
        keyboardShouldPersistTaps="handled"
        >

      {!displayContentsState && (

        <View style={{position: 'relative',
         bottom: 30,
         marginTop:50,
       }}>


     <View style={{
         bottom: 10,
         //marginTop:50,
         justifyContent:'center',
         alignItems:'center',
       }}>
           <Image

          style={{
            width:60,
            height:60,
            borderRadius:50,
          }}
           source={require('../assets/icon.png')} 
          >
         </Image>

         </View>


          <View style={styles.loginIcon}>
            {/*<SvgIcon icon={'enterOtp'} width={280} height={280} />*/}
       
          </View>
          <View style={styles.container}>
            <View style={styles.loginLblCon}>
              <Text style={styles.loginLbl}>WANAFUNZI APP</Text>
            </View>


            


            <View style={styles.forgotDes}>
              <Text style={styles.forgotDesLbl}>
                Funga attendence ya leo 
              </Text>
           {/*   <Text style={styles.forgotDesLbl}>+91 1234567890</Text>*/}
            </View>
            <View style={styles.formCon}>

            {/*  <OTPInputView
               // pinCount={4}
                autoFocusOnLoad
                style={{width: '80%', height: 70}}
                
               
              />*/}

       

                 {/*  mwanzo wa username*/}
            <View 
            style={[styles.dataContainerForPassword, 
              {
                 width:width-20,
                marginTop:0,
              }

              ]}
          >

            <View style={{
          width:'10%',
          //justifyContent:"center",
         // backgroundColor:'red',
        }}>

         {/* Add a button to toggle password visibility */}
        <TouchableOpacity
          
          style={{ 
            alignSelf: 'flex-start', 
            marginRight: 0,color:'black',
            flexDirection:'row',
            alignItems:'center',
             }}
          >

         <FontAwesome size={20} color="#c07d18" name="pencil" />

        {/*  <Text style={{
           color: 'black', 
           fontSize: 16,
           fontWeight:'bold',
           marginLeft:10,
            }}>
            +255
          </Text>*/}
        </TouchableOpacity>

        </View>


          <TextInput
          style= {[styles.textinputi,{ 
            color: 'black',width:'88%',
            //backgroundColor:'black',

            //paddingVertical:20,
          }]}
          placeholder="wanafunzi wenye dharura"
          keyboardType="numeric"
          
          value={WenyeDharuraLeo}
          onChangeText={setWenyeDharuraLeo}
        placeholderTextColor="black"
        />

      
        </View>
      {/*  mwisho wa username*/}



        
  

{/*mwanzo wa forget password*/}
 
            {!isPending && (
              <Pressable 
              style={{
                flexDirection:'row',
                justifyContent:'space-between',
                alignItems:'center',
                  backgroundColor:'black',
                  marginTop:50,
                  paddingVertical:10,
                  paddingHorizontal:40,
                  borderRadius:8,
                  color:'white',
                  borderColor:'green',
                  borderWidth:1,
               // backgroundColor:'black'
              }}
              onPress={handleRegistration}>
                <Text style={styles.registerLbl}>Funga</Text>
                 <FontAwesome name='book' 
                size={28}
                color='white' 
                style={{
                 // marginTop:70,
                }} 
                
                 />
              </Pressable>
              )}




           {isPending &&
                         <View style={styles.btnContainer}>
                        <TouchableOpacity 
                        
                        >
                            <View style={styles.button1}>
                               
                             <ActivityIndicator size="large" color="green" /> 
                            </View>
                        </TouchableOpacity>
                     
                    </View>}






            </View>
          </View>
        </View>





              



    )}



{displayContentsState &&(
<View style={{
  marginTop:100,
  width:'90%',
  marginHorizontal:20,
  justifyContent:'center',
  alignItems:'center',
  flex:1,
}}>
  <Text style={{
    color:'black',
    fontFamily:'Medium',
  }}>
     Umefanikiwa kufunga attendence ya leo kikamilifu.
  </Text>

   <TouchableOpacity 
  //  onPress={() => {
  //  navigation.navigate("Class Attendence Summary Zote");
  // }}

  onPress={(
    ) => navigation.navigate('Class Attendence Summary Zote', { Darasa: Darasa, Mkondo: Mkondo })}
   
     style={styles.ButtonContainerUpdate}>
  <Text style={styles.ButtonTextUpdate}>Attendence Summary</Text>
</TouchableOpacity>

</View>


  )}



                            <AwesomeAlert
                show={showAlert}
                showProgress={false}
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
                    <Image source={require('../assets/i2.jpg')} style={globalStyles.alertImage} />
                    <Text style={globalStyles.alertTitle}>Wanafunzi App</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />



    <View style={{
  marginBottom:100,
}}>
  {/*<Text style={{
    color:'white',
  }}>Vuta juu</Text>*/}
</View>



</ScrollView>




      </KeyboardAvoidingView>


            
          ) : (
            <LotterViewScreen />
          )}
        </>
      )}
    </>
  );
};

export default FungaAttendence;

const styles = StyleSheet.create({
  mainCon: {
    backgroundColor: 'white',
    flex: 1,
  },
  loginIcon: {
    alignSelf: 'center',
  },
  formCon: {
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  loginLblCon: {
    position: 'relative',
    bottom: 40,
  },
  loginLbl: {
    color: '#000',
    fontSize: 20,
    marginBottom:10,
    textAlign:'center',
    fontFamily:'Medium',
    //fontFamily: Fonts.type.NotoSansExtraBold,
  },
  forgotDes: {
    position: 'relative',
    bottom: 35,
  },
  forgotDesLbl: {
    color: '#000',
   // fontFamily: Fonts.type.NotoSansRegular,
  },
  //registerLbl: {color: '#0057ff', fontFamily: Fonts.type.NotoSansSemiBold},


registerLbl:{
  // backgroundColor:'black',
  // marginTop:70,
  // paddingVertical:10,
  // paddingHorizontal:40,
  // borderRadius:8,
   color:'white',
  // borderColor:'green',
  // borderWidth:1,
  marginRight:20,


},




   textinput: {
        color: COLORS.white,
        //fontSize: SIZES.h3,
        // borderBottomColor: COLORS.lightGrey,
        borderColor: COLORS.green,
        borderWidth: 1,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 5,
        padding:10,
        borderRadius:8,
        fontFamily:'Light',

        borderWidth:2,
        borderColor:'black',
    },



    dataContainerForPassword: {
      color: COLORS.white,
        fontSize: SIZES.h3,
        // borderBottomColor: COLORS.lightGrey,
        borderColor: COLORS.green,
        borderWidth: 1,
        paddingVertical: 10,
        marginHorizontal: 15,
        marginVertical: 10,
        marginTop: 50,
        padding:10,
        borderRadius:8,
        width:width-100,
        flexDirection:'row',
        justifyContent:'space-between',
        flex:1,

        borderWidth:2,
        borderColor:'black',
        
         
    },

  
    textinputi: {
        color: COLORS.white,
        //fontSize: SIZES.h3,
        fontFamily:'Light',
        
        
        marginHorizontal: 0,
        
        padding:0,
        
    },



 ButtonContainerUpdate: {
    padding: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  ButtonTextUpdate: {
    color: 'white',
    textAlign: 'center',
    fontFamily: 'Medium',
    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
  },

});
