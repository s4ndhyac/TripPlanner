import axios from 'axios';

const authAPI = 'http://localhost:8000/members/auth-user/';
const clientId = '117123737084-rp4gfof0cf77kqjm65j69upudlefshsj.apps.googleusercontent.com';
const cookiePolicy = 'single_host_origin';

const handleLoginSuccess = (props) => async (response) => {
  console.log(props);
  const { tokenId } = response;
  axios.defaults.headers.common['Authorization'] = tokenId;
  const resp = await axios.post(authAPI, {})
  const user = resp.data[0].fields;
  user.tokenId = tokenId;
  console.log(user);
  props.history.push('/dashboard');
};

export {
  handleLoginSuccess,
  clientId,
  cookiePolicy
};
