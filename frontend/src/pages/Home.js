import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');

    const createNewRoom = (e) => {
        e.preventDefault();
        const id = uuidv4();
        setRoomId(id);
        toast.success('Room Created!');
    };

    const joinRoom = () => {
        if (!roomId || !username) {
            toast.error('Room ID and username are required');
            return;
        }

        navigate(`/editor/${roomId}`, {
            state: {
                username,
            },
        });
    };

    const handleInputEnter = (e) => {
        if (e.code === 'Enter') {
            joinRoom();
        }
    };

    return (
        <div className='homePageWrapper'>
            <div className='formWrapper'>
                <h2>Live CodeEditor</h2>
                <h4 className='mainLabel'>Room ID</h4>
                <div className='inputGrp'>
                    <input
                        type="text"
                        className='inputBox'
                        onChange={(e) => setRoomId(e.target.value)}
                        value={roomId}
                        placeholder='Room Id'
                        onKeyUp={handleInputEnter}
                    />
                    <input
                        type="text"
                        className='inputBox'
                        placeholder='Username'
                        onChange={(e) => setUsername(e.target.value)}
                        value={username}
                        onKeyUp={handleInputEnter}
                    />
                    <button className='btn joinBtn' onClick={joinRoom}>Join</button>
                    <span className='createInfo'>
                        Don't have an invite? <a onClick={createNewRoom} href="#" className='createNewBtn'>new Room</a>
                    </span>
                </div>
            </div>
            <footer>
                <h4>RealTime Code Editor</h4>
            </footer>
        </div>
    );
}

export default Home;
