/**
 * App Principal
 * InfoGov Mobile - Sistema de Informações Governamentais
 */

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from './src/contexts/AuthContext';
import Navigation from './src/navigation';

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <Navigation />
        <StatusBar style="light" />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
