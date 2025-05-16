import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignUpGoogle from "../components/SignUpGoogle";
import { Link } from "react-router-dom";
import '../Auth.css';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/home');
        } catch (error) {
            console.log(error.message);
            toast.error("Incorrect email or password");
        }
    };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit} className="auth-form">
                <h3>Login</h3>
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
                <h4>Don't have an account? <Link to='/signup'>Sign Up</Link></h4>
            </form>
        </div>
    );
}
