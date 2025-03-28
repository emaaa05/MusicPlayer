import React, { useState, useEffect, useContext } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ImageBackground } from 'react-native';
import { Audio } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import TrackContext from '../context/Context';  

export default function AudioPlayer({ navigation, trackList, initialTrackIndex = 0, isPlaying, onTogglePlayPause }) {
  const { setCurrentTrack } = useContext(TrackContext); 
  const [selectedTrackIndex, setSelectedTrackIndex] = useState(initialTrackIndex);
  const [sound, setSound] = useState(null);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isRandom, setIsRandom] = useState(false); 
  const currentTrack = trackList[selectedTrackIndex];
  
  useEffect(() => {
    setSelectedTrackIndex(initialTrackIndex);
  }, [initialTrackIndex]);

  useEffect(() => {
    const playNewTrack = async () => {
      if (!currentTrack) return;
  
      await stopSound();
  
      const { sound: newSound } = await Audio.Sound.createAsync(
        currentTrack.cancion,
        { shouldPlay: isPlaying }
      );
  
      newSound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded) {
          setPosition(status.positionMillis);
          setDuration(status.durationMillis || 1);
          setIsLoading(false);
        }
      });
  
      setSound(newSound);
    };
  
    playNewTrack();
  }, [currentTrack]);

  const stopSound = async () => {
    if (sound) {
      try {
        await sound.stopAsync();
        await sound.unloadAsync();
      } catch (error) {
        console.error("Error stopping the sound:", error);
      } finally {
        setSound(null);
      }
    }
  };

  const changeTrack = (newIndex) => {
    if (newIndex < 0) newIndex = trackList.length - 1;
    if (newIndex >= trackList.length) newIndex = 0;
    setSelectedTrackIndex(newIndex);  
    setCurrentTrack(trackList[newIndex]);
  };

  const handlePlayPause = async () => {
    if (!sound) {
      changeTrack(selectedTrackIndex);
      return;
    }
  
    try {
      if (isPlaying) {
        await sound.pauseAsync();
      } else {
        await sound.playAsync();
      }
      onTogglePlayPause();
    } catch (error) {
      console.error("Error handling play/pause:", error);
    }
  };
  
  const handleNextTrack = async () => {
    let nextIndex;
    if (isRandom) {
      if (trackList.length > 1) {
        do {
          nextIndex = Math.floor(Math.random() * trackList.length);
        } while (nextIndex === selectedTrackIndex);
      } else {
        nextIndex = 0;
      }
    } else {
      nextIndex = selectedTrackIndex + 1;
      if (nextIndex >= trackList.length) nextIndex = 0;
    }
    changeTrack(nextIndex);
  };
  
  const handlePreviousTrack = async () => {
    let prevIndex = selectedTrackIndex - 1;
    if (prevIndex < 0) prevIndex = trackList.length - 1;
    changeTrack(prevIndex);
  };
  

  const toggleRandom = () => setIsRandom((prev) => !prev);

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  useEffect(() => {
    if (!sound) return;
    const controlPlayback = async () => {
      try {
        if (isPlaying) {
          await sound.playAsync();
        } else {
          await sound.pauseAsync();
        }
      } catch (error) {
        console.error("Playback error: ", error);
      }
    };
    controlPlayback();
  }, [isPlaying, sound]);

  const formatTime = (millis) => {
    const minutes = Math.floor(millis / 60000);
    const seconds = ((millis % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds.padStart(2, '0')}`;
  };

  return (
    <ImageBackground source={currentTrack.img} style={styles.background}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="white" />
      </TouchableOpacity>

      <View style={styles.bottomContainer}>
        <Text style={styles.trackText}>{currentTrack.descripcion} - {currentTrack.banda}</Text>
        
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={duration}
          value={position}
          minimumTrackTintColor="#1DB954"
          maximumTrackTintColor="#ffffff"
          thumbTintColor="#1DB954"
          onSlidingComplete={async (value) => {
            if (sound) await sound.setPositionAsync(value);
          }}
        />

        <View style={styles.timeContainer}>
          <Text style={styles.timeText}>{formatTime(position)}</Text>
          <Text style={styles.timeText}>{formatTime(duration)}</Text>
        </View>

        <View style={styles.controls}>
          <TouchableOpacity onPress={handlePreviousTrack}>
            <Ionicons name="play-skip-back" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePlayPause}>
            <Ionicons name={isPlaying ? "pause" : "play"} size={50} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={handleNextTrack}>
            <Ionicons name="play-skip-forward" size={40} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleRandom} style={[styles.randomButton, isRandom && styles.randomButtonActive]}>
            <Ionicons name="shuffle" size={40} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 50,
  },
  bottomContainer: {
    alignItems: 'center',
    width: '100%',
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  trackText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  slider: {
    width: '80%',
    marginTop: 20,
  },
  timeContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  timeText: {
    color: 'white',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '60%',
  },
  randomButton: {
    padding: 10,
    borderRadius: 50,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  randomButtonActive: {
    backgroundColor: '#1DB954',
  },
});