import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
    apiKey: "Aizasybvgp41iaG-MWECGK-2CQCPRPRQRQJA",
    authDomain: " Dukevinh03",
    projectId: "DukevinH03-B61BD",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "123456789",
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const signInWithGoogle = async () => {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        console.log("Google login success:", result.user);
        return result.user;
    } catch (error) {
        console.error("Google login error:", error);
        throw error;
    }
};

export const signInWithGitHub = async () => {
    try {
        const result = await signInWithPopup(auth, githubProvider);
        console.log("GitHub login success:", result.user);
        return result.user;
    } catch (error) {
        console.error("GitHub login error:", error);
        throw error;
    }
};