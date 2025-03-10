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

const { width, height } = Dimensions.get('screen');

const WanafunziWanafunzi2 = ({navigation, route}) => {

 const { 
    Darasa,
    KiasiChaAda,
    Mkondo
    
    
   
   } = route.params
//const navigation = useNavigation();


const [selectedProduct, setSelectedProduct] = useState(null);
const [modalVisible, setModalVisible] = useState(false);
 const [isModalVisible, setIsModalVisible] = useState(false); // New state variable


  const [fontsLoaded] = useFonts({
    Bold: require('../assets/fonts/Poppins-Bold.ttf'),
    Medium: require('../assets/fonts/Poppins-Medium.ttf'),
    SemiBold: require('../assets/fonts/Poppins-SemiBold.ttf'),
    Regular: require('../assets/fonts/Poppins-Regular.ttf'),
    Thin: require('../assets/fonts/Poppins-Thin.ttf'),
    Light: require('../assets/fonts/Poppins-Light.ttf'),
  });

 const [queryset, setQueryset] = useState([]);
const [current_page, setcurrent_page] = useState(1);
const [isLoading, setIsLoading] = useState(false);
const [loading, setLoading] = useState(false);
const [endReached, setEndReached] = useState(false)
const [isPending, setPending] = useState(true);


const [marejesho_queryset, setmarejesho_queryset] = useState([]);
const [marejeshoisPending, setmarejeshoPending] = useState(true);

const [faini_queryset, setfaini_queryset] = useState([]);
const [fainiisPending, setfainiPending] = useState(true);


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


  

// kwaajili ya kupata taarifa za aliyelogin
const [userData, setUserData] = useState({});
  const [userToken, setUserToken] = useState('');



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
        setIsLoading(true);

        // Call getItems
        await getItems(token);

        // Call getMarejeshoYaLeo
        //await getMarejeshoYaLeo(token);

        // Call getFainiZaLeo
        //await getFainiZaLeo(token);
    setIsLoading(false);
        
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




const [JumlaYaWote, setJumlaYaWote] = useState(0);
const [totalFainiLeo, setTotalFainiLeo] = useState(0);

const [totalRejeshoLeo2, setTotalRejeshoLeo2] = useState(0);


const getItems = async (token) => {
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
   const url = EndPoint + `/GetWanafunziWoteHaiKipengeleChaWanafunzi/?Darasa=${Darasa}&Mkondo=${Mkondo}&page=${current_page}&page_size=500`
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
          setJumlaYaWote(data.JumlaYaWote); // Set the total amount

        
        
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



const getMarejeshoYaLeo = async (token) => {
  setmarejeshoPending(true);

  const url = `${EndPoint}/GetWanafunziWalioitwaLeoKwaChiniView/?Darasa=${Darasa}&Mkondo=${Mkondo}`;
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    const data = await response.json();

    if (data.marejesho_queryset && data.marejesho_queryset.length > 0) {
      setmarejesho_queryset(data.marejesho_queryset);
      //setTotalRejeshoLeo2(data.total_rejesho_leo); 
    }
  } catch (error) {
    console.error("Error in getMarejeshoYaLeo:", error);
  } finally {
    setmarejeshoPending(false);
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
      const url = EndPoint + `/GetWanafunziWoteHaiKipengeleChaWanafunzi/?Darasa=${Darasa}&Mkondo=${Mkondo}&page=1&page_size=500`;
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


  const formatDate = (dateString) => {
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

const handlePressPokeaMarejesho = (item) =>
    navigation.navigate('Badilisha Mwanafunzi2', { ...item, postId: item.id });


const handlePressPokeaFaini = (item) =>
    navigation.navigate('Futa Mwanafunzi2', { ...item,Darasa,Mkondo, postId: item.id });
    // navigation.reset({
    //     index: 0,
    //     routes: [{ name: 'Jaza Faini', ...item }],
    //   }); 
        

// //-----------Fetch wateja wote











const addCartItem = async () => {
  if (!selectedProduct) {
    setPending(false);
    
    //Alert.alert('Error', 'Please enter a quantity of product(s) you want to order');
    showAlertFunction("Tafadhali, chagua aina mwanafunzi");
    return;
  }

  // Check if the selected quantity is greater than available stock
  // if (parseInt(quantity) > ProductQuantity) {
  //   setPending(false);
  //   //Alert.alert('Error', 'Not enough quantity in stock');
  //   showAlertFunction("Not enough quantity in stock");
  //   return;
  // }

  setPending(true);
//navigation.replace('View Products', { id }); 
  // Find the selected product's price
  //const productPrice = selectedProduct.price;

  // Calculate the total price for the cart item
 // const itemPrice = productPrice * parseInt(quantity);
 //const itemPrice = productPrice * parseInt(quantity);

  setModalVisible(false);
   setIsModalVisible(false);
   

  try {
    const response = await axios.post(

      EndPoint + '/StudentsAttendenceCartView/',
      {
        Mwanafunzi: selectedProduct.id,
        //quantity: parseInt(quantity),


      },

      {
        headers: {
          Authorization: `Token ${userToken}`,
        },
      }
    );
    

    
     
    // showAlertFunction("Umefanikiwa kuchagua chakula");

  
      // Ongeza ID ya bidhaa kwenye selectedProductIds
    //  const newSelectedProductIds = [...selectedProductIds, selectedProduct.id];
    // setSelectedProductIds(newSelectedProductIds);
    // await AsyncStorage.setItem('selectedProductIds', JSON.stringify(newSelectedProductIds));



      // Update the local cart items list with the new item
      const newItem = {
        id: response.data.id, // Use the 'id' from the response data
        Mwanafunzi: selectedProduct,
        //quantity: parseInt(quantity),
        //price: itemPrice,
      };
      // const updatedCart = [...cart, newItem];
      // setCart(updatedCart);




      // Close the modal and reset the selected product and quantity
      // setModalVisible(false);
      setSelectedProduct(null);
      setPending(false);
      //setQuantity(InitialQuantityValue);

     // Increment the displayedItemsCount
    //setDisplayedItemsCount((prevCount) => prevCount + 1);
    navigation.navigate('Wanafunzi Wote Attendence', Darasa, Mkondo); 

   


   
  } catch (error) {
     setPending(false);
     console.log("ERROR", error);
    //Alert.alert('Error', 'Failed to add item to cart');
     if (error.response && error.response.data && error.response.data.error) {
      showAlertFunction(error.response.data.error);
    } else {
      showAlertFunction("Imeshindikana kumuita mwanafunzi");
    }
    
    
  }
};












// New Component for Table Row
const TableRowComponent = ({ item}) => {

  //mwanzo wa search
   if (input === ""){


  return (
    <View key={item.id} style={globalStyles.row2}>
    
   
   
     
      <Text style={[globalStyles.cell, globalStyles.firstNameColumn]}>{item.JinaKamiliLaMwanafunzi}</Text>
   
   {item && item.Darasa && item.Darasa.Darasa ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Darasa.Darasa}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item && item.Mkondo && item.Mkondo.Mkondo ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Mkondo.Mkondo}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item.Mahali ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Mahali}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item.SimuYaMzazi_1 ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>0{item.SimuYaMzazi_1}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}
    

    {item.SimuYaMzazi_2 ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>0{item.SimuYaMzazi_2}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

     {item.EmailYaMzazi ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.EmailYaMzazi}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}




    <TouchableOpacity
        style={[
          globalStyles.cell,
          globalStyles.buttoncolumn,
          { 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection:'row' ,
          },
        ]}
        onPress={() => handlePressPokeaMarejesho(item)}
      //   onPress={() => {
      //   setSelectedProduct(item);
      //   setModalVisible(true);
      //   setIsModalVisible(true); // Reset state when modal closes
       
      // }}
      >
        <MaterialCommunityIcons
          name="gesture-tap-button"
          size={30}
          style={[globalStyles.TableIconColor,
            {
              color:'wheat',
            }

            ]}
        />

       {/* <Text style={{
          color:'white',
          fontFamily:'Light',
        }}>{formatToThreeDigits(item.JumlaYaFainiZote)}</Text>*/}
      </TouchableOpacity>

     

 <TouchableOpacity
        style={[
          globalStyles.cell,
          globalStyles.buttoncolumn,
          { 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection:'row' ,
          },
        ]}
        onPress={() => handlePressPokeaFaini(item)}
      //   onPress={() => {
      //   setSelectedProduct(item);
      //   setModalVisible(true);
      //   setIsModalVisible(true); // Reset state when modal closes
       
      // }}
      >
        <FontAwesome
          name="trash-o"
          size={30}
          style={[globalStyles.TableIconColor,
            {
              color:'red',
            }

            ]}
        />

       {/* <Text style={{
          color:'white',
          fontFamily:'Light',
        }}>{formatToThreeDigits(item.JumlaYaFainiZote)}</Text>*/}
      </TouchableOpacity>

     



    </View>
  )

    // hili bano la chini ni la if ya juu kama mtu akitype   
}

 if (item.JinaKamiliLaMwanafunzi.toLowerCase().includes(input.toLowerCase())) {



  return (
    <View key={item.id} style={globalStyles.row2}>
    
   
   
     
      <Text style={[globalStyles.cell, globalStyles.firstNameColumn]}>{item.JinaKamiliLaMwanafunzi}</Text>
   
   {item && item.Darasa && item.Darasa.Darasa ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Darasa.Darasa}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item && item.Mkondo && item.Mkondo.Mkondo ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Mkondo.Mkondo}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item.Mahali ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.Mahali}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

    {item.SimuYaMzazi_1 ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>0{item.SimuYaMzazi_1}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}
    

    {item.SimuYaMzazi_2 ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>0{item.SimuYaMzazi_2}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}

     {item.EmailYaMzazi ? (
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>{item.EmailYaMzazi}</Text>
    ):(
    <Text style={[globalStyles.cell, globalStyles.otherColumns]}>-</Text>
    )}




    <TouchableOpacity
        style={[
          globalStyles.cell,
          globalStyles.buttoncolumn,
          { 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection:'row' ,
          },
        ]}
        onPress={() => handlePressPokeaMarejesho(item)}
      //   onPress={() => {
      //   setSelectedProduct(item);
      //   setModalVisible(true);
      //   setIsModalVisible(true); // Reset state when modal closes
       
      // }}
      >
        <MaterialCommunityIcons
          name="gesture-tap-button"
          size={30}
          style={[globalStyles.TableIconColor,
            {
              color:'wheat',
            }

            ]}
        />

       {/* <Text style={{
          color:'white',
          fontFamily:'Light',
        }}>{formatToThreeDigits(item.JumlaYaFainiZote)}</Text>*/}
      </TouchableOpacity>

     

 <TouchableOpacity
        style={[
          globalStyles.cell,
          globalStyles.buttoncolumn,
          { 
            justifyContent: 'space-between', 
            alignItems: 'center',
            flexDirection:'row' ,
          },
        ]}
        onPress={() => handlePressPokeaFaini(item)}
      //   onPress={() => {
      //   setSelectedProduct(item);
      //   setModalVisible(true);
      //   setIsModalVisible(true); // Reset state when modal closes
       
      // }}
      >
        <FontAwesome
          name="trash-o"
          size={30}
          style={[globalStyles.TableIconColor,
            {
              color:'red',
            }

            ]}
        />

       {/* <Text style={{
          color:'white',
          fontFamily:'Light',
        }}>{formatToThreeDigits(item.JumlaYaFainiZote)}</Text>*/}
      </TouchableOpacity>

     



    </View>
  )
  // hili bano la chini ni la if ya pili mwisho
  }


};














