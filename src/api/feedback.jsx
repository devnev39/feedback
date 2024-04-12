import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, setDoc } from "firebase/firestore"
import { db } from "../db/firebase"

export default {
    getFeedbacks: async () => {
        const ds = await getDocs(collection(db, 'feedbacks'));
        return ds.docs.map((d) => d.data());
    },

    createFeedback: async (feedback) => {
        const docRef = await addDoc(collection(db, 'feedbacks'), feedback);
        await setDoc(doc(db, 'feedbacks', docRef.id), {...feedback, id: docRef.id});
        const d = await getDoc(doc(db, 'feedbacks', docRef.id));
        return d.data();
    },

    updateFeedback: async (feedback) => {
        await setDoc(doc(db, 'feedbacks', feedback.id), feedback, {merge: true});
        const d = await getDoc(doc(db, 'feedbacks', feedback.id));
        return d.data();
    },

    deleteFeedback: async (feedbackId) => {
        await deleteDoc(doc(db, 'feedbacks', feedbackId));
    }
}
