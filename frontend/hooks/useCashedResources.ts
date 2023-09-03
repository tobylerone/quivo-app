import { useEffect, useState } from "react";
import * as Font from "expo-font"
import { initWorkouts } from "../storage/workout";

export default function useCachedResources() {
    const [isLoadingComplete, setIsLoadingComplete] = useState(false)

    useEffect(() =>{
        async function loadlResourceAndDataAsync() {
            try{
                await initWorkouts()
                await Font.loadAsync({
                    "montserrat": require("../assets/fonts/Montserrat-Regular.ttf"),
                    "montserrat-bold": require("../assets/fonts/Montserrat-Bold.ttf")
                })

            }catch(err){
                console.warn(err)
            } finally {
                setIsLoadingComplete(true)
            }

        }
        loadlResourceAndDataAsync()
    }, [])


    return isLoadingComplete
    

}