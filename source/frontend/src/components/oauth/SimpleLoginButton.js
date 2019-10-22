import React from 'react';
import Button from '@material-ui/core/Button';
import GoogleLogin from 'react-google-login';
import { withRouter } from 'react-router-dom';
import { handleLoginSuccess, clientId, cookiePolicy } from './index';

class SimpleLoginButton extends React.Component {
  render() {
    return (
      <GoogleLogin
        clientId={clientId}
        render={renderProps => (
          <Button onClick={renderProps.onClick} disabled={renderProps.disabled} color="inherit">Login</Button>
        )}
        onSuccess={handleLoginSuccess(this.props)}
        onFailure={console.error}
        cookiePolicy={cookiePolicy}
      />
    );
  }
}

export default withRouter(SimpleLoginButton);
