import React, { useState, useEffect } from 'react';
import client from "../utils/axios"

const UserContext = React.createContext();

export default UserContext;

//const [registrationToggle, setRegistrationToggle] = useState(false);

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        client.get("/api/users/me")
        .then(function(res) {
          setCurrentUser(res.data.user);
        })
        .catch(function(error) {
          setCurrentUser(null);
        });
    }, []);

    const submitRegistration = (username, email, password) => {

        const wasSuccessful = false;

        //e.preventDefault();
        client.post(
          "/api/register",
          {
            username: username,
            email: email,
            password: password
          }
        ).then(function(res) {
          client.post(
            "/api/login",
            {
              username: username,
              password: password
            }
          ).then(function(res) {
            setCurrentUser(res.data.user);
            wasSuccessful = true
          }).catch(function(e) {
            setCurrentUser(null);
            // Ecrire un message a l'ecran
            console.log(e.response.data)
          });
        });

        return wasSuccessful;
    };
    
    const submitLogin = (username, password) => {
        
        const wasSuccessful = false

        client.post(
            "/api/login",
            {
            username: username,
            password: password,
            withCredentials: true
            }
        ).then(function(res) {
            setCurrentUser(res.data.user);
            wasSuccessful = true
        }).catch(function(e) {
            setCurrentUser(null);
            console.log(e.response.data)
        });

        return wasSuccessful
    };
    
    const submitLogout = (e) => {
        client.post(
            "/api/logout"
        ).then(function(res) {
            setCurrentUser(null);
        }).catch(
            error => console.log(error)
            );
    };

    return (
        <UserContext.Provider value={{ currentUser, submitRegistration, submitLogin, submitLogout }}>
          {children}
        </UserContext.Provider>
      );
};