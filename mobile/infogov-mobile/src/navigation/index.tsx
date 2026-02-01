/**
 * Sistema de Navegação
 * 
 * Estrutura:
 * - RootNavigator: Controla navegação entre Auth e Main
 * - AuthNavigator: Stack de autenticação (Login, Register)
 * - MainNavigator: Bottom Tabs (Home, Departments, Profile, Admin)
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, View } from 'react-native';

import { useAuth } from '../contexts/AuthContext';
import { RootStackParamList, AuthStackParamList, MainTabParamList } from '../types';
import theme from '../theme';

// Importar telas (serão criadas a seguir)
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';
import DepartmentListScreen from '../screens/Departments/DepartmentListScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import AdminScreen from '../screens/Admin/AdminScreen';

const RootStack = createStackNavigator<RootStackParamList>();
const AuthStack = createStackNavigator<AuthStackParamList>();
const MainTab = createBottomTabNavigator<MainTabParamList>();

/**
 * Navegação de Autenticação
 */
function AuthNavigator() {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <AuthStack.Screen name="Login" component={LoginScreen} />
    </AuthStack.Navigator>
  );
}

/**
 * Navegação Principal com Bottom Tabs
 */
function MainNavigator() {
  const { user } = useAuth();
  const isAdmin = user?.role?.name === 'administrador';

  return (
    <MainTab.Navigator
      screenOptions={{
        tabBarActiveTintColor: theme.colors.primary.main,
        tabBarInactiveTintColor: theme.colors.gray[500],
        tabBarStyle: {
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          backgroundColor: theme.colors.background.paper,
          borderTopWidth: 1,
          borderTopColor: theme.colors.gray[200],
          ...theme.shadows.md,
        },
        tabBarLabelStyle: {
          fontSize: theme.fontSize.xs,
          fontWeight: theme.fontWeight.semibold,
        },
        headerStyle: {
          backgroundColor: theme.colors.primary.main,
          borderBottomWidth: 0,
          ...theme.shadows.md,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: theme.fontWeight.bold,
          fontSize: theme.fontSize.lg,
          letterSpacing: 0.3,
        },
        headerShadowVisible: false,
      }}
    >
      <MainTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Início',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      <MainTab.Screen
        name="Departments"
        component={DepartmentListScreen}
        options={{
          title: 'Departamentos',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="business" size={size} color={color} />
          ),
        }}
      />

      <MainTab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          title: 'Perfil',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {isAdmin && (
        <MainTab.Screen
          name="Admin"
          component={AdminScreen}
          options={{
            title: 'Administração',
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        />
      )}
    </MainTab.Navigator>
  );
}

/**
 * Navegador Raiz
 * Controla fluxo entre autenticação e app principal
 */
function RootNavigator() {
  const { signed, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.primary.main} />
      </View>
    );
  }

  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      {signed ? (
        <RootStack.Screen name="Main" component={MainNavigator} />
      ) : (
        <RootStack.Screen name="Auth" component={AuthNavigator} />
      )}
    </RootStack.Navigator>
  );
}

/**
 * Container Principal de Navegação
 */
export default function Navigation() {
  const { signed } = useAuth();
  
  // Usa 'signed' como key para forçar re-render quando o estado de autenticação mudar
  return (
    <NavigationContainer key={signed ? 'authenticated' : 'unauthenticated'}>
      <RootNavigator />
    </NavigationContainer>
  );
}
