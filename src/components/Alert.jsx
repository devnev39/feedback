import React, { useContext, useEffect } from 'react'
import { toast, ToastContainer } from 'react-toastify';
import { AlertContext } from '../context/AlertContext'
import "react-toastify/dist/ReactToastify.css";

export default function Alert() {
    const {message, type, showToast, setShowToast} = useContext(AlertContext);

    useEffect(() => {
        if (showToast) {
            toast[type](message, {role: 'alert', position: 'bottom-center'});
            setShowToast(false);
        }
    }, [message, setShowToast, showToast, type]);
    return (
        <ToastContainer autoClose={3000} />
    )
}
