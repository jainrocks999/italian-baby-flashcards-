import {
  View,
  Text,
  Image,
  TouchableOpacity,
  BackHandler,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {FlatList, ScrollView} from 'react-native-gesture-handler';
import {height, width} from '../components/Diemenstions';
import {StyleSheet} from 'react-native';
import {setupPlayer} from '../components/Setup';
import TrackPlayer from 'react-native-track-player';
import {RightVOid, WrongVoid} from '../components/WrongVoid';
import {StackActions, useNavigation} from '@react-navigation/native';
import {useIsFocused} from '@react-navigation/native';
import {addPagable} from '../reduxToolkit/Slicer6';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {isTablet} from 'react-native-device-info';
import {
  InterstitialAd,
  AdEventType,
  GAMBannerAd,
  BannerAdSize,
  BannerAd,
} from 'react-native-google-mobile-ads';
import RNFS from 'react-native-fs';
import {Addsid} from './ads';
const authId = Addsid.Interstitial;
const requestOption = {
  requestNonPersonalizedAdsOnly: true,
  keywords: ['fashion', 'clothing'],
};
const QuestionPage = props => {
  const interstitial = InterstitialAd.createForAdRequest(authId, requestOption);
  const tablet = isTablet();
  const disapatch = useDispatch();
  useEffect(() => {
    const backAction = async () => {
      await TrackPlayer.reset();
      navigation.reset({index: 0, routes: [{name: 'home'}]});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const path = Platform.select({
    android: 'asset:/files/',
    ios: RNFS.MainBundlePath + '/files/',
  });

  const navigation = useNavigation();
  const backSound = useSelector(state => state.backsound);
  const [song, setSong] = useState();
  const [x, setX] = useState(0);
  const [count, setCount] = useState(1);
  const [wrong, setWrong] = useState([]);
  const [right, setRight] = useState(false);
  const data = useSelector(state => state.Items);
  const showAdd = () => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    interstitial.load();
    return unsubscribe;
  };

  const IsPlay = async (item, index) => {
    //  console.log('isPlay is fired')
    let isReady = await setupPlayer();
    await TrackPlayer.reset();
    setCount(count + 1);

    if (count > 8) {
      setCount(0), showAdd();
    }
    let arr = [
      (track = {
        url: `${path}clickon.mp3`,
        title: item.Title,
        artist: 'eFlashApps',

        duration: null,
      }),
      (track2 = {
        url: `${path}${item.Sound}`,
        title: item.Title,
        artist: 'eFlashApps',

        duration: null,
      }),
    ];
    if (isReady) {
      await TrackPlayer.add(arr);
      await TrackPlayer.play();
    }

    setSong(arr);
  };

  const [rendomdat, setrandomDat] = useState(data.slice(0, 4));
  const up = async indexx => {
    await TrackPlayer.reset();

    let traxck;
    let track2;
    traxck = WrongVoid.sort(() => Math.random() - 0.5)[1];
    track2 = RightVOid.sort(() => Math.random() - 0.5)[1];

    if (indexx === x) {
      setRight(true);
      const arr = [0, 1, 2, 3].filter(item => item != x);
      setWrong(arr);
      await TrackPlayer.add(track2);
      setTimeout(() => {
        setRight(false);
        setWrong([]);
        const shuffledData = data
          .slice()
          .sort(() => Math.random() - 0.5)
          .slice(0, 4);
        setrandomDat(shuffledData);
      }, 2000);
    } else {
      await TrackPlayer.add(traxck);
      switch (indexx) {
        case 0:
          setWrong([...wrong, 0]);
          break;
        case 1:
          setWrong([...wrong, 1]);
          break;
        case 2:
          setWrong([...wrong, 2]);
          break;
        case 3:
          setWrong([...wrong, 3]);
          break;
      }
    }

    await TrackPlayer.play();
  };

  useEffect(() => {
    backSound.fromQuestion == false ? run() : null;
  }, [rendomdat]);

  const run = async () => {
    await TrackPlayer.reset();
    let y = Math.floor(Math.random() * 4);
    rendomdat.map((item, index) => {
      if (index === y) {
        IsPlay(item, index);
        setX(y);
      }
    });
  };
  let cn = 0;
  useEffect(() => {
    backSound.fromQuestion
      ? setTimeout(() => {
          sound();
          disapatch({
            type: 'backSoundFromquestions/playWhenThePage',
            fromDetails: false,
            fromQuestion: false,
          });
        }, 500)
      : null;
  }, [backSound.fromQuestion == true]);

  const sound = async () => {
    const isSetup = await setupPlayer();
    await TrackPlayer.reset();
    await TrackPlayer.add(song);
    if (isSetup) {
      await TrackPlayer.play();
    }
  };

  const gotoSettings = async () => {
    await TrackPlayer.reset();
    disapatch({
      type: 'backSoundFromquestions/playWhenThePage',
      fromDetails: false,
      fromQuestion: false,
    });
    navigation.dispatch(StackActions.push('setting', {pr: 'question'}));
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'grey'}}>
      <StatusBar backgroundColor={'grey'} />
      <View style={{height: '100%', width: '100%'}}>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={async () => {
                await TrackPlayer.reset();

                navigation.reset({index: 0, routes: [{name: 'home'}]});
              }}>
              <Image
                style={styles.icon}
                resizeMode="contain"
                source={require('../../Assets4/btnhome_normal.png')}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => sound()}>
              <Image
                style={styles.btn2}
                source={require('../../Assets4/btnrepeat_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={async () => {
                gotoSettings();
              }}>
              <Image
                style={styles.icon}
                source={require('../../Assets4/btnsetting_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View
            style={{
              marginTop: tablet ? '5%' : '-1%',
              alignSelf: 'center',
              alignItems: 'center',
              paddingLeft: '2%',
            }}>
            <FlatList
              data={rendomdat}
              numColumns={2}
              keyExtractor={item => item.ID}
              renderItem={({item, index}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      up(index);
                      if (backSound.fromQuestion) {
                        disapatch({
                          type: 'backSoundFromquestions/playWhenThePage',
                          fromDetails: false,
                          fromQuestion: false,
                        });
                      }
                    }}
                    style={[!tablet ? styles.mobileView : styles.tabView]}
                    disabled={right || wrong.includes(index) ? true : false}>
                    <Image
                      style={{height: '100%', width: '100%'}}
                      source={{uri: `${path}${item.Image.toLowerCase()}`}}
                      resizeMode="contain"
                    />
                    {wrong.includes(index) ? (
                      <Image
                        style={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                        }}
                        // resizeMode="contain"
                        source={require('../../Assets4/wrongselection.png')}
                      />
                    ) : null}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </View>
        <View
          style={{
            bottom: 0,

            alignItems: 'center',

            borderWidth: 0,
            backgroundColor: 'white',
          }}>
          <BannerAd
            unitId={Addsid.BANNER}
            sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
            requestOptions={{
              requestNonPersonalizedAdsOnly: true,
            }}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default QuestionPage;
const styles = StyleSheet.create({
  icon: {
    height: hp(7),
    width: hp(7),
    margin: '1%',
  },
  Titel: {
    fontSize: 25,
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  header: {
    height: height / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'grey',
  },
  btn2: {
    height: hp(6.5),
    width: hp(6.5),
    alignSelf: 'center',
    marginTop: '15%',
  },
  wrongImg1: {
    height: hp(33),
    width: hp(24),
    marginHorizontal: wp(1.5),
    marginVertical: hp(3),
    // borderWidth: 4,
    alignItems: 'center',
  },
  wrongImg2: {
    height: hp(33),
    width: hp(24),
    marginHorizontal: wp(1.5),
    marginVertical: hp(3),
    // /  borderWidth: 4,
    alignItems: 'center',
  },
  worgImgContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: '16.7%',
  },
  worgImgContainer2: {
    flexDirection: 'row',
    position: 'absolute',
    bottom: '1%',
  },
  mobileView: {
    height: hp(40),
    width: '46%',
    marginHorizontal: '1.5%',
    marginVertical: '1.5%',
  },
  tabView: {
    height: hp(38),
    width: hp(27),
    marginHorizontal: hp(1.5),
    // borderWidth: 4,
    marginVertical: hp(1),
  },
  tabWrong2: {
    height: hp(40),
    width: hp(29),
    marginLeft: hp(1),
    marginVertical: hp(1),
  },
  tabWrong1: {
    height: hp(40),
    width: hp(29),
    marginLeft: hp(4),
    marginVertical: hp(1),
  },
});
