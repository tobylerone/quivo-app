import { StatusBar } from 'expo-status-bar';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity
} from 'react-native';
import Navigation from './navigation/index';
import useCachedResources from "./hooks/useCashedResources"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as constants from "./constants"

//import LoginScreen from "./screens/LoginScreen";

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: constants.HOST_ADDRESS + ":8000"
  //baseURL: "http://127.0.0.1:8000"
  //baseURL: process.env.REACT_APP_BASE_URL
});

export default function App() {
  const isLoaded= useCachedResources()

  const [currentUser, setCurrentUser] = useState(false);
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    client.get("/api/user")
    .then(function(res) {
      setCurrentUser(true);
    })
    .catch(function(error) {
      setCurrentUser(false);
    });
  }, []);

  /*function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("form_btn").innerHTML = "Register";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form_btn").innerHTML = "Log in";
      setRegistrationToggle(true);
    }
  }*/

  function submitRegistration(e) {
    //e.preventDefault();
    client.post(
      "/api/register",
      {
        email: email,
        username: username,
        password: password
      }
    ).then(function(res) {
      client.post(
        "/api/login",
        {
          email: email,
          password: password
        }
      ).then(function(res) {
        setCurrentUser(true);
      }).catch(
        error => console.log(error.response.data)
        );
    });
  }

  function submitLogin() {
    //e.preventDefault();
    client.post(
      "/api/login",
      {
        username: username,
        password: password
      }
    ).then(function(res) {
      setCurrentUser(true);
    }).catch(
      error => console.log(error)
      );
  }

  function submitLogout(e) {
    //e.preventDefault();
    client.post(
      "/api/logout",
      {withCredentials: true}
    ).then(function(res) {
      setCurrentUser(false);
    }).catch(
      error => console.log(error)
      );
  }


  if (isLoaded){
    if (currentUser) {
      return (
        <>
          <Navigation/>
          <StatusBar style="auto" />
        </>
      );
    } else {
      return (
        <View style={styles.container}>
          <StatusBar style="auto" />
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
            style={styles.loginBtn}
            onPress={() => submitLogin()}
            >
            <Text style={styles.loginText}>LOGIN</Text> 
          </TouchableOpacity> 
        </View> 
      );
    }
  } else {
    return null
  }

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
  inputView: {
    backgroundColor: "#FFC0CB",
    borderRadius: 30,
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
  loginText: {

  },
  loginBtn: {
    width: "80%",
    borderRadius: 25,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    backgroundColor: "#FF1493",
  },
});