import React from "react";
import { axios } from "../oauth";
import "./style.css";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";


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
        <TextField
          id="outlined-group-name-input"
          label="New Group Name"
          type="group-name"
          margin="normal"
          variant="outlined"
          value={this.state.value} onChange={this.handleChange}
        />
        <Button
          color="primary"
          onClick={this.handleSubmit}
        >
          Submit
      </Button>
      </div>
    );
  }
}

export default Creategroup;