import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../db/firebase"

export default {
    getUser: async (userId) => {
        const user = await getDoc(doc(db,'users',userId));
        return user.data();
    },

    createUser: async (user) => {
        await setDoc(doc(db, 'users', user.email), user);
        const u = await getDoc(doc(db, 'users', user.email));
        return u.data();
    },

    getUsers: async () => {
        const users = await getDocs(collection(db, 'users'));
        return users.docs.map((u) => u.data());
    }
}
