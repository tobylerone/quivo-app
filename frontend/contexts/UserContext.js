import React, { useState, useEffect } from 'react';
import client, { updateClientCsrfToken } from "../utils/axios"

const UserContext = React.createContext();

export default UserContext;

//const [registrationToggle, setRegistrationToggle] = useState(false);

// Create a provider component
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = () => {
        client.get("/api/users/me")
        .then(function(res) {
          setCurrentUser(res.data.user);
        })
        .catch(function(error) {
          setCurrentUser(null);
        });
    };

    const submitRegistration = (username, email, password) => {

        const wasSuccessful = false;

        return new Promise((resolve, reject) => {

            client.post(
            "/api/register",
            {
                username: username,
                email: email,
                password: password
            }
            ).then(function(res) {
                console.log('Account creation successful');
                submitLogin(username, password);
            }).catch(function(e) {

                console.log('Account creation unsuccessful');
                reject(false);

            });
        });
    };
    
    const submitLogin = (username, password) => {

        return new Promise((resolve, reject) => {

            client.post(
                "/api/login",
                {
                username: username,
                password: password,
                withCredentials: true
                }
            ).then(function(res) {
                // Fetch the new CSRF token from the db and update the axios client header
                updateClientCsrfToken();
                //setCurrentUser(res.data.user);
                // Get the current user data and set the context
                getUser();
                wasSuccessful = true
                console.log('Login successful!')
                resolve(true);

            }).catch(function(e) {

                setCurrentUser(null);
                console.log('Login unsuccessful');
                reject(false);

            });
        });
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