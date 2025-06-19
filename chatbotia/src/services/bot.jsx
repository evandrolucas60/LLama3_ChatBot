import axios from 'axios';

// Configuração inicial do Axios
const axiosConfig = axios.create({
    baseURL: 'http://localhost:3000', // Base URL da API 
});

export default axiosConfig