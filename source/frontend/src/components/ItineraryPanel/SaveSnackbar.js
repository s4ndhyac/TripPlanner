import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";

class SaveSnackbar extends React.Component {
  render() {
    const { open, message, handleCloseOnClick } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={2000}
        onClose={handleCloseOnClick}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{message}</span>}
        action={[
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={handleCloseOnClick}
          >
            <CloseIcon />
          </IconButton>
        ]}
      />
    );
  }
}

export default SaveSnackbar;
