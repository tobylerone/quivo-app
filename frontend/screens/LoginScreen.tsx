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
// Contexts
import UserContext from "../contexts/UserContext";
// Constants
import * as constants from "../constants";
// Utils
import client from "../utils/axios"
// Components
import RaisedButton from "../components/RaisedButton";

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

  const handlePress = async () => {
    submitLogin(username, password).then(success => {
        setErrorMessage('');
        console.log(success);
    }).catch(success => {
        setErrorMessage('*Username or password incorrect');
        console.log(success);
    });
  }
  
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
        <Text style={styles.registerButton}>Don't have an account yet? Register</Text>
      </TouchableOpacity>
      <View style={styles.loginButtonContainer}>
        <RaisedButton
          onPress={() => handlePress()}
          options={{
            ...RaisedButton.defaultProps.options,
            width: 150,
            height: 50,
            borderWidth: 3,
            borderColor: constants.PRIMARYCOLOR,
            backgroundColor: constants.PRIMARYCOLOR,
            shadowColor: constants.PRIMARYCOLORSHADOW
          }}
            >
              <Text style={styles.loginText}>Login</Text> 
            </RaisedButton>
        </View>
    </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
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
    width: "70%",
    height: 30,
    alignItems: "center",
  },
  errorText: {
    color: constants.ERRORCOLOR
  },
  inputView: {
    backgroundColor: constants.SECONDARYCOLOR,
    borderRadius: 10,
    width: "70%",
    height: 50,
    marginBottom: 20,
    alignItems: "center",
  },
  textInput: {
    marginTop: 'auto',
    marginBottom: 'auto',
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.BLACK
  },
  forgotButton: {
    height: 30,
    marginBottom: 10,
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.BLACK
  },
  registerButton: {
    height: 30,
    marginBottom: 30,
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.BLACK
  },
  loginButtonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  loginText: {
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.SECONDARYCOLOR,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  },
});