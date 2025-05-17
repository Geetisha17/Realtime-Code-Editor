import React from 'react';

const DownloadButton = ({ codeRef, language = 'txt' }) => {
  const handleDownload = () => {
    const code = codeRef.current || '';
    const blob = new Blob([code], { type: 'text/plain' });

    const validExtensions = ['typescript', 'java', 'csharp', 'php', 'cpp'];
    const extension = validExtensions.includes(language.toLowerCase()) ? language.toLowerCase() : 'txt';
    
    const extensionMap = {
      typescript: 'ts',
      java: 'java',
      csharp: 'cs',
      php: 'php',
      cpp: 'cpp',
    };

    const fileExt = extensionMap[extension] || 'txt';

    const filename = `code.${fileExt}`;

    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();

    URL.revokeObjectURL(link.href);
  };

  return (
    <button style={{position:"absolute",top:"1px",left:"45rem"}} className="btn downloadBtn" onClick={handleDownload}>
      ⬇️ Download Code
    </button>
  );
};

export default DownloadButton;
