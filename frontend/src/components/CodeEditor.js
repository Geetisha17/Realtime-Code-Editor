import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Langss from './Langss';
import { CODE_SNIPPETS } from "../constants";
import Output from './Output';
import { ACTIONS } from '../Actions';
import _ from 'lodash';

const CodeEditor = ({ socketRef, roomId, onCodeChange, codeRef, username, initialCode, language,setLanguage }) => {
  const editorRef = useRef(null);
  // const [language, setLanguage] = useState('cpp');
  const [editorValue, setEditorValue] = useState(initialCode || CODE_SNIPPETS[language]);

  const emitCodeChange = useRef(
    _.debounce((code) => {
      if (socketRef.current) {
        socketRef.current.emit(ACTIONS.CODE_CHANGE, { roomId, code });
      }
    }, 300)
  ).current;

  const preventEmit = useRef(false);
  const onMount = (editor) => {
    console.log("Ediotr onMount");
    editorRef.current = editor;
    editor.focus();

    const value  = initialCode || CODE_SNIPPETS[language];

      editor.setValue(value);
      onCodeChange(value);
      codeRef.current = value;
    

    if(socketRef.current)
    {
      console.log("emitting code_sync...");
      socketRef.current.emit(ACTIONS.SYNC_CODE,
        {
          socketId: socketRef.current.id,
          roomId
        }
      )
    }
  
    editor.onDidChangeModelContent(() => {
      if(preventEmit.current) return;
      const value = editor.getValue();
      onCodeChange(value);
      emitCodeChange(value);
      console.log('Code changed:', value);
      // if(socketRef.current)
      //   {
      //     socketRef.current.emit(ACTIONS.CODE_CHANGE,{
      //       roomId,
      //       code:value
      //     })
      //   }
    });
  };

  useEffect(() => {
  if (!socketRef.current) return;
  const socket = socketRef.current;

  const handleCodeChange = ({ code }) => {
    if (editorRef.current && code !== null) {
      const currentValue = editorRef.current.getValue();
      if (currentValue !== code) {
        preventEmit.current = true;
        editorRef.current.setValue(code);
        onCodeChange(code);
        codeRef.current = code;
        preventEmit.current = false;
      }
    }
  };

  socket.on(ACTIONS.CODE_CHANGE, handleCodeChange);

  return () => {
    socket.off(ACTIONS.CODE_CHANGE, handleCodeChange);
  };
}, [socketRef]);

  
  // useEffect(() => {
  //   const handleCodeChange = ({ code }) => {
  //     console.log('Received code:', code);
  //     if (editorRef.current && code !== null) {
  //       const currentValue = editorRef.current.getValue();
  //       if (currentValue !== code) {
  //         preventEmit.current=true;
  //         editorRef.current.setValue(code);
  //         setEditorValue(code);
  //         onCodeChange(code);
  //         codeRef.current=code;
  //         preventEmit.current=false;
  //       }
  //     }
  //   };
  
  //   if (socketRef.current && socketRef.current.connected) {
  //     socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
  //   }
  
  //   return () => {
  //     if (socketRef.current && socketRef.current.connected) {
  //       socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
  //     }
  //   };
  // }, [socketRef.current]);

  useEffect(() => {
    if (!socketRef.current) return;
  
    const handleConnect = () => {
      console.log("Socket connected. Requesting code sync...");
      socketRef.current.emit(ACTIONS.SYNC_CODE, {
        socketId: socketRef.current.id,
        roomId,
      });
    };
  
    if (socketRef.current.connected) {
      handleConnect();
    } else {
      socketRef.current.on('connect', handleConnect);
    }
  
    return () => {
      socketRef.current.off('connect', handleConnect);
    };
  }, [socketRef, roomId]);

//   useEffect(() => {
//     const handleSyncCode = ({ code }) => {
//         console.log('Syncing code:', code);
//         if (editorRef.current) {
//             const currentValue = editorRef.current.getValue();
//             if (currentValue !== code) {
//               preventEmit.current = true;
//               editorRef.current.setValue(code);
//               setEditorValue(code);
//               onCodeChange(code);
//               codeRef.current=code;
//               preventEmit.current=false;
//             }
//         }
//     };

//     if (socketRef.current && socketRef.current.connected) {
//         socketRef.current.on(ACTIONS.SYNC_CODE, handleSyncCode);
//     }

//     return () => {
//         if (socketRef.current && socketRef.current.connected) {
//             socketRef.current.off(ACTIONS.SYNC_CODE, handleSyncCode);
//         }
//     };
// }, [socketRef.current]);
// useEffect(() => {
//   if (!socketRef.current) return;

//   const handleSyncCode = ({ code }) => {
//     if (editorRef.current) {
//       preventEmit.current = true;
//       editorRef.current.setValue(code);
//       onCodeChange(code);
//       codeRef.current = code;
//       preventEmit.current = false;
//     }
//   };

//   socketRef.current.on(ACTIONS.SYNC_CODE, handleSyncCode);

//   return () => {
//     socketRef.current.off(ACTIONS.SYNC_CODE, handleSyncCode);
//   };
// }, []);
  

  // const onSelect = (selectedLanguage) => {
  //   setLanguage(selectedLanguage);
  //   const snippet = CODE_SNIPPETS[selectedLanguage];
  //   console.log(snippet, " sd");
  //   setEditorValue(snippet);
  //   if (editorRef.current) {
  //     editorRef.current.setValue(snippet);
  //   }
  // };
  useEffect(() => {
    const snippet = CODE_SNIPPETS[language];
    setEditorValue(snippet);
    if (editorRef.current) {
      editorRef.current.setValue(snippet);
    }
  }, [language]);

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        const editorElement = editorRef.current.getDomNode();
        if (editorElement) {
          console.log('resize', editorElement);
        }
      }
    };

    const resizeObserver = new ResizeObserver(handleResize);

    if (editorRef.current) {
      const editorElement = editorRef.current.getDomNode();
      if (editorElement) {
        resizeObserver.observe(editorElement);
      }
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <Langss language={language} onSelect={onSelect} />
      <div className='compilerdiv'>
        <Editor
          className='EditorPart'
          height="100vh"
          width="45vw"
          language={language}
          theme="vs-dark"
          onMount={onMount}
          value={editorValue}
          onChange={(value) => setEditorValue(value)}
        />
        <Output className='outputWrap' editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditor;