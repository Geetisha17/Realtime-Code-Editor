import React, { useEffect, useRef, useState  } from 'react';
import Client from '../components/Client';
import CodeEditor from '../components/CodeEditor';
import { initSocket } from '../backend/socket';
import toast from 'react-hot-toast';
import { ACTIONS } from '../Actions';
import { useLocation , useNavigate , Navigate , useParams } from 'react-router-dom';

const EditorPage = () => {
    const socketRef = useRef(null);
    const location = useLocation();
    const reactNavigator = useNavigate();
    const {roomId} = useParams();

    useEffect(() => {
        const init = async () => {
            socketRef.current = await initSocket();
            socketRef.current.on('connect_error', (err) => {
                handleErrors(err);
            });
            socketRef.current.on('connect_failed', (err) => handleErrors(err) );

            function handleErrors(e)
            {
                console.log('socket error',e);
                toast.error('Socket connection failed, try again later.');
                reactNavigator('/');
            }

            socketRef.current.emit(ACTIONS.JOIN, {
                roomId,
                username: location.state?.username,
            });
        };
        init();

        return () => {
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);

    const [clients, setClients] = useState([
        { socketId: 1, username: 'Gee' },
        { socketId: 2, username: 'Mon' },
        { socketId: 3, username: 'Tan' },
    ]);

    if(!location.state){
        return <Navigate to="/"/>
    }

    return (
        <div className='mainWrap'>
            <div className='aside'>
                <div className='asideInner'>
                    <div className='heading'>
                        <h2>Live CodeEditor</h2>
                    </div>
                    <h3>Users</h3>
                    <div className='clientList'>
                        {clients.map((client) => (
                            <Client key={client.socketId} username={client.username} />
                        ))}
                    </div>
                </div>
                <button className='btn copyBtn'>Copy Room ID</button>
                <button className='btn leavebtn'>Leave Room</button>
            </div>
            <div className='editorWrap'>
                <CodeEditor />
            </div>
        </div>
    );
};

export default EditorPage;
