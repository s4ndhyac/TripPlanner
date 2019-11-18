import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { CardContent, Typography, Button, Grid } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import TextField from "@material-ui/core/TextField";
import Icon from '@material-ui/core/Icon';
import { axios } from "../oauth";

const styles = () => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  table: {
    minWidth: 650
  }
});


class MembersPanel extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      groupName: "",
      members: [],
      inviteEmail: ""
    };

    this._handleInviteEmail = this._handleInviteEmail.bind(this);
    this.inviteMember = this.inviteMember.bind(this);
  }

  componentWillMount() {
    this.changeState(this.props);
  }

  changeState = props => {
    console.log(props)
    const { itemId } = props;
    this.getGroupData(itemId);
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      this.changeState(nextProps);
    }
  }

  getGroupData = id => {
    axios.get("http://localhost:8000/members/v1/usergroup/?group_id=" + id)
      .then(res => {
        const users = res.data;
        this.setState({
          groupName: users[0].group.name,
          members: users
        });
      })
  };

  _handleInviteEmail(event) {
    this.setState({
      inviteEmail: event.target.value
    });
  }

  inviteMember(event) {
    console.log("Invite member via email: ", this.state.inviteEmail);
    const data = {
      email: this.state.inviteEmail,
      groupName: this.state.groupName
    };

    axios.post("http://localhost:8000/members/inviteMember/", data)
      .then(res => {
        console.log(res);
        alert(res.data);
      })
  };

  deleteMember(event) {
    console.log("Delete member: ", this);

    const data = {
      id: this.id,
      group: this.group,
      user: this.user 
    }
    
    axios.post("http://localhost:8000/members/deleteMember/", data)
      .then(res => {
        console.log(res);
        alert(res.data);
      })
  };

  render() {
    const { classes } = this.props;
    const { members, groupName, inviteEmail } = this.state;
    return (
      <div>
        <CardContent>
          <Typography variant="h5" component="h5">
            Members - {groupName}
          </Typography>
          <Grid
            container
            spacing={1}
            direction="row"
          >
            <Grid item >
              <TextField
                id="outlined-emailid-input"
                label="Enter Email to Invite User"
                className={classes.textField}
                type="emailid"
                margin="normal"
                variant="outlined"
                style={{ width: 400 }}
                value={this.state.inviteEmail}
                onChange={this._handleInviteEmail}
              />
            </Grid>
            <Button
              color="primary"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
              onClick={this.inviteMember.bind(this.inviteEmail)}
            >
              Invite
            </Button>
          </Grid>

          <br />
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {members.map(row => (
                  <TableRow key={row.user.first_name + " " + row.user.last_name}>
                    <TableCell component="th" scope="row">
                      <PersonIcon></PersonIcon>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.user.first_name + " " + row.user.last_name}
                    </TableCell>
                    <TableCell>{row.user.email}</TableCell>
                    <TableCell>
                      <Button size="small" variant="outlined" color="secondary" onClick={this.deleteMember.bind(row)}>
                        Remove
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        </CardContent>
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(MembersPanel);
