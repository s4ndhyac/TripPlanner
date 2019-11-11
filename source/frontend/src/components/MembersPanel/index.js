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

const createData = (name, email) => {
  return { name, email };
};

const members = [];


class MembersPanel extends React.Component {
  state = {
    groupName: "",
    members: []
  };

  componentWillMount() {
    this.changeState(this.props);
  }

  changeState = props => {
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

  render() {
    const { classes } = this.props;
    const { members, groupName } = this.state;
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
              />
            </Grid>
            <Button
              color="primary"
              className={classes.button}
              endIcon={<Icon>send</Icon>}
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
                      <Button size="small" variant="outlined" color="secondary">
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
