import React from 'react';
import GoogleLogin from 'react-google-login';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import { handleLoginSuccess, clientId, cookiePolicy } from './index';
import { setUser } from '../../actions';

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

const connectedComponent = connect(null, { setUser })(GoogleLoginButton);

export default withRouter(connectedComponent);
