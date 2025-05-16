import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from '../firebase';
import { Link } from 'react-router-dom';
import { setDoc, doc } from "firebase/firestore";
import SignUpGoogle from "../components/SignUpGoogle";
import '../Auth.css';

export default function SignUp() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            if (user) {
                await setDoc(doc(db, "Users", user.uid), {
                    email: user.email,
                    name: name
                });
            }
            console.log("User registered successfully");
            navigate("/home");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleRegister} className="auth-form">
                <h3>Sign Up</h3>
                <div>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        placeholder="Enter your name"
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        placeholder="Enter your email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        placeholder="Enter your password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Submit</button>
                <SignUpGoogle />
                <h4>Already have an account? <Link to='/'>Login</Link></h4>
            </form>
        </div>
    );
}
