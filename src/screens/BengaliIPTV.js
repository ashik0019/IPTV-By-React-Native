import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import Header from '../components/Header';


const BengaliIPTV = ({ navigation }) => {
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const response = await axios.get('https://iptv-org.github.io/iptv/languages/ben.m3u');
        const lines = response.data.split('\n');
        const parsedChannels = [];

        for (let i = 0; i < lines.length; i++) {
          if (lines[i].startsWith('#EXTINF')) {
            const name = lines[i].split(',')[1]?.trim();
            const url = lines[i + 1]?.trim();
            if (name && url) {
              parsedChannels.push({ name, url });
            }
          }
        }

        setChannels(parsedChannels);
      } catch (error) {
        console.error('Error fetching or parsing .m3u file:', error);
      }
    };

    fetchChannels();
  }, []);


  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.channelItem}
      title="Watch TV"
      onPress={() => navigation.navigate('TVDetailsScreen', { data: item })} // Pass video details as params
    >
      <Text style={styles.channelName}>{item.name}</Text>

    </TouchableOpacity>
  );

  return (
    <View>
      <Header title="Aliens IPTV" showBackButton={false} />
      <FlatList
        data={channels}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContainer}
        ListFooterComponent={<View style={{ padding: 15 }}>
          <Text style={{ color:'red' }}>You reached on the end</Text>
        </View>}
      />
    </View>

  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 16,
  },
  channelItem: {
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
    padding: 10,
    paddingVertical: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  channelName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  channelUrl: {
    fontSize: 14,
    color: '#555',
  },
});

export default BengaliIPTV;
