// src/screens/AddBillScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

const AddBillScreen = ({ navigation }) => {
  const [amount, setAmount] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleAddBill = () => {
    if (!amount || !dueDate) {
      Alert.alert('Please fill in all fields');
      return;
    }
    // Here you can add functionality to save the bill
    console.log(`Bill added: ${amount} due on ${dueDate}`);
    navigation.goBack(); // Navigate back after adding
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Bill Amount"
        keyboardType="numeric"
        value={amount}
        onChangeText={setAmount}
        style={styles.input}
      />
      <TextInput
        placeholder="Due Date (YYYY-MM-DD)"
        value={dueDate}
        onChangeText={setDueDate}
        style={styles.input}
      />
      <Button title="Add Bill" onPress={handleAddBill} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    padding: 10,
  },
});

export default AddBillScreen;
