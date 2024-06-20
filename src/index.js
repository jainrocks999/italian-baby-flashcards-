import {
  AppState,
  BackHandler,
  LogBox,
  ToastAndroid,
  Platform,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import MyStack from './components/MyStack';

import {AdEventType, InterstitialAd} from 'react-native-google-mobile-ads';
import {Addsid} from './screens/ads';
import {IAPContext} from './Context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Root = () => {
  LogBox.ignoreAllLogs();
  const {hasPurchased} = useContext(IAPContext);
  const appState = useRef(AppState.currentState);
  const interstitial = InterstitialAd.createForAdRequest(Addsid.Interstitial, {
    requestNonPersonalizedAdsOnly: true,
  });
  const doublePressTimeout = useRef(null);

  const [appStateVisible, setAppStateVisible] = useState(false);
  const [count, setCount] = useState(1);
  const handleAppStateChange = nextState => {
    if (
      appState.current.match(/inactive|background/) &&
      nextState == 'active'
    ) {
      setAppStateVisible(true);
    }
    appState.current = nextState;
    if (appState.current == 'background') {
    }
  };
  useEffect(() => {
    const unsubscribe = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );
    return () => unsubscribe.remove();
  }, []);
  useEffect(() => {}, [appStateVisible]);

  async function handleBackButtonClick() {
    if (
      (doublePressTimeout.current &&
        doublePressTimeout.current + 2000 >= Date.now()) ||
      Platform.OS != 'android'
    ) {
      const purchase = await AsyncStorage.getItem('IN_APP_PURCHASE');
      if (purchase) {
        console.log(purchase);
        BackHandler.exitApp();
      } else {
        showAdd1();
      }
      return true;
    } else {
      ToastAndroid.show('Press again to exit', ToastAndroid.SHORT);
      doublePressTimeout.current = Date.now();
      return true;
    }
  }

  const showAdd1 = () => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
        BackHandler.exitApp();
      },
    );
    interstitial.load();
    return unsubscribe;
  };

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackButtonClick);
    return () => {
      BackHandler.removeEventListener(
        'hardwareBackPress',
        handleBackButtonClick,
      );
    };
  }, []);
  return <MyStack />;
};

export default Root;
