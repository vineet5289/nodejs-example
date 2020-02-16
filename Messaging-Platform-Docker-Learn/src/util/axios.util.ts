import axios from 'axios';

const instance = axios.create({
  baseURL:
    process.env.CONNECT_API_URL ||
     'https://dev-connect-api.azurewebsites.net/api/v1',
  // 'http://localhost:8080/api/v1',
  timeout: 300000, //  in miliseconds (5 min)
});

export default instance;
