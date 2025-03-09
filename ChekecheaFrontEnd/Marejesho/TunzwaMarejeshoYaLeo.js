


{/*mwanzo wa view ya taarifa binafsi*/}
<View style={globalStyles.TaarifaBinafsiMainContainer}>
  
  {PichaYaMwanafunzi ? (
      <Image
     style={globalStyles.TaarifaBinafsiMtejaImage}
      source={{
      uri: EndPoint + '/' + PichaYaMwanafunzi
    }}
       //source={require('../assets/profile.jpg')} 
      >
      </Image>

      ):(
     <Image
     style={globalStyles.TaarifaBinafsiMtejaImage}
      
       source={require('../assets/profile.jpg')} 
      >
      </Image>
      )}

      <Text style={globalStyles.TaarifaBinafsiJinaLaMteja}>
     {JinaKamiliLaMwanafunzi}    
      </Text>
      
      {Darasa && (
       <Text style={globalStyles.TaarifaBinafsiJinaLaKituo}>
     Darasa: {Darasa} 
      </Text>
      )}

     {Mkondo && (
       <Text style={globalStyles.TaarifaBinafsiSimuYaMteja}>
     Mkondo: {Mkondo}    
      </Text>
      )}


 {SikuAmbazoHajaja && SikuAmbazoHajaja > 0 &&(
       <Text style={globalStyles.TaarifaBinafsiJinaLaKituo}>
     Siku Ambazo Hajaja: {SikuAmbazoHajaja} 
      </Text>
      )}





</View>
  {/*mwisho wa view ya taarifa binafsi*/}



