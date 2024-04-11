import { createContext, useContext, useEffect, useState } from "react"
import {GoogleAuthProvider, onAuthStateChanged, signInWithPopup, signOut} from 'firebase/auth';
import {auth} from '../db/firebase';
import {useDispatch} from 'react-redux';
import { setAppUser } from "../feature/users";
import userApi from '../api/user';
import {AlertContext} from '../context/AlertContext';
import dayjs from "dayjs";

export const UserContext = createContext()

export const UserContextProvider = ({children}) => {
    const [user,setUser] = useState(null);
    const {showMessage} = useContext(AlertContext);
    const dispatch = useDispatch();
    const googleSignIn = () => {
        const provider = new GoogleAuthProvider();
        signInWithPopup(auth, provider);
    }

    const logout = () => {
        signOut(auth);
    }

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) return;
            userApi.getUser(currentUser.email).then((data) => {
                if (data) {
                    dispatch(setAppUser(data));
                } else {
                    showMessage('User not found ! Saving user !', 'info');
                    const user = {email: currentUser.email, photoUrl: currentUser.photoURL, displayName: currentUser.displayName, uid: currentUser.uid};
                    user.createdAt = dayjs().toISOString();
                    userApi.createUser(user).then((data) => {
                        dispatch(setAppUser(data));
                        showMessage('User saved !', 'success');
                    }).catch((err) => {
                        showMessage(err.message, 'error');
                    });
                }
            }).catch((err) => {
                showMessage(err.message, 'error');
            })
        })
        return () => {
            unsubscribe();
        }
    }, [dispatch, user]);
    return (
        <UserContext.Provider value={{user, googleSignIn, logout}}>
            {children}
        </UserContext.Provider>
    )
}
