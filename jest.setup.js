jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock'),
);

jest.mock('@react-native-community/netinfo', () =>
  require('@react-native-community/netinfo/jest/netinfo-mock'),
);

jest.mock('react-native-vision-camera', () => {
  const React = require('react');
  const { View } = require('react-native');
  const Camera = React.forwardRef((props, ref) => <View ref={ref} {...props} />);
  Camera.requestCameraPermission = jest.fn(() => Promise.resolve('granted'));
  return {
    Camera,
    useCameraDevice: jest.fn(() => ({ id: 'back', name: 'Back Camera' })),
  };
});
