import React, { useState, useEffect, useRef } from "react";
import { FlatList, View, Text, TextInput, StatusBar, StyleSheet, TouchableOpacity, Image, ScrollView, Keyboard, SafeAreaView } from "react-native";
import { TouchableNativeFeedback } from 'react-native-gesture-handler';
import { IconComponentProvider, Icon } from "@react-native-material/core";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Header from "../Header";
import { useSelector, useDispatch } from 'react-redux';
import {useTranslation} from "react-i18next";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { toastr } from '../../services/navRef';
import teltonika from "../../components/Teltonika.json";
import ruptela from "../../components/Ruptela.json";
import { validDeviceImei } from '../utils/util';
import { addVehicles } from "../../actions/vehicles";
import { usernameList } from '../../actions/user';
import CountryPicker, {
  CountryModalProvider,
  Flag,
} from "react-native-country-picker-modal";

export default function Vehicle_Add({ navigation }) {

  const {t} = useTranslation();
  const dispatch = useDispatch()

  const [searchText, setSearchText] = useState("");
  const authReducer = useSelector(state => state.auth);
  const userReducer = useSelector(state => state.user);

  const vehicleTypeArray = ["Car", "Truck"];
  const deviceTypeArray = ["Teltonika", "Ruptela"];
  const cameraTeltonikaArray = ["Dual Cam", "ADAS"];
  const cameraRuptelaArray = ["RS232", "ZMID"];
  const [clientArray, setClientArray] = useState([]);

  const [vehicleType, setVehicleType] = useState(vehicleTypeArray[0]);
  const [vehicleName, setVehicleName] = useState("");
  const [deviceIMEI, setDeviceIMEI] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [fullMobileNo, setFullMobileNo] = useState("");
  const [deviceType, setDeviceType] = useState("");
  const [deviceModel, setDeviceModel] = useState("");
  const [camera, setCamera] = useState("");
  const [addClient, setAddClient] = useState("");

  const [curFocus, setCurFocus] = useState("");

  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const [countryCode, setCountryCode] = useState("US");
  const [code, setCode] = useState("1");

  useEffect(() => {
    dispatch(usernameList(authReducer.token));
  }, []);

  useEffect(() => {
    if(userReducer.usernameList?.length > 0) {
      const tmpArray = userReducer.usernameList.map( (item) => {
        return {key:item.lname, value:item.lname};
      })
      setClientArray(tmpArray);
    }
  }, [userReducer.usernameList]);

  
  const onAdd = () => {
    if(vehicleTypeArray.filter( item => item === vehicleType).length === 0) {
      toastr(t("please_select_vehicle_type"));
      return;
    }
    if(vehicleName === "") {
      toastr(t("please_enter_vehicle_name"));
      return;
    }
    if(!validDeviceImei(deviceIMEI)) {
      toastr(t('please_enter_valid_IMEI'))
      return;
    }
    if(mobileNo.trim() === "") {
      toastr(t("please_enter_phone"))
      return;
    }
    if(deviceTypeArray.filter( item => item === deviceType).length === 0) {
      toastr(t("select_device_type"));
      return;
    }

    if(teltonika.map( item => item.value).filter( ic => ic ===deviceModel).length === 0 
      && ruptela.map( item => item.value).filter( ic => ic ===deviceModel).length === 0 ) {
      toastr(t("select_device_model"));
      return;
    }

    const sendData = {
      token: authReducer.token,
      userId: authReducer.user._id,
      vehicleNo: vehicleName,
      vehicleType: vehicleType,
      deviceImei: deviceIMEI,
      deviceType: deviceType,
      deviceModel: deviceModel,
      mobileNo: "+" + code + " " + mobileNo ,
      camera: camera,
      addClient: addClient
    };
    console.log("@@MOBILE", sendData)
    dispatch(addVehicles(sendData, navigation))
  }

  const selectedDeviceType = (val) => {
    setDeviceType(val);
    if(val === deviceTypeArray[0]) {
      if(teltonika.map( item => item.value).filter( ic => ic ===deviceModel).length === 0) {
        setDeviceModel(teltonika[0].value)
      }
    } else if(val === deviceTypeArray[1]) {
      if(ruptela.map( item => item.value).filter( ic => ic ===deviceModel).length === 0) {
        setDeviceModel(ruptela[0].value)
      }
    }
  }

  function filterData(data, searchText) {
    return data.filter(
      function (item) {
        if (item.toLowerCase().includes(searchText.toLowerCase())) {
          return item;
        }
      }
    );
  }

  const [isFocusedInput, setIsFocusedInput] = useState("");
  
  const onFocusInput = (data) => {
    setIsFocusedInput(data);
    setCurFocus(data);
  };

  const onBlurInput = (data) => {
    switch(data) {
      case 'vehicle_type':
        // if(vehicleTypeArray.filter(item =>vehicleType === item).length === 0) {
        //   setVehicleType(vehicleTypeArray[0]);
        // }
        break;
      case 'device_type':
        // if(deviceTypeArray.filter(item =>deviceType === item).length === 0) {
        //   // selectedDeviceType("deviceTypeArray[0]")
        //   setDeviceType(""); setDeviceModel(""); setCamera("");
        // }
        break;
      case 'device_model':
        // let modelArray = [];
        // if(deviceType === deviceTypeArray[0]) {
        //   modelArray = teltonika.map(item => {return item.value})
        // } else if(deviceType === deviceTypeArray[1]) {
        //   modelArray = ruptela.map(item => {return item.value})
        // }
        // if(modelArray.filter(item =>deviceModel === item).length === 0) {
        //   setDeviceModel("");
        // }
        break;
      case 'camera':
        // let cameraArray = [];
        // if(deviceType === deviceTypeArray[0]) {
        //   cameraArray = cameraTeltonikaArray;
        // } else if(deviceType === deviceTypeArray[1]) {
        //   cameraArray = cameraRuptelaArray;
        // }

        // if(cameraArray.filter(item =>camera === item).length === 0) {
        //   setCamera("")
        // }
        break;
      case 'addClient':
        // let clientArray = [];
        // clientArray = userReducer.usernameList.map(item => {return item.lname})
        // if(clientArray.filter(item =>addClient === item).length === 0) {
        //   setAddClient("")
        // }
        break;
    }
    setIsFocusedInput("");
  };

  const renderMenuList = (type, searchTxt) => {
    let listData = null;
    switch(type) {
      case 'vehicle_type':
        if(vehicleTypeArray.filter( item => item === searchTxt ).length !== 0 ) {
          listData = vehicleTypeArray
        } else {
          listData = filterData(vehicleTypeArray, searchTxt);
        }
        break;
      case 'device_type':
        if(deviceTypeArray.filter( item => item === searchTxt ).length !== 0 ) {
          listData = deviceTypeArray;
        } else {
          listData = filterData(deviceTypeArray, searchTxt);
        }
        break;
      case 'device_model':
        let modelArray = [];
        if(deviceType === deviceTypeArray[0]) {
          modelArray = teltonika.map(item => {return item.value})
        } else if(deviceType === deviceTypeArray[1]) {
          modelArray = ruptela.map(item => {return item.value})
        }
        // if(modelArray.length === 0) {

        // } else {
          if(modelArray.filter( item => item === searchTxt ).length !== 0 ) {
            listData = modelArray;
          } else {
            listData = filterData(modelArray, searchTxt);
          }
        // }
        break;
      case 'camera':
        let cameraArray = [];
        if(deviceType === deviceTypeArray[0]) {
          cameraArray = cameraTeltonikaArray;
        } else if(deviceType === deviceTypeArray[1]) {
          cameraArray = cameraRuptelaArray;
        }

        if(cameraArray.filter( item => item === searchTxt ).length !== 0 ) {
          listData = cameraArray;
        } else {
          listData = filterData(cameraArray, searchTxt);
        }
        break;
      case 'addClient':
        let clientArray = [];
        clientArray = userReducer.usernameList.map(item => {return item.lname})
        listData = filterData(clientArray, searchTxt);
        break;
    }
    if (listData.length === 0) {
      return (
        <View style={{position:'absolute', zIndex:100, top:60, width:190,  backgroundColor:'white', borderWidth:1, borderColor:'#A9A9A9', 
        borderRadius:8, paddingLeft:15, paddingTop:5, paddingBottom:5, }}>
          <Text style={{ alignItems: 'center', color:'#888', fontWeight:'500' }}>No Result</Text>
        </View>
      )
    }

    if(type === "vehicle_type") {
      return (
        <View
        style={{position:'absolute', zIndex:100, top:60, width:190, maxHeight:150, backgroundColor:'white', borderWidth:1, borderColor:'#A9A9A9', 
                  borderRadius:8, paddingLeft:15, paddingTop:5, paddingBottom:5, }}>
          <FlatList
            data={listData} 
            
            renderItem={({ item }) => (
              <TouchableNativeFeedback
                onPress={ 
                () => {
                  switch(type) {
                    case 'vehicle_type':
                      setVehicleType(item);
                      break;
                    case 'device_type':
                      // setDeviceType(item);
                      selectedDeviceType(item);
                      
                      // setSearchText("");
                      break;
                    case 'device_model':
                      setDeviceModel(item)
                      break;
                    case 'camera':
                      setCamera(item)
                      break;
                    case 'addClient':
                      setAddClient(item)
                      break;
                      }
                }}
              >
                <Text style={{color:'#1E6B97', fontSize:14, fontWeight:'500'}}>{item}</Text>
              </TouchableNativeFeedback>
            )}
          />
        </View>
      );
    } else {
      return (
        <View
        style={{position:'absolute', zIndex:100, bottom:40, width:190, maxHeight:150, backgroundColor:'white', borderWidth:1, borderColor:'#A9A9A9', 
                  borderRadius:8, paddingLeft:15, paddingTop:5, paddingBottom:5, }}>
          <FlatList
            data={listData} 
            renderItem={({ item }) => (
              <TouchableNativeFeedback
                onPress={ 
                () => {
                  switch(type) {
                    case 'vehicle_type':
                      setVehicleType(item);
                      break;
                    case 'device_type':
                      // setDeviceType(item);
                      selectedDeviceType(item);
                      
                      // setSearchText("");
                      break;
                    case 'device_model':
                      setDeviceModel(item)
                      break;
                    case 'camera':
                      setCamera(item)
                      break;
                    case 'addClient':
                      setAddClient(item)
                      break;
                      }
                }}
              >
                <Text style={{color:'#1E6B97', fontSize:14, fontWeight:'500'}}>{item}</Text>
              </TouchableNativeFeedback>
            )}
          />
        </View>
      );
    }
  };

  const renderFlagButton = (props) => {
    return (
      <Flag
        countryCode={countryCode}
        flagSize={25}
      />
    );
  };

  const onSelect = (country) => {
    setCountryCode(country.cca2)
    setCode(country.callingCode[0])
  }


  return (
      <SafeAreaView style={{flex:1, backgroundColor:'#F1F4FA'}}>
        <StatusBar backgroundColor={"#364153"} barStyle={"light-content"} />
        <Header back='true' screenName={t('add_new_vehicle')} curNavigation={navigation}></Header>
        <ScrollView>
          <View style={{flexDirection:'column', justifyContent:'space-between',alignSelf:'center',alignItems:'center'}}>
        
            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('vehicle_type')}</Text>
              <TextInput style={styles.in1} value={vehicleType} onChangeText={(val) => { setVehicleType(val) }}
                onFocus={() => onFocusInput("vehicle_type")} onBlur={() => onBlurInput("vehicle_type")}/>
              {isFocusedInput === "vehicle_type" && renderMenuList('vehicle_type', vehicleType)}
              {vehicleType === "Car" &&
                <Image 
                  source={require("../../../assets/type_car.png")} 
                  style={{alignSelf:'center', width: 35, height: 15, right:50, top:35, position:'absolute', resizeMode: 'contain' }}/> }
              {vehicleType === "Truck" &&
                <Image 
                  source={require("../../../assets/type_truck.png")} 
                  style={{alignSelf:'center', width: 30, height: 20, right:50, top:30, position:'absolute', resizeMode: 'contain' }}/> }
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={22} color="#484747" style={{position:'absolute', right:10, top:28}} />
              </IconComponentProvider>
            </View>

            <View style={{width:wp('84.8%'), marginTop: 10}}>
              <Text style={styles.inputHeader}>{t('vehicle_name_or_plate_no')}</Text>
              <TextInput style={styles.in1} value={vehicleName} onChangeText={(val) => { setVehicleName(val) }}/>
            </View>

            <View style={{width:wp('84.8%'), marginTop: 10}}>
              <Text style={styles.inputHeader}>{t('device_imei')}</Text>
              <TextInput style={styles.in1} keyboardType='numeric' value={deviceIMEI} onChangeText={(val) => { setDeviceIMEI(val)}}/>
            </View>

            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('mobile_no')}</Text>
              <View style={[styles.in1, {flexDirection:'row', alignItems:'center'}]}>
                <TouchableOpacity onPress={() => {setShowCountryPicker(true) }}>
                  <View style={{flexDirection:'row', alignItems:'center'}}>
                    <CountryModalProvider>
                      <CountryPicker
                        visible={showCountryPicker}
                        onSelect={onSelect}
                        withEmoji
                        withFilter
                        withFlag
                        countryCode={countryCode}
                        renderFlagButton={renderFlagButton}
                        withCallingCode
                        onClose={() => setShowCountryPicker(false)}/>
                      <Text style={{color:'#1E6B97', fontSize:16, fontWeight:'500'}}>+{code}</Text>
                      < Image source={require('../../../assets/dropdown_ico.png')} style={{marginLeft:5, height:25, width:25}} />
                    </CountryModalProvider>
                  </View>
                </TouchableOpacity>
                <View style={{marginLeft:1, backgroundColor:'rgba(0,0,0,0.25)', width:1, height:hp('4%')}}></View>
                <TextInput style={{backgroundColor:'white', flex:1, color:'#1E6B97', fontSize:16, fontWeight:'500', marginLeft:10}} value={mobileNo}
                  keyboardType="number-pad" onChangeText={(text)=>setMobileNo(text)}></TextInput>
              </View>
            </View>

            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('device_type')}</Text>
              <TextInput style={styles.in1} placeholder={t('select_device_type')} value={deviceType}  onChangeText={(val) => { setDeviceType(val) }}
                onFocus={() => onFocusInput("device_type")} onBlur={() => onBlurInput("device_type")}/>
              {isFocusedInput === "device_type" && renderMenuList('device_type', deviceType)}
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={22} color="#484747" style={{position:'absolute', right:10, top:28}} />
              </IconComponentProvider>
            </View>

            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('device_model')}</Text>
              <TextInput style={styles.in1} placeholder={t('select_device_model')} value={deviceModel} onChangeText={(val) => { setDeviceModel(val) }}
                onFocus={() => onFocusInput("device_model")} onBlur={() => onBlurInput("device_model")}/>
              {isFocusedInput === "device_model" && renderMenuList('device_model', deviceModel)}
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={22} color="#484747" style={{position:'absolute', right:10, top:28}} />
              </IconComponentProvider>
            </View>

            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('camera_optional')}</Text>
              <TextInput style={styles.in1} value={camera} onChangeText={(val) => { setCamera(val) }}
                onFocus={() => onFocusInput("camera")} onBlur={() => onBlurInput("camera")}/>
              {isFocusedInput === "camera" && renderMenuList('camera', camera)}
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={22} color="#484747" style={{position:'absolute', right:10, top:28}} />
              </IconComponentProvider>
            </View>

            <View style={{width:wp('84.8%'), marginTop:10}}>
              <Text style={styles.inputHeader}>{t('add_to_client')}</Text>
              <TextInput style={styles.in1} value={addClient} onChangeText={(val) => { setAddClient(val) }}
                onFocus={() => onFocusInput("addClient")} onBlur={() => onBlurInput("addClient")}/>
              {isFocusedInput === "addClient" && renderMenuList('addClient', addClient)}
              <IconComponentProvider IconComponent={MaterialCommunityIcons}>
                <Icon name="chevron-down" size={22} color="#484747" style={{position:'absolute', right:10, top:28}} />
              </IconComponentProvider>
            </View>

            <TouchableOpacity style={{flexDirection: 'row', borderRadius:10, marginTop: 25, marginBottom: 50, justifyContent:'center',  
                alignSelf:'center', alignItems: 'center', backgroundColor:'#364153', width:wp('84.8%'), 
                height:40,}} onPress={() => { onAdd() }}>
              <Text style={{ fontSize: 15, fontWeight: 'bold', color: 'white',
                textAlign:'center' }}>{t("add_vehicle")}</Text>
            </TouchableOpacity>

          </View>
        </ScrollView>
      </SafeAreaView>           
  );
}

