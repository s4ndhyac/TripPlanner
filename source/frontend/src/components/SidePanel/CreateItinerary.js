import React from "react";
import { axios } from "../oauth";
import "./style.css";
import TextField from "@material-ui/core/TextField";
import { Button } from "@material-ui/core";


const createItinerary = "http://localhost:8000/itinerary/";

class CreateItinerary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    alert('A new itinerary was created: ' + this.state.value);
    const itinerary = {
      name: this.state.value,
      plan: {},
      group: this.props.group
    }

    axios.post(createItinerary, itinerary)
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
      <div className='CreateItinerary'>
        <TextField
          id="outlined-itinerary-name-input"
          label="New Itinerary Name"
          type="itinerary-name"
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

export default CreateItinerary;