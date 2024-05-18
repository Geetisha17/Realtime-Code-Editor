import React, { useState } from 'react';
import { executeCode } from '../api';

const Output = ({ editorRef, language }) => {
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const runCode = async () => {
        const sourceCode = editorRef.current.getValue();
        if (!sourceCode) return;

        setIsLoading(true);
        try {
            const result = await executeCode(sourceCode, language);
            setOutput(result.output || 'No output');
        } catch (error) {
            setOutput('Error executing code');
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='outputContainer'>
            <div className='topshelve'>
            <button className='btn runBtn' onClick={runCode} disabled={isLoading}>
                {isLoading ? 'Running...' : 'Run Code'}
            </button>
            </div>
            <h3 className='outputHeading'>Output</h3>
            <div className='rescontainer'>
                <pre>{output}</pre>
            </div>
        </div>
    );
};

export default Output;
