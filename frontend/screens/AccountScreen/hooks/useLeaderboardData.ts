import { useState, useEffect, useContext } from "react";
// Contexts
import UserContext from '../../../contexts/UserContext';
// Hooks
import { useFetchUserData } from "../../../hooks/useFetchUserData";

export default function useLeaderboardData() {
    const { currentUser } = useContext(UserContext);

    // Fetches the data for the user's followed accounts using another custom hook
    // and sorts them by streak for the leaderboard, and limit to 10
    const userData = useFetchUserData('api/users/' + currentUser.user_id + '/following/');
    const [leaderboardData, setLeaderboardData] = useState(null);
    useEffect(() => {
        if (userData) {
            // Add in current user. assumes currentUser has the same structure as userData objects 
            const data = [currentUser, ...userData].sort((a, b) => b.streak - a.streak).slice(-10)
            setLeaderboardData(data);
        }
    }, [userData]);

    return leaderboardData
}