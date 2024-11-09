import React from 'react';
import { View, Text, Button } from 'react-native';

export default function BillsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bills Screen</Text>
      <Button
        title="Go to Payment"
        onPress={() => navigation.navigate('Payment')}
      />
    </View>
  );
}
