import {Platform} from 'react-native';
import RNFS from 'react-native-fs';

const path = Platform.select({
  android: 'asset:/files/',
  ios: RNFS.MainBundlePath + '/files/',
});
export const WrongVoid = [
  (track1 = {
    url: `${path}uhoh.mp3`,
    title: 'uhoh',
    artist: 'eFlashApps',

    artwork: `${path}uhoh.mp3`,
    duration: null,
  }),
  (track = {
    url: `${path}tryagain.mp3`,
    title: 'tryagain',
    artist: 'eFlashApps',

    artwork: `${path}tryagain.mp3`,
    duration: null,
  }),
  (track3 = {
    url: `${path}oopsie.mp3`,
    title: 'oopsie',
    artist: 'eFlashApps',

    artwork: `${path}oopsie.mp3`,
    duration: null,
  }),
  (track4 = {
    url: `${path}youcandoit.mp3`,
    title: 'youcandoit',
    artist: 'eFlashApps',

    artwork: `${path}youcandoit.mp3`,
    duration: null,
  }),
];
export const RightVOid = [
  (track1 = {
    url: `${path}excellent.mp3`,
    title: 'excellent',
    artist: 'eFlashApps',

    artwork: `${path}excellent.mp3`,
    duration: null,
  }),
  (track = {
    url: `${path}fantastic.mp3`,
    title: 'fantastic',
    artist: 'eFlashApps',

    artwork: '${path}fantastic.mp3',
    duration: null,
  }),
  (track3 = {
    url: `${path}goodanswer.mp3`,
    title: 'goodanswer',
    artist: 'eFlashApps',

    artwork: '${path}goodanswer.mp3',
    duration: null,
  }),
  (track4 = {
    url: `${path}youcandoit.mp3`,
    title: 'goodjob',
    artist: 'eFlashApps',

    duration: null,
  }),
  (track5 = {
    url: `${path}great.mp3`,
    title: 'great',
    artist: 'eFlashApps',

    artwork: `${path}great.mp3`,
    duration: null,
  }),
  (track6 = {
    url: `${path}marvelous.mp3`,
    title: 'marvelous',
    artist: 'eFlashApps',

    artwork: '${path}marvelous.mp3',
    duration: null,
  }),
  (track7 = {
    url: `${path}sensational.mp3`,
    title: 'sensational',
    artist: 'eFlashApps',

    artwork: '${path}sensational.mp3',
    duration: null,
  }),
  (track8 = {
    url: `${path}spectacular.mp3`,
    title: 'spectacular',
    artist: 'eFlashApps',

    artwork: '${path}spectacular.mp3',
    duration: null,
  }),
];
