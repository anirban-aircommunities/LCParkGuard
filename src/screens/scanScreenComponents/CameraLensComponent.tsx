import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Colors, PANTONE7546 } from '../../constants/Colors';

const CameraLensComponent = () => (
  <View style={styles.cameraIconContainer}>
    <View style={styles.frameTopLeft} />
    <View style={styles.frameTopRight} />
    <View style={styles.frameBottomLeft} />
    <View style={styles.frameBottomRight} />
    <View style={styles.cameraIconBody}>
      <View style={styles.cameraLens}>
        <View style={styles.cameraLensInner} />
      </View>
      <View style={styles.cameraFlash} />
    </View>
  </View>
);

export default CameraLensComponent;

const styles = StyleSheet.create({
  cameraIconContainer: {
    width: 120,
    height: 120,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  frameTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: PANTONE7546,
    borderTopLeftRadius: 4,
  },
  frameTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 20,
    height: 20,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: PANTONE7546,
    borderTopRightRadius: 4,
  },
  frameBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: PANTONE7546,
    borderBottomLeftRadius: 4,
  },
  frameBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: PANTONE7546,
    borderBottomRightRadius: 4,
  },
  cameraIconBody: {
    width: 70,
    height: 50,
    backgroundColor: PANTONE7546,
    borderRadius: 6,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLens: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: PANTONE7546,
    borderWidth: 3,
    borderColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraLensInner: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
  },
  cameraFlash: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: PANTONE7546,
  },
});
