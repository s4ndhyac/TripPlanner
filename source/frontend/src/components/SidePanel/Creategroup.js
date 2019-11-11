import React from "react";
import { axios } from "../oauth";
import "./style.css";

const groupAPI = "http://localhost:8000/members/addGroup/";

class Creategroup extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A new group was created: ' + this.state.value);
    const user = {
      name: this.state.value,
      email: this.props.user.email
    }

    axios.post(groupAPI, user)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
    event.preventDefault();
  }

  render() {
    return (
      <div className='Creategroup'>
        <form onSubmit={this.handleSubmit}>
          <label>
            New Group Name:
                <input type="text" value={this.state.value} onChange={this.handleChange} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default Creategroup;