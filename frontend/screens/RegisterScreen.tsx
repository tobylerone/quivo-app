import { StatusBar } from "expo-status-bar";
import React, { useState, useContext } from "react";
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
// Components
import RaisedButton from "../components/RaisedButton";

export default function RegisterScreen({navigation}: NativeStackHeaderProps) {

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [secondPassword, setSecondPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { submitRegistration } = useContext(UserContext);

  const handlePress = async () => {
        
    //verifier que le mot de passe est correct
    if(password!=secondPassword){
        setErrorMessage('Passwords don\'t match');
        return;
    };

    // TODO: Verifier que l'utilisateur n'existe pas
    const success = await submitRegistration(username, email, password);

    if (!success) {
        //Il faut donner des indices a l'utilisateur
        setErrorMessage('Registration failed. Try against later')
    }
  }

  return (
  <View style={styles.container}>
    <StatusBar style="auto" />
    <Image
        source={require('../assets/parrot-nerd.png')}
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
        placeholder="Email"
        placeholderTextColor="#003f5c"
        onChangeText={(email) => setEmail(email)}
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
    <View style={styles.inputView}>
      <TextInput
        style={styles.textInput}
        placeholder="Re-type password"
        placeholderTextColor="#003f5c"
        secureTextEntry={true}
        onChangeText={(password) => setSecondPassword(password)}
      />
    </View>
    <TouchableOpacity
      onPress={() => navigation.navigate("LoginScreen")}
    >
      <Text style={styles.forgotButton}>Already have an account? Login</Text>
    </TouchableOpacity>
    <View style={styles.registerButtonContainer}>
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
            <Text style={styles.registerText}>Register</Text> 
          </RaisedButton>
      </View>
  </View> 
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: constants.TERTIARYCOLOR
  },
  image: {
    marginBottom: 40,
  },
  parrot: {
    width: 140,
    height: 140
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
    backgroundColor: constants.PRIMARYCOLORLIGHT,
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
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.BLACK,
    height: 30,
    marginBottom: 30,
  },
  registerButtonContainer: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  registerText: {
    fontSize: constants.H3FONTSIZE,
    fontFamily: constants.FONTFAMILY,
    color: constants.SECONDARYCOLOR,
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: 'auto',
    marginBottom: 'auto'
  }
});