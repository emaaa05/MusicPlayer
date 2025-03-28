import React, { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AudioPlayer from '../components/AudioPlayer';
import { mockSongs } from '../mock/MockSongs';
import TrackContext from '../context/Context';

export default function Player() {
  const route = useRoute();
  const navigation = useNavigation();
  const { currentTrack, setCurrentTrack, isPlaying, togglePlayPause } = useContext(TrackContext); 

  const { trackIndex = 0, trackList = mockSongs['Playlist 1']} = route.params || {};

  useEffect(() => {
  }, [route.params]);

  const validTrackIndex = Math.max(0, Math.min(trackIndex, trackList.length - 1));
  

  useEffect(() => {
  }, [trackIndex, trackList, currentTrack]);

  const handleTrackChange = (newTrackIndex) => {
    const updatedTrack = trackList[newTrackIndex];
    setCurrentTrack(updatedTrack);
    navigation.navigate('HomeScreen', {
      trackIndex: newTrackIndex,
      trackList,
    });
  };

  return (
    <View style={styles.container}>
      <AudioPlayer
        trackList={trackList}
        initialTrackIndex={validTrackIndex}
        navigation={navigation}
        currentTrack={currentTrack}
        isPlaying={isPlaying}  
        onTogglePlayPause={togglePlayPause} 
        onTrackChange={handleTrackChange}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
});
