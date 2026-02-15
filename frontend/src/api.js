import axios from "axios";

const api = axios.create({
  // This is your live Railway link you provided
  baseURL: "https://librarybackend-production-bf00.up.railway.app",
});

export default api;