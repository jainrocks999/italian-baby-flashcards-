import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  BackHandler,
  Alert,
  Platform,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {height, width} from '../components/Diemenstions';
import TrackPlayer from 'react-native-track-player';
import {setupPlayer} from '../components/Setup';
import GestureRecognizer from 'react-native-swipe-gestures';
import {StackActions, useNavigation} from '@react-navigation/native';
import {addPagable} from '../reduxToolkit/Slicer6';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {isTablet} from 'react-native-device-info';
import {
  InterstitialAd,
  AdEventType,
  BannerAdSize,
  BannerAd,
} from 'react-native-google-mobile-ads';
import {Addsid} from './ads';
import RNFS from 'react-native-fs';
import {IAPContext} from '../Context';

const adUnit = Addsid.Interstitial;
const requestOption = {
  requestNonPersonalizedAdsOnly: true,
  // keywords: ['fashion', 'clothing'],
};
const path = Platform.select({
  android: 'asset:/files/',
  ios: RNFS.MainBundlePath + '/files/',
});
const Detials = props => {
  const {hasPurchased} = useContext(IAPContext);

  const tablet = isTablet();
  const disapatch = useDispatch();
  const backSound = useSelector(state => state.backsound);

  const interstitial = InterstitialAd.createForAdRequest(adUnit, requestOption);
  useEffect(() => {
    const backAction = async () => {
      await TrackPlayer.reset();
      disapatch(addPagable(false));

      navigation.reset({index: 0, routes: [{name: 'home'}]});
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, []);
  const [Images, setImages] = useState('');
  const [Title, setTitle] = useState({
    english: '',
    japanese: '',
  });
  const [count, setCount] = useState(0);
  const [Music, setMusic] = useState();
  const navigation = useNavigation();
  useEffect(() => {
    getData();
  }, [count]);

  const setting = useSelector(state => state.setting);

  const data = useSelector(state => state.Items);

  const getAdd = () => {
    const unsubscribe = interstitial.addAdEventListener(
      AdEventType.LOADED,
      () => {
        interstitial.show();
      },
    );
    interstitial.load();
    return unsubscribe;
  };
  function shuffle(array) {
    let currentIndex = array.length;
    let temporaryValue, randomIndex;

    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }

    return array;
  }

  let newData;

  if (setting.RandomOrder == 1) {
    const shuffledData = shuffle([...data]);
    newData = [...shuffledData];
  } else {
    newData =
      data[0].Category != 'Numbers'
        ? [...data]?.sort((a, b) => {
            const titleA = a.Title.toUpperCase();
            const titleB = b.Title.toUpperCase();

            if (titleA < titleB) {
              return -1;
            }
            if (titleA > titleB) {
              return 1;
            }
            return 0;
          })
        : [...data].sort();
  }

  const getData = async () => {
    let isSetup = await setupPlayer();
    await TrackPlayer.reset();
    let Imagess;
    let Titel;
    let track;
    let track2;
    let ActualSound;
    let y = data.length;
    if (count >= 0 && count <= y - 1) {
      console.log(newData[count]);

      ActualSound = newData[count].ActualSound;
      Imagess = `${path}${newData[count].Image.toLowerCase()}`;
      Titel = newData[count].Title;
      track = {
        url: `${path}${newData[count].Sound?.replace(/[- ]/g, '_')}`, // Load media from the file system
        title: Titel,
        artist: 'eFlashApps',
        // Load artwork from the file system:
        artwork: `${path}${newData[count].Sound?.replace(/ /g, '_')}`,
        duration: null,
      };
      track2 = {
        url: `${path}${newData[count].ActualSound?.replace(/[- ]/g, '_')}`, // Load media from the file system
        title: Titel,
        artist: 'eFlashApps',
        // Load artwork from the file system:
        artwork: `${path}${newData[count].Sound?.replace(/ /g, '_')}`,
        duration: null,
      };
    } else if (count < 0) {
      navigation.goBack();
    } else {
      !hasPurchased ? getAdd() : null;
      navigation.dispatch(StackActions.replace('next'));
    }
    setImages(Imagess);
    setTitle({
      english: Titel,
      japanese: newData[count]?.LenguageText,
    });

    if (ActualSound && setting.ActualSound == 1 && setting.Voice == 1) {
      setMusic([track2, track]);
    } else if (ActualSound && setting.ActualSound == 1) {
      setMusic(track2);
    } else {
      setMusic(track);
    }

    if (isSetup) {
      if (ActualSound && setting.ActualSound == 1 && setting.Voice == 1) {
        await TrackPlayer.add([track2, track]);
      } else if (ActualSound && setting.ActualSound == 1) {
        await TrackPlayer.add(track2);
      } else if (setting.Voice == 1) {
        await TrackPlayer.add(track);
      }
    }
    await TrackPlayer.play();
  };

  useEffect(() => {
    if (backSound.fromDetails) {
      paly();
      disapatch({
        type: 'backSoundFromquestions/playWhenThePage',
        fromDetails: false,
        fromQuestion: false,
      });
    }
  }, [backSound.fromDetails == true]);
  const paly = async () => {
    const isSetup = await setupPlayer();
    await TrackPlayer.reset();
    await TrackPlayer.add(Music);
    if (isSetup) {
      await TrackPlayer.play();
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'grey'}}>
      <StatusBar backgroundColor={'grey'} />
      <GestureRecognizer
        style={{flex: 1}}
        onSwipeLeft={() =>
          setting.Swipe == 1 && count != data.length && setCount(count + 1)
        }
        onSwipeRight={() =>
          (setting.Swipe == 1) == 1 && count > 0 && setCount(count - 1)
        }>
        <View style={{flex: 1, backgroundColor: 'white'}}>
          <View style={styles.header}>
            <TouchableOpacity
              onPress={async () => {
                await TrackPlayer.reset();

                navigation.reset({index: 0, routes: [{name: 'home'}]});
              }}>
              <Image
                style={styles.icon}
                source={require('../../Assets4/btnhome_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View
              style={{
                alignItems: 'center',
                height: '100%',
                justifyContent: 'center',
              }}>
              <Text
                style={[
                  styles.Titel,
                  Title.english == '' ? {fontSize: wp(7)} : null,
                ]}>
                {console.log(Title)}
                {setting.English == 1 ? Title.japanese : ''}
              </Text>
              {Title.english != '' ? (
                <Text
                  style={[styles.Titel, {fontSize: wp(4), fontWeight: '500'}]}>
                  {setting.English == 1 ? Title.english : ''}
                </Text>
              ) : null}
            </View>
            <TouchableOpacity
              onPress={async () => {
                await TrackPlayer.reset();
                disapatch({
                  type: 'backSoundFromquestions/playWhenThePage',
                  fromDetails: false,
                  fromQuestion: false,
                });
                navigation.dispatch(
                  StackActions.push('setting', {pr: 'details'}),
                );
              }}>
              <Image
                style={styles.icon}
                source={require('../../Assets4/btnsetting_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.imgContainer}>
            {Images && (
              <Image
                style={{
                  height: hasPurchased ? height / 1.3 : height / 1.5,
                  width: '100%',
                  alignItems: 'center',
                }}
                resizeMode="contain"
                source={{uri: Images}}
              />
            )}
          </View>
          <View
            style={[
              styles.btnContainer,
              setting.Swipe != 1 ? {flexDirection: 'row'} : null,
              {bottom: hasPurchased ? '3%' : '1%'},
            ]}>
            {setting.Swipe == 0 && (
              <TouchableOpacity
                onPress={async () => {
                  setCount(count - 1);
                }}
                disabled={count <= 0 ? true : false}>
                <Image
                  style={[
                    styles.btn,
                    {
                      height: tablet ? hp(6) : hp(5.6),
                      width: tablet ? wp(31) : wp(35),
                    },
                  ]}
                  resizeMode="contain"
                  source={require('../../Assets4/btnprevious_normal.png')}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                paly();
              }}>
              <Image
                style={[
                  styles.btn2,
                  setting.Swipe == 1 && {alignSelf: 'center'},
                ]}
                source={require('../../Assets4/btnrepeat_normal.png')}
                resizeMode="contain"
              />
            </TouchableOpacity>
            {setting.Swipe == 0 && (
              <TouchableOpacity
                onPress={async () => {
                  setCount(count + 1);
                }}
                disabled={count === data.length ? true : false}>
                <Image
                  style={[
                    styles.btn,
                    {
                      height: tablet ? hp(6) : hp(5.6),
                      width: tablet ? wp(31) : wp(35),
                    },
                  ]}
                  source={require('../../Assets4/btnnext_normal.png')}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {!hasPurchased && (
          <View style={{bottom: 0, width: '100%', alignItems: 'center'}}>
            <BannerAd
              unitId={Addsid.BANNER}
              sizes={[BannerAdSize.ANCHORED_ADAPTIVE_BANNER]}
              requestOptions={{
                requestNonPersonalizedAdsOnly: true,
              }}
            />
          </View>
        )}
      </GestureRecognizer>
    </SafeAreaView>
  );
};

export default Detials;

const styles = StyleSheet.create({
  header: {
    height: height / 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'grey',
    paddingHorizontal: wp(2),
  },
  icon: {
    height: hp(7),
    width: hp(7),
    margin: 5,
  },
  Titel: {
    fontSize: wp(5.5),
    fontWeight: 'bold',
    color: 'white',
    alignSelf: 'center',
  },
  imgContainer: {
    height: height,
    marginTop: '1%',
  },
  btnContainer: {
    position: 'absolute',
    bottom: '2%',
    width: '98%',
    justifyContent: 'space-between',
    marginHorizontal: wp(1.5),
    alignSelf: 'center',
    alignItems: 'center',
  },
  btn: {
    height: hp(5.5),
    width: wp(35),
    margin: '1%',
  },
  btn2: {
    height: hp(6.5),
    width: hp(6.5),
    margin: '1%',
  },
});
['zaju', 'bazu', 'sazu', 'raju'];
