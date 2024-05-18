import React, { useRef, useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Langss from './Langss';
import { CODE_SNIPPETS } from "../constants";
import Output from './Output';

const CodeEditor = () => {
  const editorRef = useRef();
  const [language, setLanguage] = useState('cpp');
  const [editorValue, setEditorValue] = useState(CODE_SNIPPETS[language]); // Separate state for editor value

  const onMount = (editor) => {
    editorRef.current = editor;
    editor.focus();
  };

  const onSelect = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    setEditorValue(CODE_SNIPPETS[selectedLanguage]); 
  };

  // Throttle function
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

  // Use effect to setup ResizeObserver
  useEffect(() => {
    const handleResize = entries => {
      for (let entry of entries) {
        console.log(entry.target); // Handle resize
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
