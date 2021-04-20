import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import AddEntry from './components/AddEntry'


export default function App() {
  return (
    <>
      <View style={styles.container}>
        <Text>Hello android world!!!</Text>
        <AntDesign name="camera" size={24} style={{ fontSize: '40px', color: 'red' }} />
      </View>
      <View style={styles.container}>
        <AddEntry />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
