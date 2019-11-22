import axios from "axios";

// axios.defaults.baseURL = (process.env.REACT_APP_ENVIRONMENT && process.env.REACT_APP_ENVIRONMENT == "prod") ? 'https://backend.trippplanner.com' : 'http://localhost:8000';

const authAPI = "/members/auth-user/";
const clientId =
  "117123737084-rp4gfof0cf77kqjm65j69upudlefshsj.apps.googleusercontent.com";
const cookiePolicy = "single_host_origin";

const TOKEN_KEY = "tripplanner-user-token";

const handleLoginSuccess = props => async response => {
  const { tokenId } = response;
  const resp = await axios.post(authAPI, {}, { headers: { "Authorization": tokenId } });
  const user = resp.data;
  localStorage.setItem(TOKEN_KEY, user['tokenId']);
  axios.defaults.headers.common["Authorization"] = "Token " + localStorage.getItem(TOKEN_KEY);
  props.setUser(user);
  props.history.push("/dashboard");
};

axios.defaults.headers.common["Authorization"] = localStorage.getItem(TOKEN_KEY) ? "Token " + localStorage.getItem(TOKEN_KEY) : axios.defaults.headers.common["Authorization"];

const handleLogout = props => () => {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem(TOKEN_KEY);
  props.clearUser();
  props.history.push("/");
};

export { handleLoginSuccess, handleLogout, clientId, cookiePolicy, axios };
