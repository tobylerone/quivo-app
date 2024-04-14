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
export const AuthProvider = ({ children }: {children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<IUser|null>(null);
    const [knownLanguages, setKnownLanguages] = useState<ILanguage[]>([]);
    // TODO: This should be stored in the database for each user
    const [knownWordsPercentage, setKnownWordsPercentage] = useState<(20|30|40|50|60|70|80)>(50);
    const [knownWords, setKnownWords] = useState<number>(0);
    const [soundActive, setSoundActive] = useState<boolean>(true); // TODO: Link this to the user account on the backend
    const [wordCounts, setWordCounts] = useState<Record<string, number>>({});
    const [monthlyWordCounts, setMonthlyWordCounts] = useState<number[]>(null);
    const [dailyWordCount, setDailyWordCount] = useState<number>(0);
    const [streakLimitReached, setStreakLimitReached] = useState<boolean>(false);
    const [userStreak, setUserStreak] = useState<number>(0);
    const [currentLanguageCode, setCurrentLanguageCode] = useState<string|null>(null);
    const [userAvatarId, setUserAvatarId] = useState<number|null>(null);    

    useEffect(() => {
        updateUserData();
    }, []);

    useEffect(() => {
        if(currentUser){
            getCurrentLanguageCode();
            getKnownLanguages();
            setUserStreak(currentUser.streak);
            setUserAvatarId(currentUser.avatar_id);
        }
    }, [currentUser]);

    useEffect(() => {
        // Probably don't need to do this check every time
        if (dailyWordCount >= 10) {
            if(!streakLimitReached) setStreakLimitReached(true);
        } else {
            setStreakLimitReached(false);
        }
    }, [dailyWordCount]);

    useEffect(() => {
        if (currentUser && currentLanguageCode) {
            setKnownWords(currentUser.known_words_count[currentLanguageCode]);
            getWordCounts();
            updateMonthlyWordCounts(currentUser.user_id, currentLanguageCode);
        }
    }, [currentLanguageCode]);

    const updateUserData = () => {
        client.get('/api/users/me')
        .then(function(res) {
            setCurrentUser(res.data.user);
        })
        .catch(function(error) {
            setCurrentUser(null);
            console.log(error);
        });
    };

    const updateMonthlyWordCounts = (userId: number, languageCode: string) => {
        client.get('./api/users/' + userId + '/monthlywordcounts/' + languageCode)
        .then((res) => {
            setMonthlyWordCounts(res.data);
            setDailyWordCount(res.data[res.data.length - 1].word_count);
        }).catch((error) => {
            console.log(error);
        });
    }

    const updateCurrentLanguageCode = (language_code: string) => {
        client.post('api/users/changecurrentlanguage', {
            language_code: language_code,
            withCredentials: true
        }).then((res) => {
            // Only update the hook if language session data changed
            // Probably don't need two api requests here. Could just
            // return current language data from changecurrentlanguage
            // endpoint
            getCurrentLanguageCode()
        }).catch((error) => {
            console.log(error);
        });
    }

    const getKnownLanguages = async () => {
        return client.get("/api/users/" + currentUser.user_id + "/knownlanguages", { withCredentials: true })
        .then(function(res) {
            setKnownLanguages(res.data);
        })
        .catch(function(error) {
        });
    };

    const getCurrentLanguageCode = () => {
        client.get("./api/users/currentlanguage")
        .then(function(res){
            setCurrentLanguageCode(res.data);
        }).catch(function(error){
            console.log(error);
            setCurrentLanguageCode(currentUser.last_current_language);
        })
    }

    const getWordCounts = async() => {
        try {
            const res = await client.get(
                './api/users/' + currentUser.user_id + '/wordcounts',
                { withCredentials: true }
                );
            setWordCounts(res.data);
        } catch (error) {
            console.error(error);
        }
    };

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
            knownWordsPercentage,
            currentLanguageCode,
            userAvatarId,
            knownWords,
            soundActive,
            wordCounts,
            monthlyWordCounts,
            dailyWordCount,
            userStreak,
            streakLimitReached,
            updateCurrentLanguageCode,
            updateUserData,
            setKnownWordsPercentage,
            setUserAvatarId,
            setKnownWords,
            setSoundActive,
            setDailyWordCount,
            setUserStreak,
            submitRegistration,
            submitLogin,
            submitLogout
            }}>
          {children}
        </UserContext.Provider>
      );
};