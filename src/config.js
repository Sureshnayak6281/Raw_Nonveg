
const config = {
    API_URL: process.env.NODE_ENV === 'production'
      ? 'https://raw-nonveg-server-2.onrender.com' 
      : 'http://localhost:5000'
  };
  
  export default config;