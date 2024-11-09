import React from 'react';
import { View, Text, Button } from 'react-native';

const DetailsScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Details </Text>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

export default DetailsScreen;
