import React, { useState, useEffect } from 'react';
import { Button, View, Text, FlatList, StyleSheet, PermissionsAndroid, Alert } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

const SmsReaderScreen = () => {
  const [transactions, setTransactions] = useState([]);

  const requestSmsPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_SMS,
        {
          title: 'SMS Permission',
          message: 'This app needs access to your SMS to detect M-Pesa transactions.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        }
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // useEffect to request SMS permission on mount
  useEffect(() => {
    requestSmsPermission().then(permissionGranted => {
      if (!permissionGranted) {
        Alert.alert('Permission denied', 'You need to allow SMS permissions to read M-Pesa transactions.');
      }
    });
  }, []);

  const readMpesaSms = async () => {
    console.log('Requesting SMS permission...');
    const permissionGranted = await requestSmsPermission();
    console.log('Permission granted:', permissionGranted);
    if (!permissionGranted) {
      Alert.alert('Permission denied', 'You need to allow SMS permissions to read M-Pesa transactions.');
      return;
    }

    const filter = {
      box: 'inbox',
      address: 'MPESA',
      maxCount: 10,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      (fail) => {
        console.error('Failed with error: ' + fail);
      },
      (count, smsList) => {
        const messages = JSON.parse(smsList);
        const newTransactions = messages.map(message => parseMpesaSms(message.body)).filter(Boolean);
        console.log('Parsed Transactions:', newTransactions);
        setTransactions(newTransactions);
      }
    );
  };

  const parseMpesaSms = (messageBody) => {
    const mpesaRegex = /(sent|received|paid)\sKsh([\d,]+)\sto\s([A-Za-z\s]+)/i;
    const transaction = messageBody.match(mpesaRegex);

    if (transaction) {
      return {
        type: transaction[1],
        amount: transaction[2].replace(/,/g, ''),
      };
    } else {
      console.log('No M-Pesa transaction found in the SMS.');
      return null;
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Read M-Pesa SMS" onPress={readMpesaSms} />
      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View style={styles.transactionItem}>
              <Text style={styles.transactionText}>{`Transaction Type: ${item.type}`}</Text>
              <Text style={styles.transactionText}>{`Amount: Ksh${item.amount}`}</Text>
            </View>
          )}
        />
      ) : (
        <Text style={styles.noTransactionText}>No transactions found. Please read SMS.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
  },
  transactionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  transactionText: {
    fontSize: 16,
  },
  noTransactionText: {
    marginTop: 20,
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
  },
});

export default SmsReaderScreen;
