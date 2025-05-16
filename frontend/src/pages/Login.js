import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../firebase";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import SignUpGoogle from "../components/SignUpGoogle";
import { Link } from "react-router-dom";

export default function Login() {
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit= async(e)=>{
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth,email,password);
            navigate('/home');
        }
        catch(error)
        {
            console.log(error.message);
            toast.error("Incorrect password");
        }
    }
    
  return (
    <div>
       <form onSubmit={handleSubmit}>
       <h3>Login</h3>
        <div>
        <label>Email</label>
        <input
        type="email"
        className="email"
        placeholder="Enter your mail"
        value={email}
        onChange={(e)=>setEmail(e.target.value)}
        />
        </div>
        <div>
            <label>Password</label>
            <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            />
        </div>
        <div>
        <button className="submit button" type="submit">Submit</button>
       </div>
       <SignUpGoogle/>
       <h4>Dont have an account? <Link to='/signup'>SignUp</Link></h4>
       </form>
    </div>
  )
}