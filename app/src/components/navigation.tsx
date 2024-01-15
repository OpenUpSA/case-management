import logo from "../logo-small.svg";
import userDefaultAvatar from "../user-default-avatar.jpeg";
import React, { useEffect, useContext } from "react";
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

import SettingsIcon from "@material-ui/icons/Settings";
import PeopleIcon from "@material-ui/icons/People";
import FolderIcon from "@material-ui/icons/Folder";
import ForumIcon from "@material-ui/icons/Forum";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import i18n from "../i18n";
import { UserInfo } from "../auth";
import { useStyles } from "../utils";
import { ICaseOffice, IInstance } from "../types";
import {
  getCaseOffices,
  getCaseTypes,
  getLanguages,
  getInstanceSettings,
} from "../api";
import { CaseOfficesContext } from "../contexts/caseOfficesContext";
import { CaseTypesContext } from "../contexts/caseTypesContext";
import { LanguagesContext } from "../contexts/languagesContext";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";

const Component = () => {
  useEffect(() => {
    async function fetchData() {
      const dataInstanceSettings = await getInstanceSettings();
      const dataCaseOffices = await getCaseOffices();
      const dataCaseTypes = await getCaseTypes();
      const dataLanguages = await getLanguages();
      setContextOffices(dataCaseOffices);
      setContextCaseTypes(dataCaseTypes);
      setContextLanguages(dataLanguages);
      setInstanceSettings(dataInstanceSettings);
    }
    const userInfo = UserInfo.getInstance();
    const token = userInfo.getAccessToken();
    if (token) {
      fetchData();
    }
    // eslint-disable-next-line
  }, []);

  const history = useHistory();
  const classes = useStyles();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [instanceSettings, setInstanceSettings] = React.useState<IInstance>();
  // eslint-disable-next-line
  const [contextOffices, setContextOffices] = useContext(CaseOfficesContext);
  // eslint-disable-next-line
  const [contextCaseTypes, setContextCaseTypes] = useContext(CaseTypesContext);
  // eslint-disable-next-line
  const [contextLanguages, setContextLanguages] = useContext(LanguagesContext);

  const userInfo = UserInfo.getInstance();
  const userId = Number(userInfo.getUserId());
  const name = userInfo.getName();
  const email = userInfo.getEmail();
  const instanceName = null;
  const case_office = Number(userInfo.getCaseOffice());

  const filteredCaseOffice = contextOffices
    ?.filter((caseOffice: ICaseOffice) => case_office === caseOffice.id)
    .map((caseOffice: ICaseOffice) => caseOffice.name)
    .join(", ");

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  const closeDrawer = () => {
    if (drawerOpen) {
      setDrawerOpen(false);
    }
  };

  const logout = () => {
    closeDrawer();
    history.push("/logout");
  };

  const accountSettings = () => {
    history.push(`/users/${userId}`);
    closeDrawer();
  };

  if (userId === -1) {
    logout();
  }

  const goHome = () => {
    closeDrawer();
    history.push("/");
  };

  return (
    <div>
      <AppBar
        position="fixed"
        color="secondary"
        elevation={1}
        className={classes.customAppBar}
      >
        <Container maxWidth="md">
          <Toolbar disableGutters={true}>
            <Box display="flex" flexGrow={1}>
              <img
                className={classes.logo}
                src={logo}
                alt={i18n.t("CaseFile Logo")}
                onClick={goHome}
              />
            </Box>
            <Box
              className={classes.navbarUserContext}
              sx={{
                display: "flex",
                flexDirection: "row",
                p: 1,
                m: 1,
                pl: 0,
                pr: 0,
                ml: 0,
                mr: 0,
                bgcolor: "background.paper",
                borderRadius: 0,
              }}
            >
              {instanceSettings &&
                typeof instanceSettings.name !== "undefined" && (
                  <Box>
                    <img
                      className={classes.logoCustom}
                      src={instanceSettings.logo_url}
                      onClick={goHome}
                      alt={instanceSettings.name}
                    />
                  </Box>
                )}
              <Box>
                <p
                  className={classes.navbarUserName}
                  title={name || email || ""}
                >
                  {name || email}
                </p>
                <p className={classes.navbarInstanceAndOffice}>
                  <span
                    className={classes.navbarOfficeName}
                    title={filteredCaseOffice}
                  >
                    {filteredCaseOffice}
                  </span>
                  {instanceSettings &&
                    typeof instanceSettings.name !== "undefined" && (
                      <span
                        className={classes.navbarInstanceName}
                        title={instanceSettings.name}
                      >
                        ({instanceSettings.name})
                      </span>
                    )}
                </p>
              </Box>
            </Box>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer}
            >
              {drawerOpen ? <CloseIcon /> : <MenuIcon />}
            </IconButton>
          </Toolbar>
        </Container>
      </AppBar>
      <Drawer
        variant="temporary"
        onClose={closeDrawer}
        open={drawerOpen}
        elevation={1}
        className={classes.drawer}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Toolbar />
        <div className={classes.drawerContainer}>
          <Card onClick={accountSettings}>
            <CardActionArea className={classes.root}>
              <CardMedia
                className={classes.media}
                image={userDefaultAvatar}
                title={i18n.t("Default user avatar")}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  variant="h5"
                  className={classes.cardUserName}
                >
                  {name || email}
                </Typography>
                {filteredCaseOffice ? (
                  <Typography color="textSecondary">
                    Case worker at{" "}
                    <Typography
                      display="inline"
                      component={"span"}
                      className={classes.userCaseOffice}
                    >
                      {filteredCaseOffice}
                    </Typography>
                  </Typography>
                ) : null}
              </CardContent>
            </CardActionArea>
          </Card>

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
            <ListItem button key="accountSettings" onClick={accountSettings}>
              <ListItemIcon>
                <SettingsIcon style={{ color: "black" }} />
              </ListItemIcon>
              <ListItemText primary={i18n.t("Account settings")} />
            </ListItem>
            <ListItem button key="logout" onClick={logout}>
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
