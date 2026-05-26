import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colors } from '../theme/colors';

// Import Screens
import { IntroScreen } from '../screens/IntroScreen';
import { LoginScreen } from '../screens/Auth/LoginScreen';
import { RegisterScreen } from '../screens/Auth/RegisterScreen';
import { ForgotPasswordScreen } from '../screens/Auth/ForgotPasswordScreen';
import { HomeScreen } from '../screens/Home/HomeScreen';
import { TestSelectionScreen } from '../screens/FadigaZero/TestSelectionScreen';
import { ReflexTestScreen } from '../screens/FadigaZero/ReflexTestScreen';
import { SequenceTestScreen } from '../screens/FadigaZero/SequenceTestScreen';
import { StroopTestScreen } from '../screens/FadigaZero/StroopTestScreen';
import { HistoryScreen } from '../screens/FadigaZero/HistoryScreen';
import { FeedScreen } from '../screens/ViaAlerta/FeedScreen';
import { CreateReportScreen } from '../screens/ViaAlerta/CreateReportScreen';

const Stack = createNativeStackNavigator();

export const RootNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Intro"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        <Stack.Screen name="Intro" component={IntroScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FadigaZero" component={TestSelectionScreen} />
        <Stack.Screen name="ReflexTest" component={ReflexTestScreen} />
        <Stack.Screen name="SequenceTest" component={SequenceTestScreen} />
        <Stack.Screen name="StroopTest" component={StroopTestScreen} />
        <Stack.Screen name="History" component={HistoryScreen} />
        <Stack.Screen name="ViaAlerta" component={FeedScreen} />
        <Stack.Screen name="CreateReport" component={CreateReportScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
