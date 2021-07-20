import withWidth from '@material-ui/core/withWidth';
import logo from "../logo-small.svg";
import React, { ReactNode } from "react";
import { IconButton } from "@material-ui/core";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Box from "@material-ui/core/Box";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import List from "@material-ui/core/List";
import Container from "@material-ui/core/Container";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

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
import { Tokens } from "../auth";
import { useStyles } from "../utils";

type Props = {
  children: ReactNode;
};

const Layout = (props: Props) => {
  let history = useHistory();
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const logout = () => {
    const tokens = Tokens.getInstance();
    tokens.clear();
    history.push("/");
  };

  return (
    <div>
      <CssBaseline />
      <AppBar
        position="fixed"
        color="secondary"
        elevation={1}
        className={classes.appBar}
      >
        <Container maxWidth="md">
          <Toolbar disableGutters={true}>
            <Box display="flex" flexGrow={1}>
              <Link to="/">
                <img src={logo} alt={i18n.t("CaseFile Logo")} />
              </Link>
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
          onBackdropClick: toggleDrawer,
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
              }}
            >
              <ListItemIcon>
                <PeopleIcon style={{color: "black"}} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Client list")} />
            </ListItem>
            <ListItem
              button
              key="cases"
              onClick={() => {
                history.push("/cases");
              }}
            >
              <ListItemIcon>
                <FolderIcon style={{color: "black"}} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Case list")} />
            </ListItem>
            <ListItem
              button
              key="meetings"
              onClick={() => {
                history.push("/meetings");
              }}
            >
              <ListItemIcon>
                <ForumIcon style={{color: "black"}} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("All meetings")} />
            </ListItem>
          </List>
          <List className={classes.drawerListFooter}>
            <ListItem button key="meetings" onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon style={{color: "black"}} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Logout")} />
            </ListItem>
            <ListItem style={{ color: "#9e9e9e" }}>
              {i18n.t("© 2021 OpenUp")}
            </ListItem>
          </List>
        </div>
      </Drawer>
      <div>{props.children}</div>
    </div>
  );
}

export default withWidth()(Layout);