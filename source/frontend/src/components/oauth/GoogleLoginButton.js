import React from 'react';
import GoogleLogin from 'react-google-login';
import { withRouter } from 'react-router-dom';
import { handleLoginSuccess, clientId, cookiePolicy } from './index';

class GoogleLoginButton extends React.Component {
  render() {
    return (
      <GoogleLogin
        clientId={clientId}
        buttonText="Join Now with Google!"
        onSuccess={handleLoginSuccess(this.props)}
        onFailure={console.error}
        cookiePolicy={cookiePolicy}
      />
    );
  }
}

export default withRouter(GoogleLoginButton);
