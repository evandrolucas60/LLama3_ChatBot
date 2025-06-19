import axios from 'axios';

// Configuração inicial do Axios
const axiosConfig = axios.create({
    //baseURL: 'http://10.11.10.5:30/', // Base URL da API 
    baseURL: 'http://localhost:3000', // Base URL da API 
});

export default axiosConfig