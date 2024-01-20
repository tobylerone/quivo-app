import { useState, useEffect } from 'react';
import client from '../utils/axios';

export function useFetchUserData(url: string) {

    const [userData, setUserData] = useState(null);

    useEffect(() =>{
        // Get accounts the user is followed by / is following
        client.get(url).then(function(res) {
            setUserData(res.data);
        }).catch(function(e) {
            console.log(e.response.data)
        });

    }, [url]);

    return userData;
}