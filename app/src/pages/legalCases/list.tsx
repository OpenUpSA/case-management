import React, { useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Container, Grid } from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";

import i18n from "../../i18n";
import Layout from "../../components/layout";
import { getLegalCases } from "../../api";
import { ILegalCase, LocationState, SnackbarState } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import LegalCasesTable from "../../components/legalCase/table";
import SnackbarAlert from "../../components/general/snackBar";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation<LocationState>();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();
  const [showSnackbar, setShowSnackbar] = React.useState<SnackbarState>({
    open: location.state?.open!,
    message: location.state?.message!,
    severity: location.state?.severity!,
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const dataLegalCases = await getLegalCases();
        setLegalCases(dataLegalCases);
      } catch (e) {
        setShowSnackbar({
          open: true,
          message: "Case list cannot be loaded",
          severity: "error",
        });
      }
    }
    fetchData();
  }, []);

  // set location.state?.open! to false on page load
  useEffect(() => {
    history.push({ state: { open: false } });
  }, [history]);

  useEffect(() => {
    const resetState = async () => {
      setTimeout(() => {
        setShowSnackbar({
          open: false,
          message: "",
          severity: undefined,
        });
      }, 6000);
    };
    resetState();
  }, [showSnackbar.open]);

  return (
    <Layout>
      <Breadcrumbs className={classes.breadcrumbs} aria-label="breadcrumb">
        <div>{i18n.t("Case list")}</div>
      </Breadcrumbs>

      <Container maxWidth="md">
        <Grid
          className={classes.pageBar}
          container
          direction="row"
          spacing={2}
          alignItems="center"
        >
          <Grid item>
            <FolderIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Case list")}</strong>
            </Typography>
          </Grid>
        </Grid>
        <LegalCasesTable legalCases={legalCases ? legalCases : []} />
      </Container>
      {showSnackbar.open && (
        <SnackbarAlert
          open={showSnackbar.open}
          message={showSnackbar.message ? showSnackbar.message : ""}
          severity={showSnackbar.severity}
        />
      )}
    </Layout>
  );
};

export default Page;
