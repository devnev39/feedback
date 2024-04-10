import { createContext, useState } from "react";

export const AlertContext = createContext();

export const AlertContextProvider = ({ children }) => {
    const [message, setMessage] = useState("");
    const [type, setType] = useState("success");
    const [showToast, setShowToast] = useState(false);

    const showMessage = (text, type) => {
        setMessage(text);
        setType(type);
        setShowToast(true);
    }
    
    return (
        <AlertContext.Provider value={{message, setMessage, type, setType, showToast, setShowToast, showMessage}}>
            {children}
        </AlertContext.Provider>
    )
}
