import { StatusBar } from "expo-status-bar";
import React, { useState, useContext, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import UserContext from "../contexts/UserContext";
import * as constants from "../constants";
import client from "../utils/axios"

export default function LoginScreen({navigation}: NativeStackHeaderProps) {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { currentUser, submitLogin } = useContext(UserContext);

  useEffect(() =>{
    // Login screen (and auth stack) should only be shown when currentUser = null
    console.log("Rendering Login screen")

    console.log(client.defaults.headers)

  }, [])
  
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Image
        source={require('../assets/parrot-cool.png')}
        style={styles.parrot}
      />
      <Image
        source={require("../assets/icon_tight.png")}
        style={styles.logo}
      />
      <View style={styles.errorBox}>
        <Text style={styles.errorText}>{errorMessage}</Text>
      </View>
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Username"
          placeholderTextColor="#003f5c"
          onChangeText={(username) => setUsername(username)}
        /> 
      </View> 
      <View style={styles.inputView}>
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgotButton}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.forgotButton}>Don't have an account yet? Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.loginBtn}
        onPress={async () => {
          submitLogin(username, password).then(success => {
              setErrorMessage('');
              console.log(success);
          }).catch(success => {
              setErrorMessage('*Username or password incorrect');
              console.log(success);
          });
        }}
        >
        <Text style={styles.loginText}>LOGIN</Text> 
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
  parrot: {
    width: 100,
    height: 100
  },
  logo: {
    width: 240,
    height: 70
  },
  errorBox: {
    backgroundColor: constants.TERTIARYCOLOR,
    width: "70%",
    height: 30,
    alignItems: "center",
  },
  errorText: {
    color: constants.ERRORCOLOR
  },
  inputView: {
    backgroundColor: constants.SECONDARYCOLOR,//"#FFC0CB",
    borderRadius: 10,
    width: "70%",
    height: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontFamily: constants.FONTFAMILY
  },
  forgotButton: {
    height: 30,
    marginBottom: 10,
  },
  loginBtn: {
    //width: "70%",
    width: 150,
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: constants.PRIMARYCOLOR,//"#FF1493",
  },
  loginText: {
    color: constants.SECONDARYCOLOR
  },
});