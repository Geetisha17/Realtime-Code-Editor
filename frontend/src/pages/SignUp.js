import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from "firebase/auth";
import {auth , db} from '../firebase';
import { Link } from 'react-router-dom';
import { setDoc , doc } from "firebase/firestore";
import SignUpGoogle from "../components/SignUpGoogle";

export default function SignUp(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [name,setName] = useState(""); 

    const navigate = useNavigate();

    const handleRegister = async(e)=>{
        e.preventDefault();

        try{
            const userCredential = await createUserWithEmailAndPassword(auth,email,password);
            const user = userCredential.user;

            if(user)
            {
                await setDoc(doc(db,"Users",user.uid),{
                    email: user.email,
                    name:name
                })
            }
            console.log("User registered succesfully");
            navigate("/home");
        }
        catch(error)
        {
            console.log(error);
        }
    }

    return (
        <div>
        <form onSubmit={handleRegister}>
            <h3>Sign Up</h3>
            <div>
                <label>Name</label>
                <input
                type="text"
                value={name}
                placeholder="Enter your name"
                onChange={(e)=>setName(e.target.value)}
                />
            </div>
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
            <button type="submit">Submit</button>
        </div>
        <SignUpGoogle/>
        <h4>Already have an account? <Link to='/'>Login</Link></h4>
        </form>
    </div>
    )
}