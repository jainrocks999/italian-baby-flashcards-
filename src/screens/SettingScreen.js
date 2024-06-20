import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  Image,
  StyleSheet,
  BackHandler,
  Alert,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {height, width} from '../components/Diemenstions';
import React, {useContext, useEffect, useState} from 'react';
import Switch from '../components/Switch';
import {useDispatch, useSelector} from 'react-redux';
import TrackPlayer from 'react-native-track-player';
import {QuestionMode} from '../reduxToolkit/Slice3';
import {addSetting} from '../reduxToolkit/Slice2';
import {StackActions, useNavigation} from '@react-navigation/native';
import Header from '../components/Header';
import {addCancleble} from '../reduxToolkit/Slice5';
import {addPagable} from '../reduxToolkit/Slicer6';
var SQLite = require('react-native-sqlite-storage');
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
const db = SQLite.openDatabase({
  name: 'eFlashItalian.db',
  createFromLocation: 1,
});
import {isTablet} from 'react-native-device-info';
import {BannerAdSize, BannerAd} from 'react-native-google-mobile-ads';
import {Addsid} from './ads';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {IAPContext} from '../Context';
import PurcahsdeModal from '../components/requestPurchase';
const SettingScreen = props => {
  const {hasPurchased, visible, setVisible, requestPurchase, checkPurchases} =
    useContext(IAPContext);

  const pr = props.route.params.pr;
  const muted = useSelector(state => state.sound);
  const canlable = useSelector(state => state.cancle);
  const tablet = isTablet();
  const [mute, setMute] = useState(muted);
  const quesion = useSelector(state => state.question);
  const setting = useSelector(state => state.setting);
  const backSound = useSelector(state => state.backsound);
  const Navigation = useNavigation();
  const dispatch = useDispatch();
  const [togleSwitch, setToggleSwich] = useState({
    ActualSound: setting.ActualSound,
    English: setting.English,
    RandomOrder: setting.RandomOrder,
    Swipe: setting.Swipe,
    Videos: setting.Videos,
    Voice: setting.Voice,
  });
  const [questionMode, setquestion] = useState(quesion);
  const handleSwitch = (name, value) => {
    if (questionMode == 1) {
      alert('This setting is disabled when quesion mode is enabled');
    } else {
      setToggleSwich(prev => ({...prev, [name]: value == 1 ? 0 : 1}));
    }
  };
  const Save = async () => {
    updateSettings();
    dispatch(QuestionMode(questionMode));
    dispatch(addSetting(togleSwitch));
    if (pr === 'question') {
      if (questionMode == 0) {
        Navigation.dispatch(StackActions.replace('details'));
        dispatch({
          type: 'backSoundFromquestions/playWhenThePage',
          fromDetails: false,
          fromQuestion: false,
        });
      } else {
        await TrackPlayer.reset();
        Navigation.dispatch(StackActions.pop());
        dispatch({
          type: 'backSoundFromquestions/playWhenThePage',
          fromDetails: togleSwitch.Voice,
          fromQuestion: questionMode,
        });
      }
    } else if (pr === 'details') {
      if (questionMode == 1) {
        Navigation.dispatch(StackActions.replace('question'));
        dispatch({
          type: 'backSoundFromquestions/playWhenThePage',
          fromDetails: false,
          fromQuestion: false,
        });
      } else {
        Navigation.dispatch(StackActions.pop());
        dispatch({
          type: 'backSoundFromquestions/playWhenThePage',
          fromDetails: togleSwitch.Voice,
          fromQuestion: questionMode,
        });
      }
    } else {
      Navigation.reset({index: 0, routes: [{name: 'home'}]});
    }
    await TrackPlayer.reset();
  };

  const updateSettings = () => {
    db.transaction(tx => {
      tx.executeSql(
        'UPDATE  tbl_settings set ActualSound=?,English=?,' +
          'Question=?,RandomOrder=?,Swipe=?,' +
          'Voice=? WHERE _id=1',
        [
          togleSwitch.ActualSound,
          togleSwitch.English,
          questionMode,
          togleSwitch.RandomOrder,
          togleSwitch.Swipe,
          togleSwitch.Voice,
        ],
        (tx, results) => {
          console.log('Query completed');
        },
        err => {
          console.log(err);
          console.log('erorr');
        },
      );
    });
  };
  const getPrevSetting = async mode => {
    let res = await AsyncStorage.getItem('setting');
    const newVal = await JSON.parse(res);
    if (mode == 0) {
      setToggleSwich(newVal);
    } else {
      await AsyncStorage.setItem('setting', JSON.stringify(togleSwitch));
      setToggleSwich({
        Voice: 0,
        Videos: 0,
        ActualSound: 0,
        RandomOrder: 0,
        English: 0,
        Swipe: 0,
      });
    }
  };
  useEffect(() => {
    const backAction = async () => {
      await TrackPlayer.reset();
      if (pr == 'home') {
        Navigation.reset({index: 0, routes: [{name: 'home'}]});
      } else {
        dispatch({
          type: 'backSoundFromquestions/playWhenThePage',
          fromDetails: togleSwitch.Voice,
          fromQuestion: questionMode,
        });
        Navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#73cbea'}}>
      <StatusBar backgroundColor="#73cbea" />
      <ImageBackground
        resizeMode="stretch"
        style={{flex: 1}}
        source={require('../../Assets4/setting_screen.png')}>
        {!hasPurchased ? (
          <PurcahsdeModal
            onPress={async () => {
              requestPurchase();
              setVisible(false);
            }}
            onClose={value => {
              setVisible(false);
            }}
            visible={visible}
            onRestore={() => {
              checkPurchases(true);
            }}
          />
        ) : null}
        <Header onPress2={() => setMute(!mute)} mute={mute} />
        <ScrollView>
          <View
            style={[
              styles.settingContainer,
              {marginTop: tablet ? '22%' : '30%'},
            ]}>
            <ImageBackground
              style={{flex: 1}}
              source={require('../../Assets4/settingpagebase.png')}>
              {!hasPurchased ? (
                <TouchableOpacity
                  onPress={() => {
                    setVisible(true);
                  }}
                  style={{
                    height: hp(7.5),
                    marginTop: '2%',
                    width: '80%',
                    alignSelf: 'center',
                  }}>
                  <Image
                    style={{height: '100%', width: '100%'}}
                    source={require('../../Assets4/upgrade.png')}
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              ) : null}
              <View
                style={{
                  marginTop: tablet
                    ? hasPurchased
                      ? '5%'
                      : '-1%'
                    : hasPurchased
                    ? '10%'
                    : null,
                  marginLeft: '5%',
                }}>
                <Switch
                  text="Question mode"
                  style={styles.sw}
                  onPress={async () => {
                    setquestion(questionMode == 1 ? 0 : 1);
                    getPrevSetting(questionMode == 1 ? 0 : 1);
                  }}
                  onFocus={() => {
                    console.log('rrrj');
                  }}
                  sw={questionMode == 1 ? true : false}
                />
                <Switch
                  text="Voice"
                  style={styles.tx}
                  onPress={() => handleSwitch('Voice', togleSwitch.Voice)}
                  sw={togleSwitch?.Voice == 1 ? true : false}
                />
                <Switch
                  text="Sound"
                  style={styles.tx}
                  onPress={() =>
                    handleSwitch('ActualSound', togleSwitch.ActualSound)
                  }
                  sw={togleSwitch.ActualSound == 1 ? true : false}
                />
                <Switch
                  text="Rendom Order"
                  style={styles.tx}
                  onPress={() =>
                    handleSwitch('RandomOrder', togleSwitch.RandomOrder)
                  }
                  sw={togleSwitch.RandomOrder == 1 ? true : false}
                />
                <Switch
                  text="Swipe"
                  style={styles.tx}
                  onPress={() => handleSwitch('Swipe', togleSwitch.Swipe)}
                  sw={togleSwitch.Swipe == 1 ? true : false}
                />
                <Switch
                  text="English Text"
                  style={styles.tx}
                  onPress={() => handleSwitch('English', togleSwitch.English)}
                  sw={togleSwitch.English == 1 ? true : false}
                />
                {/* <Switch
              text="Video"
              style={styles.tx}
              onPress={() => {
                handleSwitch('Videos', false);
              }}
              sw={togleSwitch.Videos}
            /> */}
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginHorizontal: '10%',
              marginTop: hasPurchased ? '8%' : 0,
            }}>
            <TouchableOpacity
              onPress={async () => {
                if (pr == 'home') {
                  Navigation.reset({index: 0, routes: [{name: 'home'}]});
                } else {
                  await TrackPlayer.reset();
                  dispatch({
                    type: 'backSoundFromquestions/playWhenThePage',
                    fromDetails: togleSwitch.Voice,
                    fromQuestion: quesion,
                  });
                  Navigation.goBack();
                }
              }}>
              <Image
                style={{height: hp(7), width: wp(35)}}
                source={require('../../Assets4/btncancel_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                Save();
              }}>
              <Image
                style={{height: hp(7), width: wp(35)}}
                source={require('../../Assets4/btnsave_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
        {!hasPurchased && (
          <View style={{position: 'relative', alignItems: 'center', bottom: 0}}>
            <BannerAd
              unitId={Addsid.BANNER}
              sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        )}
      </ImageBackground>
    </SafeAreaView>
  );
};

export default SettingScreen;
const styles = StyleSheet.create({
  settingContainer: {
    borderWidth: 2,
    marginTop: '40%',
    height: isTablet() ? height / 1.9 : height / 2,
    margin: '5%',
  },
  sw: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    fontSize: wp(5),
    fontWeight: 'bold',
    color: 'black',
  },
  tx: {
    alignSelf: 'flex-end',
    marginRight: '5%',
    fontSize: wp(5),
    color: 'black',
  },
});
