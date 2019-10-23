import React from 'react';
import StateStorage from '../StateStorage';

class Dashboard extends React.Component {
  render() {
    const user = StateStorage.getUser();
    return (
      <h1>{user.first_name}'s Dashboard</h1>
    );
  }
}

export default Dashboard;