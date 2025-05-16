import { GoogleAuthProvider, signInWithPopup, getAuth } from "firebase/auth";
import { db } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
// import '../App.css';

export default function SignUpGoogle() {
    
    const navigate = useNavigate();
    const handleGoogleSignIn = async (e) => {
        e.preventDefault();
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            if (user) {
                const userRef = doc(db, "Users", user.uid);
                const userSnap = await getDoc(userRef);
                if (!userSnap.exists()) {
                    await setDoc(userRef, {
                        email: user.email,
                        name: user.displayName,
                        profilePic: user.photoURL || "",
                    });
                }
                toast.success("Google Sign-In successful!");
                navigate("/home");
            }
        } catch (error) {
            console.error("Google Sign-In Error:", error);
        }
    };

    return (
        <div>
            <h5>----or sign up with-----</h5>
        <button className="signIn-btn" onClick={handleGoogleSignIn}>
            Sign in with Google
        </button>
        </div>
    );
}
