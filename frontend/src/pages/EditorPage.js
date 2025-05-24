import React, { useEffect, useRef, useState } from 'react';
import Client from '../components/Client';
import CodeEditor from '../components/CodeEditor';
import { initSocket } from '../socket';
import toast from 'react-hot-toast';
import  ACTIONS  from '../Actions';
import { useLocation, useNavigate, Navigate, useParams } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import DownloadButton from '../components/DownloadButton';
import axios from 'axios';

const EditorPage = () => {
  const [clients, setClients] = useState([]);
  const [user,setUser] = useState(null);
  const [language, setLanguage] = useState('cpp');
  const socketRef = useRef(null);
  const codeRef = useRef('');
  const location = useLocation();
  const reactNavigator = useNavigate();
  const { roomId } = useParams();
  const mySocketId = useRef(null);

    useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
    });

    return () => unsubscribe();
  }, []);


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

      const handleUserJoined = ({ clients: newClients, username, socketId }) => {
          console.log('Recieved join ',newClients);
        if (username !== location.state?.username) {
          toast.success(`${username} joined the room`);
          console.log(`${username} joined`);
        }
        setClients(newClients);
      };

      socketRef.current.on('connect', () => {
      mySocketId.current = socketRef.current.id;

        console.log(">>> Sending SYNC_CODE after joing");
        socketRef.current.emit(ACTIONS.JOIN, {
        roomId,
        username: location.state?.username,
        userId:user?.uid,
      });

      console.log("Join emmited ", {
        roomId,
        username: location.state?.username,
        userId:user?.uid
      });

      console.log("username ",location.state);

      console.log(">> emitting code sync from client",{
        socketId:socketRef.current.id,
        roomId
      })

      setTimeout(()=>{
        if(codeRef.current)
        {
          console.log(">>> emitting SYNC_CODE with codeRef");
          socketRef.current.emit(ACTIONS.SYNC_CODE,{
          socketId: socketRef.current.id,
          roomId,
        })
        }else{
          console.log(">>COde ref was wmpty")
        }
      },500);
    });

      socketRef.current.on(ACTIONS.JOINED, handleUserJoined);
      socketRef.current.on(ACTIONS.DISCONNECTED, handleUserDisconnected);
    };

    init();

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current.off(ACTIONS.JOINED);
        socketRef.current.off(ACTIONS.DISCONNECTED);
        console.log('Socket disconnected:', socketRef.current); 
        socketRef.current.off(ACTIONS.DISCONNECTED, handleUserDisconnected);
      }
    };
  }, [roomId, location.state?.username, reactNavigator]);

  const handleSaveCode = async () => {
      if (!user) {
        toast.error('You must be logged in to save code.');
        return;
      }
      const codeId = location.state?.codeId;

      try {
        if (codeId) {
          await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/code/update/${user.uid}/${codeId}`, {
            code: codeRef.current
          });
          toast.success('Code updated successfully!');
        } else {
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/code/save`, {
            code: codeRef.current,
            userId: user.uid
          });
          toast.success('Code saved successfully!');
        }
      } catch (error) {
        console.error('Save error:', error);
        toast.error('Failed to save code.');
      }
    };

  useEffect(()=>{
    if(location.state?.code)
    {
      codeRef.current = location.state.code;
    }
  },[location.state?.code])

  

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
          {user && (
              <div className="user-info">
                <div className="user-email">
                  <strong>Logged in as:</strong>
                  <br />
                  <span>{user.email}</span>
                </div>
                <button
                  className="btn dashboard-btn"
                  onClick={() => reactNavigator('/dashboard')}
                >
                  Go to Dashboard
                </button>
              </div>
            )}
          <h3>Users</h3>
          <div className='clientList'>
            {clients.map((client) => (
              <Client key={client.socketId} username={client.username} />
            ))}
          </div>
        </div>
        <button className='btn saveBtn' onClick={handleSaveCode}>
          💾 Save Code
        </button>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy Room ID</button>
        <button className='btn leavebtn' onClick={leaveRoom}>Leave Room</button>
      </div>
      <div className='editorWrap'>
        <div>
          <DownloadButton codeRef={codeRef} language={language}/>
        </div>
        <CodeEditor
          socketRef={socketRef}
          roomId={roomId}
          onCodeChange={(code) => { codeRef.current = code; }}
          codeRef={codeRef}
          username={location.state?.username}
          initialCode={location.state?.code || ''}
          setLanguage={setLanguage}
          language={language}
        />
      </div>
    </div>
  );
};

export default EditorPage;