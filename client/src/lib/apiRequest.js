import axios from "axios";


// ye apne server pr api request bhejne ke liye banaya hai 
const apiRequest = axios.create({
  baseURL: "http://localhost:8800/api",
  withCredentials: true,
});
// withCredentials make it complusory to sent cookies in request bcs server requires to do authentication.
export default apiRequest;