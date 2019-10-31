import React from "react";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { CardContent, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import PersonIcon from "@material-ui/icons/Person";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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

const members = [
  createData("User 1", "user1@gmail.com"),
  createData("User 2", "user2@gmail.com"),
  createData("User 3", "user3@gmail.com"),
  createData("User 4", "user4@gmail.com"),
  createData("User 5", "user5@gmail.com")
];

const top100Films = [
  { title: "The Shawshank Redemption", year: 1994 },
  { title: "The Godfather", year: 1972 },
  { title: "The Godfather: Part II", year: 1974 },
  { title: "The Dark Knight", year: 2008 },
  { title: "12 Angry Men", year: 1957 }
];

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
    const groupData = this.getGroupData(itemId);
    this.setState({
      groupName: groupData.name,
      members: groupData.members
    });
  };

  componentWillReceiveProps(nextProps) {
    if (this.props.itemId !== nextProps.itemId) {
      this.changeState(nextProps);
    }
  }

  getGroupData = id => {
    return {
      name: `Group ${id}`,
      members
    };
  };

  render() {
    const { classes } = this.props;
    const { members, groupName } = this.state;

    const options = top100Films.map(option => {
      const firstLetter = option.title[0].toUpperCase();
      return {
        firstLetter: /[0-9]/.test(firstLetter) ? "0-9" : firstLetter,
        ...option
      };
    });

    return (
      <div>
        <CardContent>
          <Typography variant="h4" component="h2">
            Members - {groupName}
          </Typography>
          <Autocomplete
            options={options.sort(
              (a, b) => -b.firstLetter.localeCompare(a.firstLetter)
            )}
            groupBy={option => option.firstLetter}
            getOptionLabel={option => option.title}
            style={{ width: 300 }}
            renderInput={params => (
              <TextField {...params} label="" variant="outlined" fullWidth />
            )}
          />
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
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      <PersonIcon></PersonIcon>
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell>{row.email}</TableCell>
                    <TableCell>
                      <Button size="small">Remove</Button>
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
