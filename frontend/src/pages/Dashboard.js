import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import axios from 'axios';
import '../Dashboard.css';

export default function Dashboard() {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [codes, setCodes] = useState([]);
  const [loading, setLoading] = useState(true);

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
      if (!user) return;
      try {
        setLoading(true);
        const token = await user.getIdToken();
        const response = await axios.get(`http://localhost:5000/api/code/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCodes(response.data);
        setLoading(false);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    };

    fetchUserCode();
  }, [user]);

  const handleDelete = async (codeId) => {
    try {
      const token = await user.getIdToken();
      await axios.delete(`http://localhost:5000/api/code/delete/${codeId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
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
        <h2>Welcome, {user.displayName || 'User'}!</h2>
        <p>Email: {user.email}</p>
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
                <button className="delete-btn" onClick={() => handleDelete(item._id)}>🗑️</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
