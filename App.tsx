import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

function App() {
  return (
    <View>
      <Text style={styles.test}>Test</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  test: {
    color: 'white',
  },
});

export default App;
