import React, { useState } from 'react';
import LoginScreen from '../screens/LoginScreen';
import AppNavigator from './AppNavigator';

const RootNavigator = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return <AppNavigator />;
};

export default RootNavigator;
