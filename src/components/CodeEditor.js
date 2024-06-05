import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Langss from './Langss';
import { CODE_SNIPPETS } from "../constants";
import Output from './Output';
import {ACTIONS} from '../Actions'; 

const CodeEditor = () => {
  const editorRef = useRef(null);
  const [language, setLanguage] = useState('cpp');
  const [editorValue, setEditorValue] = useState(CODE_SNIPPETS[language]); // Separate state for editor value

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
    editor.onDidChangeModelContent((event) => {
      const value = editor.getValue();
      if(event !== 'setValue')
        {
          socketRef.current.emit(ACTIONS.CODE_CHANGE , {
            roomId,
          });
        }
      // setEditorValue(value);
      console.log('Editor content changed:', event);
    });
  };

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    const snippet = CODE_SNIPPETS[selectedLanguage];
    setEditorValue(snippet);
    editorRef.current?.setValue(snippet);
  };

  function throttle(fn, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        fn(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  useEffect(() => {
    const handleResize = entries => {
      for (let entry of entries) {
        console.log(entry.target); 
      }
    };

    const throttledHandleResize = throttle(handleResize, 100);
    const resizeObserver = new ResizeObserver(throttledHandleResize);

    if (editorRef.current) {
      const editorElement = editorRef.current.getDomNode();
      if (editorElement) {
        resizeObserver.observe(editorElement);
      }
    }
    // editorRef.current.on('change',(instance , changes)=>{
    //   console.log('changes ',changes);
    // })

    return () => {
      if (editorRef.current) {
        const editorElement = editorRef.current.getDomNode();
        if (editorElement) {
          resizeObserver.unobserve(editorElement);
        }
      }
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div>
      <Langss language={language} onSelect={onSelect} />
      <div className='compilerdiv'>
        <Editor
          // socketRef = {socketRef}
          className='EditorPart'
          height="100vh"
          width="45vw"
          language={language}
          theme="vs-dark"
          onMount={onMount}
          defaultValue={CODE_SNIPPETS[language]}
          value={editorValue} 
          onChange={(value) => setEditorValue(value)}
        />
        <Output className='outputWrap' editorRef={editorRef} language={language} />
      </div>
    </div>
  );
};

export default CodeEditor;
