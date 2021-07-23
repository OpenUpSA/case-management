import logo from "../logo-small.svg";
import React from "react";
import { IconButton } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import PeopleIcon from "@material-ui/icons/People";
import FolderIcon from "@material-ui/icons/Folder";
import ForumIcon from "@material-ui/icons/Forum";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import i18n from "../i18n";
import { UserInfo } from "../auth";
import { useStyles } from "../utils";

const Component = () => {
  const history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const closeDrawer = () => {
    if (open) {
      setOpen(false);
    }
  };

  const logout = () => {
    const userInfo = UserInfo.getInstance();
    userInfo.clear();
    history.push("/");
    closeDrawer();
  };

  return (
    <div>
      <AppBar
        position="fixed"
        color="secondary"
        elevation={1}
        className={classes.appBar}
      >
        <Container maxWidth="md">
          <Toolbar disableGutters={true}>
            <Box display="flex" flexGrow={1}>
              <img
                className={classes.cursorPointer}
                src={logo}
                alt={i18n.t("CaseFile Logo")}
                onClick={() => {
                  history.push("/");
                  closeDrawer();
                }}
              />
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              {open ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        ModalProps={{
          onBackdropClick: closeDrawer,
        }}
        open={open}
        elevation={1}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <List>
            <ListItem
              button
              key="clients"
              onClick={() => {
                history.push("/clients");
                closeDrawer();
              }}
            >
              <ListItemIcon>
                <PeopleIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Client list")} />
            </ListItem>
            <ListItem
              button
              key="cases"
              onClick={() => {
                history.push("/cases");
                closeDrawer();
              }}
            >
              <ListItemIcon>
                <FolderIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Case list")} />
            </ListItem>
            <ListItem
              button
              key="meetings"
              onClick={() => {
                history.push("/meetings");
                closeDrawer();
              }}
            >
              <ListItemIcon>
                <ForumIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("All meetings")} />
            </ListItem>
          </List>
          <List className={classes.drawerListFooter}>
            <ListItem button key="meetings" onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Logout")} />
            </ListItem>
            <ListItem style={{ color: "#9e9e9e" }}>
              {i18n.t("© 2021 OpenUp")}
            </ListItem>
          </List>
        </div>
      </Drawer>
    </div>
  );
};

export default Component;