const styles = StyleSheet.create({
  v1: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: 'space-between',
  },
  v4: {
    flexDirection: "row",
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    marginTop: 5,
    borderColor: '#A9A9A9',
    backgroundColor: 'white',
    borderRadius: 8,
    width: wp('84.8%'),
  },
  eyeIcon: {
    width: 20,
    height: 20,
    // position:'absolute',
    right:0,
    marginHorizontal: 10,
  },
  passInput:{
    backgroundColor:'white',
    padding: 4,
    borderRadius: 8,
    width: wp('75%'),
    height: hp('4.9%'),
    paddingLeft: wp('5%'),
    marginRight: wp('37%'),
    color:'#1E6B97', fontSize:13,
    paddingLeft:15,paddingRight:15
  },
  in1: {
    height: 40,
    marginTop: 5,
    color:'#1E6B97', fontSize:14, fontWeight:'500',
    backgroundColor: 'white',
    borderRadius: 8, borderWidth: 1, borderColor: '#A9A9A9',
    paddingLeft: 15, paddingRight: 15
  },
  inputHeader: {
    fontSize: 11, 
    color: '#333',
    fontWeight:'500'
  },
  dropdown: {
    marginTop:5,
    height: 40,
    width:wp('85%'),
    color:'#1E6B97',
    backgroundColor: 'white',
    borderRadius: 8, borderWidth:1, borderColor:'#A9A9A9'
},
});
