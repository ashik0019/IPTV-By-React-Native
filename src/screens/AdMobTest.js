import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState, useRef, useEffect } from 'react';
import { AdEventType, BannerAd, BannerAdSize, InterstitialAd, RewardedAd, RewardedAdEventType, TestIds, useForeground } from 'react-native-google-mobile-ads';

const adUnitId = __DEV__ ? TestIds.ADAPTIVE_BANNER : 'ca-app-pub-8474570703108117/8154863827';
const adUnitId2 = __DEV__ ? TestIds.INTERSTITIAL : 'ca-app-pub-8474570703108117/1266021846';
const adUnitId3 = __DEV__ ? TestIds.REWARDED : 'ca-app-pub-8474570703108117/3437723761';

const interstitial = InterstitialAd.createForAdRequest(adUnitId2, {
    keywords: ['fashion', 'clothing'],
});




const rewarded = RewardedAd.createForAdRequest(adUnitId3, {
  keywords: ['fashion', 'clothing'],
});


const AdMobTest = ({navigation}) => {
    const bannerRef = useRef(null);
    const [loaded, setLoaded] = useState(false);
    const [loaded2, setLoaded2] = useState(false);

    // useEffect(() => {
    //     const unsubscribe = interstitial.addAdEventListener(AdEventType.LOADED, () => {
    //         setLoaded(true);
    //     });

    //     // Start loading the interstitial straight away
    //     interstitial.load();

    //     // Unsubscribe from events on unmount
    //     return unsubscribe;
    // }, []);

    // // No advert ready to show yet
    // if (!loaded) {
    //     return null;
    // }

    useEffect(() => {
        const unsubscribeLoaded = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
          setLoaded2(true);
        });
        const unsubscribeEarned = rewarded.addAdEventListener(
          RewardedAdEventType.EARNED_REWARD,
          reward => {
            console.log('User earned reward of ', reward);
            navigation.navigate('BengaliIPTV')
          },
        );
    
        // Start loading the rewarded ad straight away
        rewarded.load();
    
        // Unsubscribe from events on unmount
        return () => {
          unsubscribeLoaded();
          unsubscribeEarned();
        };
      }, []);
    
      // No advert ready to show yet
      if (!loaded2) {
        return null;
      }




    return (
        <View style={styles.container}>
            <BannerAd ref={bannerRef}
                unitId={adUnitId}
                size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
                requestOptions={{
                    requestNonPersonalizedAdsOnly: true
                }}
            />
            <View style={styles.headerView}>
                <Text style={styles.headerText}>AdMobTest</Text>
            </View>
            <TouchableOpacity 
            onPress={() => {
                interstitial.show();
              }}
            style={styles.adClickerView}>
                <Text>Show Interstitial Ad</Text>
            </TouchableOpacity>

            <TouchableOpacity 
            onPress={() => {
                rewarded.show();
              }}
            style={styles.adClickerView}>
                <Text>Show Rewarded Ad</Text>
            </TouchableOpacity>
        </View>
    )
}

export default AdMobTest

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerView: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ddd',
        height: 55,
        marginVertical: 15,
        marginHorizontal: 20
    },
    headerText: {
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 20
    },
    adClickerView: {
        width: "43%",
        height: 40,
        alignSelf: 'center',
        marginTop: '20%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#dedede',
        backgroundColor: '#dedede',
        borderRadius: 10,
    }
})