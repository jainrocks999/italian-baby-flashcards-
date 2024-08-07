import {View, Text, Image, Dimensions, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, StackActions} from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';

const SplashScreen = () => {
  const {height, width} = Dimensions.get('window');

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({index: 0, routes: [{name: 'home'}]});
    }, 2000);
  });
  return (
    <SafeAreaView style={{height: height, width: width, marginHorizontal: 1,backgroundColor:"#dff7ff"}}>
      <StatusBar backgroundColor="#dff7ff" />
      <Image
        style={{height: '100%', width: '100%'}}
        resizeMode="stretch"
        source={require('../../Assets4/splash.png')}
      />
    </SafeAreaView>
  );
};

export default SplashScreen;
