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
        source={require("../assets/icon_tight.png")}
        style={styles.logo}
      />
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
          placeholder="Password"
          placeholderTextColor="#003f5c"
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <TouchableOpacity>
        <Text style={styles.forgot_button}>Forgot Password?</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate("RegisterScreen")}
      >
        <Text style={styles.forgot_button}>Don't have an account yet? Register</Text>
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
  logo: {
    width: 200,
    height: 53,
    marginBottom: 10
  },
  errorBox: {
    backgroundColor: constants.TERTIARYCOLOR,
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
  loginBtn: {
    width: "70%",
    borderRadius: 10,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    backgroundColor: constants.PRIMARYCOLOR,//"#FF1493",
  },
  loginText: {
    color: constants.SECONDARYCOLOR
  },
});