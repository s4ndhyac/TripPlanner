import axios from "axios";

const authAPI = "http://localhost:8000/members/auth-user/";
const clientId =
  "117123737084-rp4gfof0cf77kqjm65j69upudlefshsj.apps.googleusercontent.com";
const cookiePolicy = "single_host_origin";

const TOKEN_KEY = "tripplanner-user-token";

const handleLoginSuccess = props => async response => {
  const { tokenId } = response;
  const resp = await axios.post(authAPI, {}, { headers: { "Authorization": tokenId } });
  const user = resp.data;
  localStorage.setItem(TOKEN_KEY, user['tokenId']);
  props.setUser(user);
  props.history.push("/dashboard");
};

axios.defaults.headers.common["Authorization"] = localStorage.getItem(TOKEN_KEY) ? ("Token " + localStorage.getItem(TOKEN_KEY)) : "";

const handleLogout = props => () => {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem(TOKEN_KEY);
  props.clearUser();
  props.history.push("/");
};

export { handleLoginSuccess, handleLogout, clientId, cookiePolicy, axios };
