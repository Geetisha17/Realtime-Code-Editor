import axios from 'axios';
import { LANGS_VERSION } from './constants';

const API = axios.create({
    baseURL: 'http://localhost:5000',
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
