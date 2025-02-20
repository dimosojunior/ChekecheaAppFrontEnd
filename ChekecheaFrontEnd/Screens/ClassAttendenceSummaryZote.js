import React, { useState,useCallback,useRef, useEffect } from 'react';
import  {
  View,StyleSheet,Image,
  ActivityIndicator,
  ImageBackground,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  RefreshControl,
  Keyboard,
  Linking,
  Animated,
  Modal,
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

import MinorHeader from '../Header/MinorHeader';
import { useFocusEffect } from '@react-navigation/native';
import { getFormatedDate } from "react-native-modern-datepicker";
import DatePicker from "react-native-modern-datepicker";
import * as Print from 'expo-print';
import { shareAsync } from 'expo-sharing';

const { width, height } = Dimensions.get('screen');

const html = `
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
  </head>
  <body style="text-align: center;">
    <h1 style="font-size: 50px; font-family: Helvetica Neue; font-weight: normal;">
      Gegwajo Microfinance
    </h1>
    <img
      src="https://d30j33t1r58ioz.cloudfront.net/static/guides/sdk.png"
      style="width: 90vw;" />
  </body>
</html>
`;


const ClassAttendenceSummaryZote = ({ navigation, route }) => {

const { Darasa, Mkondo } = route.params;



  const [fontsLoaded] = useFonts({
    Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Thin: require('../assets/fonts/Poppins-Thin.ttf'),
    Light: require('../assets/fonts/Poppins-Light.ttf'),
  });

const [totalRejeshoLeo, setTotalRejeshoLeo] = useState(0);

 const [queryset, setQueryset] = useState([]);
const [current_page, setcurrent_page] = useState(1);
const [isLoading, setIsLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [endReached, setEndReached] = useState(false)
const [isPending, setPending] = useState(true);

  const [input, setInput] = useState('');


    const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

 const showAlertFunction = (message) => {
    setAlertMessage(message);
    setShowAlert(true);
  };

  const hideAlert = () => {
    setShowAlert(false);
  };


  const openUrl = async (url) => {
        const isSupported = await Linking.canOpenURL(url);
        if (isSupported) {
            await Linking.openURL(url);
        } else {
            Alert.alert(`Programu imeshindwa kufungua hii linki: ${url}`);
        }
    }
//const [modalVisible, setModalVisible] = useState(false);
const WebsiteLink = EndPoint + `/admin/`
  

// kwaajili ya kupata taarifa za aliyelogin
const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');

//   useEffect(() => {
//     fetchUserData();
//   }, []);

//   const fetchUserData = async () => {
//     try {
//       const userDataJSON = await AsyncStorage.getItem('userData');
//       if (userDataJSON) {
//         const parsedUserData = JSON.parse(userDataJSON);
//         setUserData(parsedUserData);

//         //console.log(parsedUserData);
//         //console.log(userDataJSON);
//       }
//     } catch (error) {
//       // console.log(error);
//     }
//   };

// //console.log("USERDATA USERNAME", userData.username);

//  useEffect(() => {
//     const fetchTokenAndData = async () => {
//       const token = await AsyncStorage.getItem('userToken');
//       setUserToken(token);
//       if (token) {
//         setIsLoading(true);
//         getItems(token);
//       }
//     };
//     fetchTokenAndData();
//   }, []);


 const fetchUserData = async () => {
    try {
      const userDataJSON = await AsyncStorage.getItem('userData');
      if (userDataJSON) {
        setUserData(JSON.parse(userDataJSON));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchTokenAndData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      setUserToken(token);
      if (token) {
        //setcurrent_page(1); // Reset page when refetching
        getItems(token); // Start fetching from the first page
      }
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setPending(true); // Set pending to true immediately when entering the screen
      fetchUserData();
      fetchTokenAndData();

      return () => {
        //setQueryset([]); // Reset queryset to avoid stale data
        setcurrent_page(1); // Reset pagination
        setEndReached(false); // Ensure endReached is reset for new focus
      };
    }, [])
  );



const getItems = (token) => {
  if (endReached) {
    setLoading(false);
    setIsLoading(false);
    setPending(false);
    return;
  } else {
    setIsLoading(true);
    //console.log('USERTOKEN', userToken);
    //setPending(true);
    //const url = EndPoint + `/GetAllUniversities/?page=${current_page}&page_size=2`;
   const url = EndPoint + `/GetDailyAttendenceSummarySikuYaLeoView/?Darasa=${Darasa}&Mkondo=${Mkondo}&page=${current_page}&page_size=500`
    // console.log(url);
    fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`, // Add the Authorization header here
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.queryset && data.queryset.length > 0) {
          setQueryset(data.queryset);
          //setTotalRejeshoLeo(data.total_rejesho_leo); // Set the total amount

        
        
          setIsLoading(false);
          setLoading(false);
          setcurrent_page(current_page + 1);
          setPending(false);

          // console.log("NEW CRRRENT", current_page);
          console.log(queryset);

        } else {
          setIsLoading(false);
          setEndReached(true);
          setLoading(false);
          setPending(false);
          console.log("Error fetching data");;
        }
      });
  }
};





 //kwa ajili ya kurefresh pages
   const [refresh, setRefresh] = useState(false);

  // const pullMe =() => {
  //   setRefresh(true)

  //   setTimeout (() => {
  //     setRefresh(false)
  //   }, 10)
  // }

const handleRefresh = async () => {
  setRefresh(true);
  setEndReached(false); // Reset to allow loading more data
  setcurrent_page(1); // Reset to the first page

  try {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      // Call getItems with the token and reset page
      const url = EndPoint + `/GetDailyAttendenceSummarySikuYaLeoView/?Darasa=${Darasa}&Mkondo=${Mkondo}&page=1&page_size=500`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      const data = await response.json();

      if (data.queryset.length > 0) {
        setQueryset(data.queryset); // Replace with new data
        //setcurrent_page(2); // Prepare for next page
        //setTotalRejeshoLeo(data.total_rejesho_leo); // Set the total amount

         setIsLoading(false);
          setLoading(false);
          setcurrent_page(current_page + 1);
          setPending(false);
          console.log('Page is Refreshed');

      } else {
        console.log('No new data available');
      }
    }
  } catch (error) {
    console.error('Error refreshing data:', error);
  } finally {
    setRefresh(false); // Stop the refresh animation
     setPending(false);
  }
};



//console.log("Test userToken", userToken);

 const renderLoader = () => {
    return (
      isLoading ?
        <View style={globalStyles.loaderStyle}>
          <ActivityIndicator size="large" color="red" />
        </View> : null
    );
  };

  // const loadMoreItem = () => {
  //   setcurrent_page(current_page + 1);
  // };

  // useEffect(() => {
  //   setLoading(true)
  //   getItems();
  // }, []);


 const handleScroll = (event) =>{
    const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
    const scrollEndY = layoutMeasurement.height + contentOffset.y
    const contetHeight = contentSize.height

    if (scrollEndY >= contetHeight - 50) {
      getItems()
    }
  }


  const formatDate2 = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const formatToThreeDigits = (number) => {
    return number
      ? number.toLocaleString('en-US', {
          minimumFractionDigits: 0,
          maximumFractionDigits: 2,
        })
      : null;
  };

  const handlePress = (item) => navigation.navigate('Home', { item });
  const DeletehandlePress = (item) =>
    navigation.navigate('Delete Mteja', { ...item, postId: item.id });

const handlePressDetailsPage = (item) =>
    navigation.navigate('Mteja Details', { ...item });




//-----------Fetch wateja wote





//-----------filter data by date-----------------
const [startDate, setStartDate] = useState(null);
 const [modalVisible, setModalVisible] = useState(false);
 const [isRange, setisRange] = useState(false);

  //const [endDate, setEndDate] = useState(null);

  // Utility function to format the date as "YYYY-MM-DD"
  const formatDate = (dateString) => {
    if (!dateString) {
      return null;
    }
    const [year, month, day] = dateString.split("/");
    return `${year}-${month}-${day}`;
  };

  useEffect(() => {
    if (startDate) {
      handleFilterByDate();
      //setisPending(true);
    }
  }, [startDate]);




  const handleFilterByDate = () => {
  // Convert the selected dates to the desired format (e.g., "YYYY-MM-DD")
  const formattedStartDate = formatDate(startDate);

  if (!startDate) {
    // Check if the startDate is not selected
    Alert.alert("Tafadhali chagua tarehe husika.");
    return;
  }

  setPending(true);

  axios
    .get(`${EndPoint}/FilterDailyAttendenceSummaryYaSikuByDate/?Darasa=${Darasa}&Mkondo=${Mkondo}&startDate=${formattedStartDate}`, {
      headers: {
        Authorization: `Token ${userToken}`, // Add the Authorization header here
      },
    })
    .then((response) => {
      const { queryset, total_rejesho_leo } = response.data;
      setQueryset(queryset);
      //setTotalRejeshoLeo(total_rejesho_leo);
      setModalVisible(false);
      setPending(false);
      setisRange(true);
    })
    .catch((error) => {
      console.error("Error fetching filtered data: ", error);
      setModalVisible(false);
      setPending(false);
    });
};


// Function to format the datetime to date
  const formatToShortDate = (dateTimeString) => {
    if (!dateTimeString) {
      return "";
    }
    const date = new Date(dateTimeString);
    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };









//----------------PRINTING RECEIPT-----------------

 const [selectedPrinter, setSelectedPrinter] = React.useState();
 const [order, setOrder] = useState([]);
 //const [modalVisibleReceipt, setModalVisibleReceipt] = useState(false);

const [SharedClicked, setSharedClicked] = useState(false);




  const print = async () => {
    setSharedClicked(true);
    //setModalVisible(false);
    console.log("Clicked print");
    
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    await Print.printAsync({
      html: createDynamicTable(),
      printerUrl: selectedPrinter?.url, // iOS only

    });

    setSharedClicked(false);
    //setModalVisible(false);
    console.log("Print Ends");
  }

  const printToFile = async () => {
    // On iOS/android prints the given html. On web prints the HTML from the current page.
    const { uri } = await Print.printToFileAsync({
      html
    });
    
    await shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
  }

  const selectPrinter = async () => {
    const printer = await Print.selectPrinterAsync(); // iOS only
    setSelectedPrinter(printer);
  }


 const createDynamicTable = () => {
  var rows1 = '';
  var rows2 = '';
  var rows3 = '';
  var rows4 = '';

  for (let i in queryset) {
    const item = queryset[i];
    
    rows1 += `
      <tr>
        <td>${item.JumlaYaWanafunziDarasani}</td>
        <td>${item.JumlaYaWaliokujaLeoDarasani}</td>
        <td>${item.JumlaYaWasiokujaLeoDarasani}</td>
        <td>${item.WenyeDharuraLeo}</td>
        <td>${item.WasiokujaBilaDharura}</td>
      </tr>
    `;
    
    rows2 += `
      <tr>
        <td>${item.ImeweingizwaNa}</td>
       
       
      </tr>
    `;

    rows4 += `
      <tr>
        <td>${item.Created}</td>
      </tr>
    `;
  }

  const html = `
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no" />
      <style>
        body {
          font-family: Arial, sans-serif;
          text-align: center;
          margin: 0;
          padding: 0;
          background-color:#243137;
        }
        h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 20px;
          color:white;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
        }
        th {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: center;
        }

        td {
          border: 1px solid #ddd;
          padding: 15px;
          text-align: center;
        }


        th {
          background-color: #c07d18;
          font-weight: bold;
        }
        tr:nth-child(even) {
          background-color: #c07d18;
        }
      </style>
    </head>
    <body>
      <h1>WANAFUNZI APP</h1>


      <h1>Attendence summary ya siku</h1>
      <!-- First Table -->
      <table>
        <tr>
          <th>Jumla Ya Wanafunzi</th>
          <th>Waliokuja Leo</th>
          <th>Wasiokuja Leo</th>
          <th>Wenye Dharura</th>
          <th>Wasiokuja Bila Dharura</th>
        </tr>
        ${rows1}
      </table>

      <!-- Second Table -->
      <table>
        <tr>
          <th>Imeitwa Na</th>
          
        </tr>
        ${rows2}
      </table>

      <!-- Third Table -->
      

      <!-- Fourth Table -->
      <table>
        <tr>
          <th>Tarehe</th>
        </tr>
        ${rows4}
      </table>
    </body>
  </html>
  `;
  return html;
};






// New Component for Table Row
const TableRowComponent = ({ item}) => {


  return (
    <Pressable style={{
      //backgroundColor:'green',
    //width:'100%',
    width:width,

    }}>

         



{/*mwanzo wa Full taarifa za marejesho View Ya 1*/}

<View 
style={[globalStyles.FullRipotiYaSikuContainer,

  {
    //backgroundColor:'red',
    width:'100%',
    justifyContent:'space-between',
  }

  ]}
>

<Pressable 
style={globalStyles.FullRipotiYaSikuLeftMajorContainer}
>
  


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Jumla Ya Wanafunzi</Text>
</View>
{/*mwanzo wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Waliokuja Leo</Text>
</View>
{/*mwanzo wa Left View*/} 

{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Wasiokuja Leo</Text>
</View>
{/*mwanzo wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Wenye Dharura</Text>
</View>
{/*mwanzo wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Wasiokuja Bila Dharura</Text>
</View>
{/*mwanzo wa Left View*/} 


{/*mwanzo wa Left View*/} 
<View 
style={globalStyles.FullRipotiYaSikuLeftContainer}
>
<Text 
style={globalStyles.FullRipotiYaSikuLeftText}
 >Imeingizwa Na</Text>
</View>
{/*mwanzo wa Left View*/} 



{/*mwanzo wa Left View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuLeftContainer,
  {
    backgroundColor:'#c07d18',
  }

  ]}
>
<Text 
style={[globalStyles.FullRipotiYaSikuLeftText,
  {
    fontFamily:'Bold',
  }

  ]}
 >Tarehe</Text>
</View>
{/*mwanzo wa Left View*/} 


</Pressable>





{/*Right start here----------------------------------------------------*/}

<Pressable 
style={globalStyles.FullRipotiYaSikuRightMajorContainer}
>
 

{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.JumlaYaWanafunziDarasani}</Text>

</View>
{/*mwanzo wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.JumlaYaWaliokujaLeoDarasani}</Text>

</View>
{/*mwanzo wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.JumlaYaWasiokujaLeoDarasani}</Text>
 
</View>
{/*mwanzo wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.WenyeDharuraLeo}</Text>

</View>
{/*mwanzo wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.WasiokujaBilaDharura}</Text>

</View>
{/*mwanzo wa Right View*/} 


{/*mwanzo wa Right View*/} 
<View 
style={globalStyles.FullRipotiYaSikuRightContainer}
>

<Text 
style={globalStyles.FullRipotiYaSikuRightText}
 >{item.ImeweingizwaNa}</Text>
 
</View>
{/*mwanzo wa Right View*/} 




{/*mwanzo wa Right View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuRightContainer,

   {
    backgroundColor:'#c07d18',
  }


  ]}
>

<Text 
style={[globalStyles.FullRipotiYaSikuRightText,
  {
    fontFamily:'Bold',
  }

  ]}
 >{formatDate2(item.Created)}</Text>

</View>
{/*mwanzo wa Right View*/} 


</Pressable>


</View>

{/*mwiso wa Full taarifa za marejesho View Ya 1*/}

      










{userData && userData.is_admin === true && (
<TouchableOpacity 
// onPress={() => navigation.replace('Futa Ripoti', { ...item, postId: item.id })}

 onPress={() => {
    //setDropdownVisible2(false);
    Linking.openURL(WebsiteLink);
    //navigation.navigate("Faini Za Leo"); // Navigate to first option
  }}

style={{
  width:'50%',
}}
>


<Text style={{
  color: "white" ,
  // padding:13,
   backgroundColor: "brown",
   borderColor:'white',
   borderWidth:1,
   textAlign:'center',
   borderRadius:8,
   width:'100%',
   fontFamily:'Light',
   paddingVertical:10,
   marginLeft:20,
   marginVertical:20,
  
}}>Badilisha</Text>


</TouchableOpacity>
)}


    </Pressable>
  )





};



  return (
      <>{!fontsLoaded ? (<View/>):(

            <>


 {!isPending ? (



        <View style={globalStyles.container}>
          <MinorHeader />

          <View style={{ width: '100%', marginVertical: 0 }}>
           {!isRange ? (
            <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Attendence summary ya leo
            </Text>
            ):(
          <Text
              style={{
                color: 'white',
                paddingVertical: 10,
                paddingHorizontal: 20,
                width: '90%',
                marginHorizontal: 10,
                borderRadius: 10,
                fontFamily: 'Medium',
              }}
            >
              Attendence summary ya tarehe  {formatDate(startDate)}
            </Text>
            )}

           
  




          </View>

     
          <ScrollView 
      
          horizontal
          >
            <ScrollView 

            keyboardShouldPersistTaps="handled"
              refreshControl={
            <RefreshControl
            refreshing={refresh} onRefresh={handleRefresh}
            />
           }
         showsVerticalScrollIndicator={false}
       
          onScroll={handleScroll} scrollEventThrottle={16}
            >

               {queryset && queryset.length > 0 ? (


      <>

              <View style={[globalStyles.table,
                {
                  //backgroundColor:'wheat',
                   width:'100%',
                }

                ]}>
               

                {/* Render Table Rows */}
             {setLoading===true?(<ActivityIndicator/>):(

             <>

                   {queryset.map((item, index) => {
          return <TableRowComponent item={item} key={item.id || index} />;
          })}
        
          {isLoading&&(<ActivityIndicator/>)}
          </>
          )}
         
              </View>


               </>  

   ) :(
   <View style={[globalStyles.noitemTextContainer,{
    width:'80%',
   }]}>
   {!isRange ? (
  <Text style={globalStyles.noitemText}>Attendence summary ya leo bado haijafungwa
  </Text>
  ):(
 <Text style={globalStyles.noitemText}>Attendence summary ya tarehe {formatDate(startDate)} haikufungwa
  </Text>
  )}


</View>

  )} 

 
            </ScrollView>
          </ScrollView>





<View style={{
  marginBottom:100,
}}>
  {/*<Text style={{
    color:'white',
  }}>Vuta juu</Text>*/}
</View>





        <Pressable
          style={[{
            flexDirection: "row",
            alignItems: "center",
            padding: 0,
            justifyContent: "space-between",
            //backgroundColor: "white",
            position:'absolute',
            bottom:0,
            width:'100%',

          },
           
          ]}
        >

        <TouchableOpacity
onPress={() => setModalVisible(true)}
style={{
   padding: 10,
    width:'50%',
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
}}
 >
    <Text 
    style={{
      color: "white" ,
      // padding:13,
       backgroundColor: "black",
       borderColor:'white',
       borderWidth:1,
       textAlign:'center',
       borderRadius:8,
       width:'100%',
       fontFamily:'Light',
       paddingVertical:10,
    }}

   >Tarehe ?</Text>

</TouchableOpacity>


       
{!SharedClicked ? (

        <TouchableOpacity
//onPress={() => setModalVisible(true)}
onPress={print}

style={{
   padding: 10,
    width:'50%',
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
}}
 >
    <Text 
    style={{
      color: "black" ,
      // padding:13,
       backgroundColor: "wheat",
       borderColor:'white',
       borderWidth:1,
       textAlign:'center',
       borderRadius:8,
       width:'100%',
       fontFamily:'Light',
       paddingVertical:10,
    }}

   >Share</Text>

</TouchableOpacity>

):(

        <TouchableOpacity
//onPress={() => setModalVisible(true)}
//onPress={print}

style={{
   padding: 10,
    width:'50%',
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
}}
 >
  <ActivityIndicator size="large" color="red" /> 

</TouchableOpacity>

)}

        </Pressable>
   




      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
      <ScrollView>
        <View style={globalStyles.FilterModalmodalContainer}>
          <View style={globalStyles.FilterModalmodalContent}>
         {/* <TouchableOpacity 
          onPress ={move}>
            <Text style={globalstyles.modalTitle}>ALL</Text>
            </TouchableOpacity>*/}
            <DatePicker
              mode="calendar"
              selected={startDate}
              onDateChange={(date) => setStartDate(date)}
              format="YYYY-MM-DD" // Set the date format to "YYYY-MM-DD"
               options={{
                    backgroundColor: "#080516",
                    textHeaderColor: "red",
                    textDefaultColor: "#FFFFFF",
                    selectedTextColor: "#FFF",
                    mainColor: "red",
                    textSecondaryColor: "#FFFFFF",
                    borderColor: 'red',
                    borderRadius:10,
                  }}
            />

        
            <View style={[{
                      justifyContent:'space-between',
                      alignItems:'center',
                      flexDirection:'row',
                      marginVertical:15,
                      margin:6,
                    },globalStyles.ButtonConatinere]}>
                    
                    <Pressable style={[globalStyles.ButtonAdd,{
                        width:'45%',
                        backgroundColor:'red'
                    }]}  onPress={() => setModalVisible(false)} >
                        <Text style={{
                            color:'white'
                        }}>Ondoa</Text>
                    </Pressable>


                     <TouchableOpacity
              onPress={handleFilterByDate}
               
              style={[globalStyles.ButtonAdd, {
                width:'45%'
              }]}
            >
              <Text style={{  color: "white" }}>Tafuta</Text>
            </TouchableOpacity>
            </View>




          </View>
        </View>
        </ScrollView>
      </Modal>

    



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
                    <Text style={globalStyles.alertTitle}>Wanafunzi App</Text>
                    <Text style={globalStyles.alertMessage}>{alertMessage}</Text>
                  </View>
                }
              />
        </View>
  

                ):(

<LotterViewScreen />

)}

    

    </>


     )}</>
    
  );
};

export default ClassAttendenceSummaryZote;
