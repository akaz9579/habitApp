import axios from 'axios';

const client = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
});

const data = (request) => request.then((res) => res.data);

export const api = {
    list: () => data(client.get('/habits')),
    create: (habit) => data(client.post('/habits', habit)),
    update: (id, patch) => data(client.patch(`/habits/${id}`, patch)),
    remove: (id) => data(client.delete(`/habits/${id}`)),
    reorder: (ids) => data(client.put('/habits/order', { ids })),
    setDone:(id, date, done) => data(client.put(`/habits/${id}/completions/${date}`, { done })),
};