// New Component for Table Row
const MarejeshoYaLeoComponent = ({ item}) => {

  return (

    <Pressable>
      

    <View 
style={[globalStyles.FullRipotiYaSikuContainer,
  {
    width:'100%',
     marginBottom:0,
    marginTop:0,
    marginVertical:0,
    //backgroundColor:'red',
    paddingVertical:0,
    justifyContent:'space-between',

  }]}
>

<Pressable 
style={[globalStyles.FullRipotiYaSikuLeftMajorContainer,

   {
   //backgroundColor:'green',
   width:'70%',
   }
  ]}
>
  


{/*mwanzo wa Left View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuLeftContainer,

  {
    alignItems:'center',
    flexDirection:'row',
    justifyContent:'space-between',
  
  }

  ]}
>
<Text 
style={[globalStyles.FullRipotiYaSikuLeftText,
  {
   // width:'100%',
  }

  ]}
 >{item.JinaKamiliLaMwanafunzi}</Text>

  
</View>
{/*mwanzo wa Left View*/} 



</Pressable>





{/*Right start here----------------------------------------------------*/}

<Pressable 
style={[globalStyles.FullRipotiYaSikuRightMajorContainer,

  {
    //backgroundColor:'blue',
    width:'20%',
  }

  ]}
>
 

{/*mwanzo wa Right View*/} 
<View 
style={[globalStyles.FullRipotiYaSikuRightContainer,

  {
    justifyContent:'center',
    alignItems:'center'
  }

  ]}
>
{userData && userData.is_admin === true && (
  <FontAwesome
  onPress={() => navigation.navigate('Futa Mwanafunzi Attendence', { ...item, postId: item.id })}
          name="trash-o"
          size={25}
          style={[globalStyles.TableIconColor,
            {
              color:'red',
              marginRight:0,
            }

            ]}
        />
    )}
</View>
{/*mwanzo wa Right View*/} 






</Pressable>


</View>



    </Pressable>
   
  )
  
}








  return (
      <>{!fontsLoaded ? (<View/>):(

            <>


 {!isPending ? (



        <View style={globalStyles.container}>
          <MinorHeader />

          <View style={{ width: '100%', marginVertical: 0 }}>
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
              Wanafunzi Wote {Darasa}
            </Text>
          </View>

          <View style={globalStyles.searchbarOtherPages}>
            <View style={globalStyles.searchbarIconContainerOtherPages}>
              <Ionicons
                name="search-outline"
                size={25}
                color={COLORS.black}
                style={globalStyles.AppIConHomeScreenOtherPages}
              />
            </View>
            <View style={globalStyles.searchbarInputContainerOtherPages}>
              <TextInput
                value={input}
                onChangeText={(text) => setInput(text)}
                placeholder="Ingiza jina"
                placeholderTextColor="black"
                style={globalStyles.AppInputHomeScreenOtherPages}
              />
            </View>
          </View>

          <ScrollView 
         //   keyboardShouldPersistTaps="handled"
         //      refreshControl={
         //    <RefreshControl
         //    refreshing={refresh}
         //    onRefresh={() => pullMe()}
         //    />
         //   }
         // showsVerticalScrollIndicator={false}
       
          onScroll={handleScroll} scrollEventThrottle={16}
         
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

              <View style={globalStyles.table}>
                <View style={[globalStyles.row, globalStyles.header]}>
                
                
                

        

                  <Text style={[globalStyles.cell2, globalStyles.firstNameColumn]}>Jina Kamili</Text>
           
         <Text style={[globalStyles.cell2, globalStyles.otherColumns]}>Darasa</Text>
             
                 <Text style={[globalStyles.cell2, globalStyles.otherColumns]}>Mkondo</Text>
                     <Text style={[globalStyles.cell2, globalStyles.otherColumns]}>Mahali</Text>
                       <Text style={[globalStyles.cell2, globalStyles.otherColumns]}>Simu 1</Text>
                         <Text style={[globalStyles.cell2, globalStyles.otherColumns]}>Simu 2</Text>

<Text style={[globalStyles.cell2, globalStyles.otherColumns]}>EmailYaMzazi</Text>
                        

           <Text style={[globalStyles.cell2, globalStyles.buttoncolumn]}>Badilisha</Text>
           <Text style={[globalStyles.cell2, globalStyles.buttoncolumn]}>Zaidi</Text>
                  
                </View>

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

     <View style={globalStyles.table}>
                <View style={[globalStyles.row, globalStyles.header]}>
                
                <Text style={[globalStyles.cell2, globalStyles.buttoncolumn]}>Ingiza</Text>
                

               

                  <Text style={[globalStyles.cell2, globalStyles.firstNameColumn]}>Jina Kamili</Text>
                  
                  
                </View>
             
           {/*  mwanzo wa message hakuna taarifa*/}
           <View style={[globalStyles.noitemTextContainer,{
            alignItems:'flex-start',

           }]}>
            <Text style={[globalStyles.noitemText,
              {
                textAlign:'Left',
              }

              ]}>hukuna Taarifa
            </Text>


          </View>
             {/*  mwisho wa message hakuna taarifa*/}
               

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
        {/*  <View style={{
            width:'50%',
          }}>
            <Text style={{ 
              fontFamily:'Medium'
            }}>
              Bei ya jumla
            </Text>

             <Text style={{ 
              fontFamily:'Medium'
            }}>
              Tsh. {formatToThreeDigits(totalCartPrice)}/=
            </Text>
           
          </View>*/}

         

          <TouchableOpacity
         //onPress={() => navigation.navigate("Home Stack")}
           
            style={{
              
              padding: 10,
              width:'100%',
              borderRadius: 6,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
            }}
          >
            
            <Text style={{
             //fontSize: 16, 
             //fontWeight: "500", 
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

           }}>
              Jumla: {JumlaYaWote}
            </Text>
          </TouchableOpacity>



          

        </Pressable>
   







{/*MODAL FOR MAKING ORDER*/}

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setIsModalVisible(false); // Reset state when modal closes
        }}
      >
     
   
      
          <ImageBackground

                source={require('../assets/bg.jpg')}
                style={{
                    flex: 1,
                    opacity:1,
                   // height:height/4,
                    alignItems: 'center',
                   // marginTop:height/4,
                    //marginHorizontal:7,
                    //width:'98%'
                    justifyContent:'center',
                }}
                resizeMode= "cover"
            >
    
    <View style={{
      // borderWidth:1,
      // borderColor:'white',
      padding:30,
      justifyContent:'center',
      alignItems:'center',
    }}>
           
          {selectedProduct &&
            <Text style={[globalStyles.ModalTitleViewProduct,
              {
                textAlign:'center',
                fontFamily:'Medium',
                color:'white',
                marginBottom:0,

              }
              ]}>
              
            
              Umechagua {selectedProduct.JinaKamiliLaMwanafunzi}
            
            
            </Text>}


                  


          
            

            <View style={[globalStyles.ButtonConatinerViewProduct,
              {
                marginTop:0,
                //backgroundColor:'red',
                flexDirection: 'row',
                marginTop: 20,
                alignItems:'space-around',
                flex:0,
              }

              ]}>
                   {/* <TouchableOpacity 
                    style={globalStyles.ButtonCloseViewProduct} 
                      onPress={() => {
    
                        setIsModalVisible(false); // Update state when modal opens
                        setModalVisible(false);
                      }}
                     >
                        <Text style={globalStyles.ConfirmCancelButtonTextViewProduct}>Sitisha</Text>
                    </TouchableOpacity>*/}
                    <TouchableOpacity 
                    style={[globalStyles.ButtonAddViewProduct,
                      {
                            backgroundColor:'green',
                            borderWidth:1,
                            borderColor:'white',
                          }
                      ]}  
                    onPress={addCartItem} >
                        <Text 
                        style={[
                          globalStyles.ConfirmCancelButtonTextViewProduct,
                          {
                            //backgroundColor:'black'
                          }
                          ]}>Kubali</Text>
                    </TouchableOpacity>


                      <TouchableOpacity 
                    style={[globalStyles.ButtonAddViewProduct,
                      {
                            backgroundColor:'brown',
                            borderWidth:1,
                            borderColor:'white',
                            marginLeft:10,
                          }
                      ]}  
                    //onPress={addCartItem}
                     onPress={() => {
                    //setSelectedProduct(item);
                    setModalVisible(false);
                    setIsModalVisible(false); // Reset state when modal closes
                   
                  }}


                     >
                        <Text 
                        style={[
                          globalStyles.ConfirmCancelButtonTextViewProduct,
                          {
                            //backgroundColor:'black'
                          }
                          ]}>Funga</Text>
                    </TouchableOpacity>
           


          </View>


          </View>
           </ImageBackground> 
        
        
      
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

export default WanafunziWanafunzi2;
