import React, { ReactNode, useState, useEffect } from 'react';
import client, { updateClientCsrfToken } from "../utils/axios"

const UserContext = React.createContext({});

export default UserContext;

interface IUser {
    email: string,
    followers_count: number,
    following_count: number,
    known_languages: number[], 
    known_words_count: object,
    user_id: number,
    user_is_following: boolean,
    username: string
}

interface ILanguage {
    id: number,
    language_code: string,
    language_name: string
}

// Create a provider component
export const AuthProvider = ({ children }: {children: ReactNode}) => {
    const [currentUser, setCurrentUser] = useState<IUser|null>(null);
    const [knownLanguages, setKnownLanguages] = useState<ILanguage[]>([]);
    const [currentLanguage, setCurrentLanguage] = useState<ILanguage|null>(null);

    useEffect(() => {
        updateUserData();
    }, []);

    useEffect(() => {
        if(currentUser){
            getCurrentLanguage();
            getKnownLanguages();
        }
    }, [currentUser]);

    const updateUserData = () => {
        client.get("/api/users/me")
        .then(function(res) {
            setCurrentUser(res.data.user);
        })
        .catch(function(error) {
            setCurrentUser(null);
            console.log(error);
        });
    };

    const getKnownLanguages = async () => {
        return client.get("/api/users/" + currentUser.user_id + "/knownlanguages", { withCredentials: true })
        .then(function(res) {
            setKnownLanguages(res.data);
        })
        .catch(function(error) {
        });
    };

    const getCurrentLanguage = () => {
        client.get("./api/users/getcurrentlanguage")
        .then(function(res){
            setCurrentLanguage(res.data);
        }).catch(function(error){
            console.log(error);
            setCurrentLanguage(currentUser.last_current_language);
        })
    }

    const submitRegistration = (
        username: string,
        email: string,
        password: string
        ) => {

        return new Promise((resolve, reject) => {

            client.post(
            "/api/register",
            {
                username: username,
                email: email,
                password: password,
                withCredentials: true
            }
            ).then(function(res) {
                console.log('Account creation successful');
                submitLogin(username, password);
                resolve(true);
            }).catch(function(error) {
                console.log('Account creation unsuccessful');
                reject(error);
            });
        });
    };
    
    const submitLogin = (username: string, password: string) => {

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
                // Get the current user data and set the context
                updateUserData();
                console.log('Login successful!')
                resolve(true);
            }).catch(function(error) {
                setCurrentUser(null);
                console.log('Login unsuccessful');
                reject(error);
            });
        });
    };
    
    const submitLogout = () => {
        client.post(
            "/api/logout"
        ).then(function(res) {
            setCurrentUser(null);
        }).catch(
            error => console.log(error)
        );
    };

    return (
        <UserContext.Provider value={{
            currentUser,
            knownLanguages,
            currentLanguage,
            updateUserData,
            submitRegistration,
            submitLogin,
            submitLogout
            }}>
          {children}
        </UserContext.Provider>
      );
};