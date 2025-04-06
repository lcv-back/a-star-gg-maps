import axios from 'axios';

export const fetchPath = async(origin, destination) => {
    const res = await axios.post('http://localhost:5000/api/path', {
        origin,
        destination,
    });
    return res.data;
};