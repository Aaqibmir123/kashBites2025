import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function Logout() {
  return (
    <View style={styles.container}>
      <Text>Logout Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
