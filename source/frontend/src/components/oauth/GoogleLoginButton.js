import React from "react";
import GoogleLogin from "react-google-login";
import { withRouter, Link } from "react-router-dom";
import { connect } from "react-redux";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

import { handleLoginSuccess, clientId, cookiePolicy } from "./index";
import { setUser } from "../../actions";

class GoogleLoginButton extends React.Component {
  render() {
    const { currentUser } = this.props;
    if (!!currentUser) {
      return (
        <Button variant="contained" color="inherit">
          <Typography variant="h6">
            <Link to="/dashboard" style={{ color: '#000', textDecoration: 'none' }}>Go To Dashboard</Link>
          </Typography>
        </Button>
      );
    }
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


const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});


const connectedComponent = connect(
  mapStateToProps,
  { setUser }
)(GoogleLoginButton);

export default withRouter(connectedComponent);
