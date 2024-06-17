import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import { DataContextProvider } from './Data/DataContext';
import AllScreen from './screens/AllScreen';

export const App = () => {
 

  return (
    <DataContextProvider>
     <AllScreen/>
    </DataContextProvider>
  );
};

export default App;
