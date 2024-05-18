import React from 'react';
import { LANGS_VERSION } from "../constants";

const languages = Object.entries(LANGS_VERSION);

const Langss = ({ language, onSelect }) => {
  return (
    <div className='dropDown'>
      <div className='forLan'>
      <select className='opt' onChange={(e) => onSelect(e.target.value)} value={language}>
        {languages.map(([lang, version]) => ( 
          <option key={lang} value={lang} style={{ 
            backgroundColor: lang===language ? "rgb(206, 147, 222)":" rgb(49, 10, 85)",
          }}>
            {lang} ({version})
          </option>
        ))}
      </select>
      </div>
    </div>
  );
};

export default Langss;
