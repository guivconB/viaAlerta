import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';

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
import { ProfileScreen } from '../screens/Profile/ProfileScreen';

import { useAuth } from '../contexts/AuthContext';
import { View, ActivityIndicator } from 'react-native';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Fadiga Zero internal stack
const FadigaZeroStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="FadigaZeroMenu" component={TestSelectionScreen} />
      <Stack.Screen name="ReflexTest" component={ReflexTestScreen} />
      <Stack.Screen name="SequenceTest" component={SequenceTestScreen} />
      <Stack.Screen name="StroopTest" component={StroopTestScreen} />
      <Stack.Screen name="History" component={HistoryScreen} />
    </Stack.Navigator>
  );
};

// Via Alerta internal stack
const ViaAlertaStack = () => {
  const { colors } = useTheme();
  return (
    <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
      <Stack.Screen name="ViaAlertaFeed" component={FeedScreen} />
      <Stack.Screen name="CreateReport" component={CreateReportScreen} />
    </Stack.Navigator>
  );
};

// Main Tab Navigator
const MainTabs = () => {
  const { colors } = useTheme();
  
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName = 'home';
          if (route.name === 'Início') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'Testes') iconName = focused ? 'flash' : 'flash-outline';
          else if (route.name === 'Mapa') iconName = focused ? 'map' : 'map-outline';
          else if (route.name === 'Perfil') iconName = focused ? 'person' : 'person-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarStyle: {
          backgroundColor: colors.card,
          borderTopColor: colors.surface,
        },
        sceneStyle: { backgroundColor: colors.background } // Applies background correctly in v7
      })}
    >
      <Tab.Screen name="Início" component={HomeScreen} />
      <Tab.Screen name="Testes" component={FadigaZeroStack} />
      <Tab.Screen name="Mapa" component={ViaAlertaStack} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export const RootNavigator = () => {
  const { token, isLoading } = useAuth();
  const { colors } = useTheme();

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background }
        }}
      >
        {token ? (
          <Stack.Screen name="MainTabs" component={MainTabs} />
        ) : (
          <>
            <Stack.Screen name="Intro" component={IntroScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
