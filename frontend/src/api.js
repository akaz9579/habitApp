import axios from 'axios';

const PASSCODE_KEY = 'habitapp.passcode';

// Same origin by default: Vercel routes /api to the backend, and Vite's dev
// server proxies it to localhost:5001.
const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
});

const readPasscode = () => {
    try {
        return localStorage.getItem(PASSCODE_KEY) || '';
    } catch {
        return '';
    }
};

let memoryPasscode = readPasscode();

export const savePasscode = (code) => {
    try {
        localStorage.setItem(PASSCODE_KEY, code);
    } catch {
        // Storage blocked: the passcode then has to be entered each visit.
    }
    memoryPasscode = code;
};

client.interceptors.request.use((config) => {
    if (memoryPasscode) config.headers['X-Passcode'] = memoryPasscode;
    return config;
});

export const isUnauthorized = (err) => err?.response?.status === 401;

const data = (request) => request.then((res) => res.data);

export const api = {
    list: () => data(client.get('/habits')),
    create: (habit) => data(client.post('/habits', habit)),
    update: (id, patch) => data(client.patch(`/habits/${id}`, patch)),
    remove: (id) => data(client.delete(`/habits/${id}`)),
    reorder: (ids) => data(client.put('/habits/order', { ids })),
    setDone: (id, date, done) => data(client.put(`/habits/${id}/completions/${date}`, { done })),
};
