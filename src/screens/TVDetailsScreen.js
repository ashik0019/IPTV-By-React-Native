import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Alert,
    TouchableOpacity,
    StatusBar,
    Animated,
} from 'react-native';
import Video from 'react-native-video';
import Orientation from 'react-native-orientation-locker';
import Header from '../components/Header';
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-8474570703108117/8154863827';
const { width, height } = Dimensions.get('window');

const TVDetailsScreen = ({ route }) => {
    const { data } = route.params || {}; // Live TV data
    const player = useRef(null); // Video reference
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isOverlayVisible, setIsOverlayVisible] = useState(true);
    const [isPlaying, setIsPlaying] = useState(true);
    const fadeAnim = useRef(new Animated.Value(1)).current; // Animation for overlay
    const overlayTimer = useRef(null); // Timer reference for hiding overlay
    const bannerRef = useRef(null);


    if (!data) {
        Alert.alert('Error', 'Required data is missing.');
        return null;
    }

    // Handle Full-Screen Mode
    const handleFullScreen = () => {
        if (isFullScreen) {
            Orientation.unlockAllOrientations();
            setIsFullScreen(false);
        } else {
            Orientation.lockToLandscape();
            setIsFullScreen(true);
        }
    };

    // Handle Play/Pause
    const togglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    // Toggle Overlay with Timer Reset
    const fadeOverlay = () => {
        resetOverlayTimer(); // Reset the timer on interaction
        Animated.timing(fadeAnim, {
            toValue: isOverlayVisible ? 0 : 1,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsOverlayVisible((prev) => !prev);
        });
    };

    // Reset Overlay Timer
    const resetOverlayTimer = () => {
        if (overlayTimer.current) {
            clearTimeout(overlayTimer.current);
        }
        overlayTimer.current = setTimeout(() => {
            hideOverlay();
        }, 2500); // 20 seconds
    };

    // Hide Overlay
    const hideOverlay = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsOverlayVisible(false);
        });
    };

    // Handle Video Errors
    const handleVideoError = (error) => {
        Alert.alert('Video Error', 'There was an issue playing the video. Please try again later.');
        console.error(error);
    };

    // Initialize the timer when the component mounts
    useEffect(() => {
        resetOverlayTimer(); // Start the timer when the component is loaded

        return () => {
            if (overlayTimer.current) {
                clearTimeout(overlayTimer.current); // Clean up timer on unmount
            }
        };
    }, []);

    return (
        <View style={[styles.container, isFullScreen && styles.fullScreenContainer]}>
            <StatusBar hidden={isFullScreen} />

            {/* Header */}
            {!isFullScreen && <Header title="Aliens IPTV" showBackButton={true} />}
            {!isFullScreen && <BannerAd ref={bannerRef}
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true
                }}
            />}

            {/* Title */}
            {!isFullScreen && <Text style={styles.title}>{data?.name}</Text>}

            {/* Video Player */}
            <View
                style={[
                    styles.videoContainer,
                    isFullScreen && styles.fullScreenVideo,
                ]}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    style={styles.videoTouchableArea}
                    onPress={fadeOverlay}
                >
                    <Video
                        source={{ uri: data?.url }}
                        ref={player}
                        style={styles.video}
                        paused={!isPlaying}
                        controls={false} // Custom controls
                        resizeMode="contain"
                        onError={handleVideoError}
                        controlsStyles={{
                            liveLabel: "LIVE"
                        }}
                    />
                    {/* Custom Overlay */}
                    {isOverlayVisible && (
                        <Animated.View
                            style={[styles.overlay, { opacity: fadeAnim }]}
                        >
                            {/* Play/Pause Button */}
                            <TouchableOpacity
                                onPress={togglePlayPause}
                                style={styles.iconButton}
                            >
                                <Text style={styles.iconText}>
                                    {isPlaying ? '⏸️' : '▶️'}
                                </Text>
                            </TouchableOpacity>

                            {/* Fullscreen Button */}
                            <TouchableOpacity
                                onPress={handleFullScreen}
                                style={styles.iconButton}
                            >
                                <Text style={styles.iconText}>
                                    {isFullScreen ? '🔙' : '🔲'}
                                </Text>
                            </TouchableOpacity>
                        </Animated.View>
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    fullScreenContainer: {
        backgroundColor: '#000',
    },
    videoContainer: {
        width: width,
        height: height * 0.6, // 60% of the screen height
        backgroundColor: '#000',
    },
    fullScreenVideo: {
        width: '100%',
        height: '100%',
    },
    video: {
        flex: 1,
    },
    videoTouchableArea: {
        flex: 1,
    },
    title: {
        fontSize: 16,
        color: '#fff',
        fontWeight: 'bold',
        marginVertical: 10,
        textAlign: 'center',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent overlay
    },
    iconButton: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: 'rgba(0, 0, 0, 0.01)',
        borderRadius: 5,
    },
    iconText: {
        fontSize: 30,
        color: '#fff',
        textAlign: 'center',
    },
});

export default TVDetailsScreen;
