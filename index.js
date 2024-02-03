/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import TrackPlayer from 'react-native-track-player';
import mobileAds, {MaxAdContentRating} from 'react-native-google-mobile-ads';

mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,

    tagForChildDirectedTreatment: true,

    tagForUnderAgeOfConsent: true,

    testDeviceIdentifiers: ['EMULATOR'],
  })
  .then(() => {
    // Request config successfully set!
  });

TrackPlayer.registerPlaybackService(() => require('./Service'));

AppRegistry.registerComponent(appName, () => App);
