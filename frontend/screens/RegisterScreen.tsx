import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableOpacity,
} from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack"
import UserContext from '../contexts/UserContext';
import * as constants from '../constants'

export default function RegisterScreen({navigation}: NativeStackHeaderProps) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { submitRegistration } = useContext(UserContext);

  return (
  <View style={styles.container}>
    <StatusBar style="auto" />
    <View style={styles.errorBox}>
      <Text style={styles.errorText}>{errorMessage}</Text>
    </View>
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Username"
        placeholderTextColor="#003f5c"
        onChangeText={(username) => setUsername(username)}
      /> 
    </View>
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Email"
        placeholderTextColor="#003f5c"
        onChangeText={(email) => setEmail(email)}
      /> 
    </View> 
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Password"
        placeholderTextColor="#003f5c"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
      />
    </View>
    <View style={styles.inputView}>
      <TextInput
        style={styles.TextInput}
        placeholder="Re-type password"
        placeholderTextColor="#003f5c"
        secureTextEntry={true}
        onChangeText={() => {}}
      />
    </View>
    <TouchableOpacity
      onPress={() => navigation.navigate("LoginScreen")}
    >
      <Text style={styles.forgot_button}>Already have an account? Login</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={styles.registerBtn}
      onPress={async () => {
        const success = await submitRegistration(username, password);
        setErrorMessage('');
        if (!success) {
          //setErrorMessage('*Username or password incorrect')
        }
      }}
      >
      <Text style={styles.registerText}>Register</Text> 
    </TouchableOpacity> 
  </View> 
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    marginBottom: 40,
  },
  errorBox: {
    backgroundColor: constants.SECONDARYCOLOR,//"#FFC0CB",
    width: "70%",
    height: 30,
    marginBottom: 0,
    alignItems: "center",
  },
  errorText: {
    color: constants.ERRORCOLOR
  },
  inputView: {
    backgroundColor: constants.SECONDARYCOLOR,//"#FFC0CB",
    borderRadius: 10,
    borderWidth: 2,
    borderColor: constants.PRIMARYCOLOR,
    width: "70%",
    height: 45,
    marginBottom: 20,
    alignItems: "center",
  },
  TextInput: {
    height: 50,
    flex: 1,
    padding: 10,
    marginLeft: 20,
  },
  forgot_button: {
    height: 30,
    marginBottom: 30,
  },
  registerBtn: {
    width: "70%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: constants.PRIMARYCOLOR,//"#FF1493",
  },
  registerText: {
    color: constants.SECONDARYCOLOR
  },
});