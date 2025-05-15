import axios from 'axios';

export async function getUserToken() {
  const response = await axios.post('http://localhost:3003/api/auth/login', {
    email: 'res@gmail.com',
    password: 'resadmin'
  });

  return response.data.token;
}
