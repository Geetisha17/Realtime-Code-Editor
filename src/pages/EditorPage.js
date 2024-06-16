import React, { useEffect, useRef, useState } from 'react';
import Client from '../components/Client';
import CodeEditor from '../components/CodeEditor';
import { initSocket } from '../backend/socket';
import toast from 'react-hot-toast';
import { ACTIONS } from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const socketRef = useRef(null);
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const hasJoinedRoom = useRef(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      function handleErrors(e) {
        console.error('socket error', e);
        toast.error('Socket connection failed, try again later.');
        reactNavigator('/');
      }

      if (!hasJoinedRoom.current) {
        socketRef.current.emit(ACTIONS.JOIN, {
          roomId,
          username: location.state?.username,
        });
        hasJoinedRoom.current = true;
      }

      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);

      socketRef.current.on(ACTIONS.JOINED, handleUserJoined);
      socketRef.current.on(ACTIONS.DISCONNECTED, handleUserDisconnected);
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED, handleUserJoined);
        socketRef.current.off(ACTIONS.DISCONNECTED, handleUserDisconnected);
      }
    };
  }, [roomId, location.state?.username, reactNavigator]);

  const handleUserJoined = ({ clients: newClients, username, socketId }) => {
    if (username !== location.state?.username) {
      toast.success(`${username} joined the room`);
      console.log(`${username} joined`);
    }
    setClients(newClients);
  };

  const handleUserDisconnected = ({ socketId, username }) => {
    toast.success(`${username} left the room`);
    setClients(prevClients => prevClients.filter(client => client.socketId !== socketId));
  };

  if (!location.state) {
    return <Navigate to="/" />;
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
        <CodeEditor socketRef={socketRef} roomId={roomId} />
      </div>
    </div>
  );
};

export default EditorPage;