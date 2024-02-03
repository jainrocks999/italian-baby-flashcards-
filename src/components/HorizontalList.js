import React from 'react';
import {View, Text, FlatList, Linking} from 'react-native';
import Card from './Card';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {addData} from '../reduxToolkit/Slice';
import {addCatNext} from '../reduxToolkit/Slice7';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
var SQLite = require('react-native-sqlite-storage');
const db = SQLite.openDatabase({
  name: 'eFlashItalian.db',
  createFromLocation: 1,
});
const HorizontalList = ({items}) => {
  const disapatch = useDispatch();
  const data = useSelector(state => state.Items);
  const getData = (cat, id) => {
    disapatch({
      type: 'backSoundFromquestions/playWhenThePage',
      fromDetails: false,
      fromQuestion: false,
    });
    if (cat != 'link' && cat != 'link2') {
      db.transaction(tx => {
        tx.executeSql(
          'SELECT * FROM tbl_items WHERE Category=? ',
          [cat],
          (tx, results) => {
            console.log(' item query Query completed');
            let arr = [];
            var len = results.rows.length;
            for (let i = 0; i < len; i++) {
              let row = results.rows.item(i);
              arr.push(row);
            }
            disapatch(addData(arr));
            console.log(arr);
            disapatch(addCatNext({items, id: parseInt(id) + 1}));
            navigation.navigate(wr == 1 ? 'question' : 'details', {
              page: true,
            });
          },
          err => {
            console.log(err);
          },
        );
      });
    } else {
      Linking.openURL(
        cat == 'link'
          ? 'https://babyflashcards.com/apps.html'
          : 'https://play.google.com/store/apps/details?id=com.eFlashItalian',
      );
    }
  };

  const goTo = cat => {
    console.log(data);
  };
  const wr = useSelector(state => state.question);
  const navigation = useNavigation();
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        marginLeft: '2%',
      }}>
      <FlatList
        scrollEnabled={true}
        numColumns={2}
        data={items}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          return (
            <Card
              onPress={() => {
                getData(item.Category, item?.id);
              }}
              item={item}
            />
          );
        }}
      />
    </View>
  );
};

export default HorizontalList;
