import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Langss from './Langss';
import { CODE_SNIPPETS } from "../constants";
import Output from './Output';
import { ACTIONS } from '../Actions';

const CodeEditor = ({ socketRef, roomId }) => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('cpp');
  const [editorValue, setEditorValue] = useState(CODE_SNIPPETS[language]);

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();

    editor.onDidChangeModelContent(() => {
      const value = editor.getValue();
      // console.log(socketRef.current.emit(ACTIONS.CODE_CHANGE));
      socketRef.current.emit(ACTIONS.CODE_CHANGE, {
        roomId,
        code: value,
      });
    });
  };

  useEffect(() => {
    const handleCodeChange = ({ code }) => {
      console.log('Received ', code);
      if (code !== null) {
        editorRef.current.setValue(code);
      }
    };
  
    if (socketRef.current && socketRef.current.connected) {
      console.log('Sett ');
      // console.log(socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange));
      socketRef.current.on(ACTIONS.CODE_CHANGE, handleCodeChange);
    }
  
    return () => {
      if (socketRef.current && socketRef.current.connected) {
        socketRef.current.off(ACTIONS.CODE_CHANGE, handleCodeChange);
      }
    };
  }, [socketRef.current, roomId]);
  

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    const snippet = CODE_SNIPPETS[selectedLanguage];
    setEditorValue(snippet);
    if (editorRef.current) {
      editorRef.current.setValue(snippet);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (editorRef.current) {
        const editorElement = editorRef.current.getDomNode();
        if (editorElement) {
          console.log('rexis', editorElement);
        }
      }
    };

    const throttledHandleResize = () => {
      const resizeObserver = new ResizeObserver(handleResize);

      if (editorRef.current) {
        const editorElement = editorRef.current.getDomNode();
        if (editorElement) {
          resizeObserver.observe(editorElement);
        }
      }

      return () => {
        if (editorRef.current) {
          const editorElement = editorRef.current.getDomNode();
          if (editorElement) {
            resizeObserver.unobserve(editorElement);
          }
        }
        resizeObserver.disconnect();
      };
    };

    window.addEventListener('resize', throttledHandleResize);

    return () => {
      window.removeEventListener('resize', throttledHandleResize);
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
