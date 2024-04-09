import { useState, useEffect, useContext } from "react";
// Utils
import { sumWordCounts } from "../../../utils/functions";
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
    const [isCutoff, setIsCutoff] = useState<boolean>(false);
    const [currentUserOutsideCutoff, setCurrentUserOutsideCutoff] = useState<boolean>(false);
    const [currentUserIdx, setCurrentUserIdx] = useState<number>(0);

    // One less than position
    const cutoffIdx = 3;
    
    useEffect(() => {
        if (userData) {
            
            // Sort by streak
            //const data = [currentUser, ...userData].sort((a, b) => b.streak - a.streak).slice(-10)

            // Add in current user and sort by total words known
            let data = [currentUser, ...userData].sort(
                (a, b) => sumWordCounts(b.known_words_count) - sumWordCounts(a.known_words_count)
            ).slice(-10)

            // NOTE: If the user wasn't in the list for whatever reason, this would break
            const idx = data.findIndex(obj => obj.user_id === currentUser.user_id);
            setCurrentUserIdx(idx);

            // Check if user is outside cutoff
            setCurrentUserOutsideCutoff(idx > cutoffIdx);

            // Cut down the leaderboard to only the top users in the panel
            if (data.length > cutoffIdx + 1) {
                data = data.slice(0, cutoffIdx + 1);
                setIsCutoff(true);
            }

            setLeaderboardData(data);
        }
    }, [userData]);

    return { leaderboardData, isCutoff, currentUserOutsideCutoff, currentUserIdx }
}