import axios from 'axios';

const instance = axios.create({
    baseURL: ' https://tinder-backend-indu.herokuapp.com',
});

export default instance;