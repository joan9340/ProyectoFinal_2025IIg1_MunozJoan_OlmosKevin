// src/Context/AuthContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import app, { db } from "../FirebaseConfig/FirebaseConfig";
import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const auth = getAuth(app);
  const [user, setUser] = useState(null);         // firebase user
  const [userData, setUserData] = useState(null); // firestore user doc (may include role)
  const [loading, setLoading] = useState(true);
  // NOTE: useNavigate cannot be used directly here if provider is used at top-level of Router.
  // We'll not navigate from here — routes/components will handle redirects based on userData.

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
     if (currentUser) {
  const ref = doc(db, "users", currentUser.uid);
  const snap = await getDoc(ref);

  if (snap.exists()) {
    // UID manual en el objeto
    setUserData({ uid: currentUser.uid, ...snap.data() });
  } else {
    const base = {
      email: currentUser.email,
      nombre: currentUser.email?.split("@")[0] || "",
      uid: currentUser.uid,
    };
    await setDoc(ref, base);
    setUserData(base);
  }


      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return () => unsub();
  }, [auth]);

  // registrar: by default we'll NOT assign role so user can choose after first login
  const register = async (email, password, role = null) => {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const uid = res.user.uid;
    const payload = {
      email,
      nombre: email.split("@")[0],
      ...(role ? { role } : {}) // only set role if provided; otherwise leave absent
    };
    await setDoc(doc(db, "users", uid), payload);
    return res;
  };

  const login = (email, password) => signInWithEmailAndPassword(auth, email, password);
  const logout = () => signOut(auth);

  // setRole: guarda/actualiza role en users/{uid}
  const setRole = async (uid, role) => {
    const ref = doc(db, "users", uid);
    await updateDoc(ref, { role });
    // actualizar state local
    setUserData((prev) => ({ ...(prev || {}), role }));
  };

  const value = { user, userData, loading, register, login, logout, setRole };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
};
