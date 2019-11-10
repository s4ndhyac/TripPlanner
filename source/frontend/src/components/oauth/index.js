import axios from "axios";

const authAPI = "http://localhost:8000/members/auth-user/";
const clientId =
  "117123737084-rp4gfof0cf77kqjm65j69upudlefshsj.apps.googleusercontent.com";
const cookiePolicy = "single_host_origin";

const TOKEN_KEY = "tripplanner-user-token";

axios.defaults.headers.common["Authorization"] =
  localStorage.getItem(TOKEN_KEY) || "";

const handleLoginSuccess = props => async response => {
  const { tokenId } = response;
  axios.defaults.headers.common["Authorization"] = tokenId;
  localStorage.setItem(TOKEN_KEY, tokenId);
  const resp = await axios.post(authAPI, {});
  const user = resp.data[0].fields;
  user.tokenId = tokenId;
  user.id = resp.data[0].pk;
  props.setUser(user);
  props.history.push("/dashboard");
};

const handleLogout = props => () => {
  axios.defaults.headers.common["Authorization"] = "";
  localStorage.removeItem(TOKEN_KEY);
  props.clearUser();
  props.history.push("/");
};

export { handleLoginSuccess, handleLogout, clientId, cookiePolicy, axios };
