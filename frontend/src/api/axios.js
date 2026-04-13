import axios from "axios";

const API = axios.create({

  baseURL: "https://bank-transaction-system-whns.onrender.com/api"

});

API.interceptors.request.use((req) => {

  const token = localStorage.getItem("token");

  // Do not attach Authorization header for auth endpoints (login/register)
  if (token && !req.url.includes('/auth')) {
    req.headers.Authorization = `Bearer ${token}`;
  }

  return req;

});

export default API;