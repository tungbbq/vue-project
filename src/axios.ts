import axios from 'axios';

// Create an instance of Axios with a base URL
const instance = axios.create({
  baseURL: 'https://myproject.ddev.site', 
});

export default instance;