import { useEffect, useState } from "react";
import authContext from "./authContext";

const AuthProvider = (props) => {
    const [isLoggedIn, setIsLoggedIn] = useState(true)
    const authToken = localStorage.getItem('authToken')

    // useEffect(()=> {
    //     async function verifyAuthToken(){
    //         if (authToken) {
    //             try {
    //                 const res = await fetch(`${process.env.REACT_SERVER_BASE_URL || "http://localhost:3000"}/api/auth/verifyAuthToken`, {
    //                     authToken
    //                 })

    //                 if (res.verified) setIsLoggedIn(true)
    //             }
    //             catch (error) {
    //                 console.error("error verifying user")
    //             }
    //         }
    //     }
    //     verifyAuthToken()
    // }, [])

    useEffect(() => {
        if (!authToken) setIsLoggedIn(false)
        else setIsLoggedIn(true)
    }, [])

    return (
        <authContext.Provider
            value={{
                isLoggedIn: isLoggedIn,
                setIsLoggedIn: setIsLoggedIn
            }}
        >
            {props.children}
        </authContext.Provider>
    )
}

export default AuthProvider