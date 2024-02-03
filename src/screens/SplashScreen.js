import {View, Text, Image, Dimensions, StatusBar} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation, StackActions} from '@react-navigation/native';

const SplashScreen = () => {
  const {height, width} = Dimensions.get('window');

  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      navigation.reset({index: 0, routes: [{name: 'home'}]});
    }, 2000);
  });
  return (
    <View style={{height: height, width: width, marginHorizontal: 1}}>
      <StatusBar backgroundColor="#abdbe3" />
      <Image
        style={{height: '100%', width: '100%'}}
        resizeMode="stretch"
        source={require('../../Assets4/splash.png')}
      />
    </View>
  );
};

export default SplashScreen;
