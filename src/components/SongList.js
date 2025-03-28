import React, { useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import TrackContext from '../context/Context'; 

export default function SongList({ playlist, navigation }) {
  const { setTrackAndPlay } = useContext(TrackContext); 

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={playlist}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
        <TouchableOpacity 
          style={styles.songItem} 
          onPress={() => {
            setTrackAndPlay(item); 
            navigation.navigate('Player', { 
              trackIndex: index, 
              trackList: playlist,
            });
          }}
        >

            <Image source={item.img} style={styles.albumArt} />
            <View style={styles.songInfo}>
              <Text style={styles.songTitle}>{item.descripcion}</Text>
              <Text style={styles.songArtist}>{item.banda}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
    padding: 20,
    paddingTop: 5, 
  },
  songItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    marginBottom: 10,
  },
  albumArt: {
    width: 50,
    height: 50,
    borderRadius: 5,
    marginRight: 15,
  },
  songInfo: {
    flex: 1,
  },
  songTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  songArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
});
