import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, LogBox, Text, TouchableOpacity } from 'react-native';
import { initializeDatabase } from '@/lib/db';

LogBox.ignoreAllLogs();

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <View style={{flex:1,justifyContent:'center',alignItems:'center',padding:20}}>
          <Text style={{fontSize:18,fontWeight:'bold',marginBottom:10}}>Something went wrong</Text>
          <TouchableOpacity 
            onPress={() => this.setState({hasError:false})} 
            style={{backgroundColor:'#feee00',paddingHorizontal:24,paddingVertical:12,borderRadius:8}}
          >
            <Text style={{color:'black',fontWeight:'600'}}>Try Again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

export default function RootLayout() {
  const [dbReady, setDbReady] = useState(false);

  useEffect(() => {
    initializeDatabase().then(() => setDbReady(true)).catch(console.error);
  }, []);

  if (!dbReady) {
    return (
      <View style={{flex:1,justifyContent:'center',alignItems:'center',backgroundColor:'#feee00'}}>
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
      </Stack>
      <StatusBar style="dark" />
    </ErrorBoundary>
  );
}
