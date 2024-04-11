import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc } from "firebase/firestore"
import { db } from "../db/firebase"

export default {
    createProject: async (project) => {
        const docRef = await addDoc(collection(db, 'projects'), project);
        await setDoc(doc(db, 'projects', docRef.id), {...project, id: docRef.id});
        const d = await getDoc(doc(db, 'projects', docRef.id));
        return d.data();
    },
    
    getProjects: async () => {
        const projects = await getDocs(query(collection(db, 'projects')));
        const ps = [];
        projects.forEach((d) => ps.push(d.data()));
        return ps;
    },

    updateProject: async (project) => {
        await setDoc(doc(db, 'projects', project.id), project);
        const d = await getDoc(doc(db, 'projects', project.id));
        return d.data();
    },

    deleteProject: async (projectId) => {
        await deleteDoc(doc(db, 'projects', projectId));
    }
}
