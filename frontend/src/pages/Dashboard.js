import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Client from '../components/Client';
import '../Dashboard.css';

export default function Dashboard() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
  const fetchUserCode = async () => {
    const uid = user?.uid || auth.currentUser?.uid;

    if (!uid) return;

    try {
      setLoading(true);
      const response = await axios.get(`https://8c4f-44-203-254-128.ngrok-free.app/api/code/all/${uid}`);
      console.log("Raw response:", response);

      const data = Array.isArray(response.data?.codes)
        ? response.data.codes
        : Array.isArray(response.data)
        ? response.data
        : [];

      setCodes(data);
      console.log("Final code array:", data);
    } catch (error) {
      console.error("Error fetching codes:", error);
      setCodes([]);
    } finally {
      setLoading(false);
    }
  };

  fetchUserCode();
}, [user]);

  const handleDelete = async (codeId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/code/delete/${user.uid}/${codeId}`);
      setCodes((prev) => prev.filter((item) => item._id !== codeId));
    } catch (err) {
      console.error('Error deleting code:', err);
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  if (!user) {
    return <div className="dashboard-container">You must be logged in to view your dashboard.</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="user-info-box">
          <Client username={user.displayName || 'User'} photoURL={user.photoURL} />
          <div className="user-details">
            <h2>{user.displayName || 'User'}</h2>
            <p>{user.email}</p>
          </div>
        </div>
        <button className="logout-btn" onClick={() => signOut(auth)}>Logout</button>
      </div>

      <h3>Your Saved Code Snippets:</h3>

      {codes.length === 0 ? (
        <p>No code snippets saved yet.</p>
      ) : (
        <div className="code-grid">
          {codes.map((item) => (
            <div key={item._id} className="code-card">
              <pre className="code-block">{item.code}</pre>
              <div className="code-footer">
                <small>Saved on: {new Date(item.timestamp).toLocaleString()}</small>
                <div className="button-group">
                  <button className="action-btn delete" onClick={() => handleDelete(item._id)}>
                    Delete
                  </button>
                  <button className="action-btn update" onClick={() =>
                    navigate(`/editor/${item._id}`, {
                      state: {
                        code: item.code,
                        codeId: item._id,
                        username: user.displayName || 'Anonymous'
                      }
                    })
                  }>
                    Update
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}