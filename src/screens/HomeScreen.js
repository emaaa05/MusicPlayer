import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import SongList from '../components/SongList';
import { mockSongs } from '../mock/MockSongs';
import TrackContext from '../context/Context';
import Icon from 'react-native-vector-icons/FontAwesome';

export default function HomeScreen({ navigation, route }) {
  const { currentTrack, setCurrentTrack, isPlaying, togglePlayPause, setTrackAndPlay } = useContext(TrackContext);
  const [selectedPlaylist, setSelectedPlaylist] = useState('Playlist 1');

  useEffect(() => {
    console.log('Route params in HomeScreen:', route.params);
    if (route.params?.currentTrack) {
      setCurrentTrack(route.params.currentTrack);
      console.log('Current track from route params:', route.params.currentTrack);
    } else {
      console.log('No currentTrack found in route params');
    }
  }, [route.params?.currentTrack, setCurrentTrack]);

  useEffect(() => {
  }, [currentTrack, isPlaying]);

  const handleTrackSelection = (track) => {
    const localTrackList = mockSongs[selectedPlaylist];
    const trackIndex = localTrackList.findIndex((t) => t.id === track.id);
    
    setTrackAndPlay(track);
    navigation.navigate('Player', { 
      trackIndex,
      trackList: localTrackList,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.playlistSelector}>
        {Object.keys(mockSongs).map((playlist) => (
          <TouchableOpacity
            key={playlist}
            style={[styles.playlistButton, selectedPlaylist === playlist && styles.activeButton]}
            onPress={() => {
              setSelectedPlaylist(playlist);  
            }}
          >
            <Text style={styles.playlistText}>{playlist}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SongList
          navigation={navigation}
          onTrackSelect={handleTrackSelection} 
          playlist={mockSongs[selectedPlaylist]} 
        />
      </ScrollView>

      {currentTrack && currentTrack.id >= 0 ? (
        <TouchableOpacity
          key={currentTrack.id}
          style={styles.currentTrackContainer}
          onPress={() => handleTrackSelection(currentTrack)} 
        >
          <View style={styles.trackInfo}>
            <Text style={styles.trackTitle}>{currentTrack.descripcion}</Text>
            <Text style={styles.trackArtist}>{currentTrack.banda}</Text>
          </View>

          <TouchableOpacity onPress={togglePlayPause} style={styles.playPauseButton}>
            <Icon
              name={isPlaying ? 'pause' : 'play'}
              size={32}
              color="white"
            />
          </TouchableOpacity>
        </TouchableOpacity>
      ) : (
        <View style={styles.noTrackContainer}>
          <Text style={styles.noTrackText}>No track selected</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  playlistSelector: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  playlistButton: {
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    backgroundColor: '#1e1e1e',
  },
  activeButton: {
    backgroundColor: '#6200ea',
  },
  playlistText: {
    color: 'white',
    fontSize: 16,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 80,
  },
  currentTrackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 0,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#1c1c1c',
    padding: 10,
    justifyContent: 'center', 
  },
  trackInfo: {
    flexDirection: 'column',
  },
  trackTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  trackArtist: {
    color: '#b3b3b3',
    fontSize: 14,
  },
  noTrackContainer: {
    position: 'absolute',
    bottom: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    backgroundColor: '#1c1c1c',
    padding: 10,
    justifyContent: 'space-between'
  },
  noTrackText: {
    color: 'white',
    fontSize: 16,
  },
  playPauseButton: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#1DB954', 
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 15, 
    borderWidth: 2,
    borderColor: '#1DB954', 
  },
});
