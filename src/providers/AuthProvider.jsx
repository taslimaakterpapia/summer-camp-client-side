import React, { createContext, useEffect, useState } from 'react';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut, updateProfile } from "firebase/auth";
import axios from 'axios';
import { app } from '../firebase/firebase.config';




const auth = getAuth(app);
export const AuthContext=createContext({});

const AuthProvider = ({children}) => {
    const [user,setUser]=useState(null);
    const [loading,setLoading]=useState(true);
    const createUser=(email,password)=>{
        setLoading(true)
        return createUserWithEmailAndPassword(auth,email,password)
    }
    const signIn=(email,password)=>{
        setLoading(true)
        return signInWithEmailAndPassword(auth,email,password)
    };
    
    const logOut=()=>{
        setLoading(true)
        return signOut(auth)
    }
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name, photoURL: photo
        });
    }
    

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
          setUser(currentUser);
          console.log("current user", currentUser);
          //  get and set token
    
          if (currentUser) {
            axios
              .post("https://summer-camp-server-5khiucgdl-taslimaakterpapia.vercel.app/jwt", { email: currentUser.email })
              .then((data) => {
                console.log(data);
                localStorage.setItem("access-token", data.data.token);
                setLoading(false);
              });
          } else {
            localStorage.removeItem("access-token");
          }
        });
        return () => {
          return unsubscribe();
        };
      }, []);
    const authInfo={
        user,
        loading,
        createUser,
        signIn,
        logOut,
        updateUserProfile
        //googleSignIn
    }
    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;