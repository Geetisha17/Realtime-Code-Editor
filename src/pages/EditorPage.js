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
  const codeRef = useRef('');
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const hasJoinedRoom = useRef(false);

  useEffect(() => {
    const init = async () => {
      socketRef.current = await initSocket();
      console.log('Socket initialized:', socketRef.current);
      socketRef.current.on('connect_error', handleErrors);
      socketRef.current.on('connect_failed', handleErrors);

      function handleErrors(e) {
        console.error('Socket error', e);
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

      // socketRef.current.off(ACTIONS.JOINED);
      // socketRef.current.off(ACTIONS.DISCONNECTED);

      socketRef.current.on(ACTIONS.JOINED, handleUserJoined);
      socketRef.current.on(ACTIONS.DISCONNECTED, handleUserDisconnected);
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        // socketRef.current.off(ACTIONS.JOINED, handleUserJoined);
        console.log('Socket disconnected:', socketRef.current); 
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


    if (socketRef.current && codeRef.current && codeRef.current !== '') {
      console.log('Emitting SYNC_CODE with code:', codeRef.current); 
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        socketId,
        roomId,
          // code: codeRef.current,
          // socketId: socketRef.current.id,
      });
  }
  };

  const handleUserDisconnected = ({ socketId, username }) => {
    toast.success(`${username} left the room`);
    setClients(prevClients => prevClients.filter(client => client.socketId !== socketId));
  };

  async function copyRoomId() {
    try {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room ID copied');
    } catch (error) {
      toast.error('Could not copy Room ID');
    }
  }

  function leaveRoom() {
    reactNavigator('/');
    toast.success('Successfully left the room');
  }

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
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leavebtn' onClick={leaveRoom}>Leave Room</button>
      </div>
      <div className='editorWrap'>
        <CodeEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => { codeRef.current = code; }}
          codeRef={codeRef}
        />
      </div>
    </div>
  );
};

export default EditorPage;
