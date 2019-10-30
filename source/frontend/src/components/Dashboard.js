import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';

class Dashboard extends React.Component {
  render() {
    const user = this.props.currentUser;
    if (!!!user) {
      return (<Redirect to="/" />);
    }
    return (
      <h1>{user.first_name}'s Dashboard</h1>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.user.currentUser
});

const connectedComponent = withRouter(connect(mapStateToProps, {})(Dashboard));

export default connectedComponent;