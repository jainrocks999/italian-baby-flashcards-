import {Platform} from 'react-native';
import {TestIds} from 'react-native-google-mobile-ads';
export const Addsid = {
  ...Platform.select({
    android: {
      BANNER: 'ca-app-pub-3339897183017333/2488348788',
      Interstitial: 'ca-app-pub-3339897183017333/3965081989',
    },
    ios: {
      BANNER: TestIds.BANNER,
      Interstitial: TestIds.INTERSTITIAL,
    },
  }),
};
