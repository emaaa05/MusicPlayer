import React, { createContext, useState, useEffect } from 'react';
import { mockSongs } from '../mock/MockSongs';
import { Text } from 'react-native';

const TrackContext = createContext();

export const TrackProvider = ({ children }) => {
  const [trackList, setTrackList] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(mockSongs['Playlist 1']?.[0] || null); 
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (mockSongs['Playlist 1']) {
      setTrackList(mockSongs['Playlist 1']);
    } else {
      console.error('Playlist not found');
      setTrackList([]);
    }
  }, []);

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const setTrackAndPlay = (track) => {
    setCurrentTrack(track); 
    setIsPlaying(true); 
  };
  

  useEffect(() => {
    if (currentTrack){
      setIsPlaying(true)
    }
  }, [currentTrack]);

  if (!trackList || trackList.length === 0) {
    return <Text>Loading songs...</Text>;
  }

  return (
    <TrackContext.Provider value={{ trackList, currentTrack, setCurrentTrack, isPlaying, togglePlayPause, setTrackAndPlay }}>
      {children}
    </TrackContext.Provider>
  );
};

export default TrackContext;
