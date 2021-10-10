import React,  { useState, useEffect, useRef }  from 'react'
import { View, Text, StyleSheet , RefreshControl, Image} from 'react-native';
import { NativeBaseProvider, FlatList, ScrollView, Divider, Spinner  } from 'native-base';
import moment from 'moment';

// user component
import { services } from '../services/services';
import { API_KEY, endpoint, country } from '../config/config';
import d from '../data.js';


const ShowNews = ({ category }) => {
  const [newsData, setNewsData] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = (category, setReload) => {
    services(category)
			.then((data) => {
        if (setReload) {
          setRefreshing(false)
        }
        setNewsData(data);
      })
			.catch((err) => {
        if (setReload) {
          setRefreshing(false)
        }
      });
  }

  useEffect(() => {
    fetchNews(category, false);
  }, [])

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);

    fetchNews(category, true);

  }, [refreshing])

  return (
    <NativeBaseProvider>
      {
        newsData && newsData.length > 1
          ? (
            <FlatList
              data={newsData}
              renderItem={( { item } ) => (
                <View >
                  <View style={styles.newsContainer}>
                    <Image  style={styles.image}
                      resizeMode={'cover'}
                      source={{
                        uri: item?.urlToImage,
                      }}
                      alt="Alternate Text"
                    />
                    <Text style={styles.title}>
                      {item?.title}
                    </Text>
                    <Text style={styles.date}>
                      {moment(item?.publishedAt).format('LLL')}
                    </Text>
                    <Text style={styles.newsDescription}>
                      {item?.description}
                    </Text>
                  </View>
                  <Divider my={2} bg="#e0e0e0" />
                </View>
              )}
              keyExtractor={(item, i) => i.toString()}
              refreshControl={
                <RefreshControl 
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                />
              }
            />
          ) : (
            <View style={styles.spinner}>
              <Spinner color="danger.400" />
            </View>
          )
        }
    </NativeBaseProvider>
  )
}

export default ShowNews

const styles = StyleSheet.create({
  newsContainer: {
    padding: 10
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    fontWeight: "600"
  },
  newsDescription: {
    fontSize: 16,
    marginTop: 10
  },
  date: {
    fontSize: 14
  },
  spinner: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height:400
  },
  image: {
    width:550,
    height:250
  }
})