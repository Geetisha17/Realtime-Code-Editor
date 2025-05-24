import axios from 'axios';
import { LANGS_VERSION } from './constants';

const API = axios.create({
    baseURL: `${process.env.REACT_APP_BACKEND_URL}`,
});

export const executeCode = async (sourceCode, language) => {
    try {
        const response = await API.post('/api/code/compile', {
            language: language,
            version: LANGS_VERSION[language],
            script: sourceCode,
        });
        return response.data;
    } catch (error) {
        console.error('Error ', error);
        return { error: 'Error' };
    }
};
