import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

// REGISTER MAHASISWA
export const registerMahasiswa = async (email, password, name = '') => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    email: user.email,
    name: name,
    role: "mahasiswa",
    createdAt: new Date().toISOString()
  });

  return user;
};

// LOGIN
export const loginUser = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  const docRef = doc(db, "users", user.uid);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    throw new Error("Data pengguna tidak ditemukan.");
  }

  const role = docSnap.data().role;
  return { user, role };
};

// LOGOUT
export const logoutUser = async () => {
  await signOut(auth);
};