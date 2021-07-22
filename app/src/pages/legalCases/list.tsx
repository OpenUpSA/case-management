import React, { useEffect } from "react";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import { Breadcrumbs, Container, Button, Grid } from "@material-ui/core";
import PersonIcon from "@material-ui/icons/Person";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import Layout from "../../components/layout";
import { getLegalCases } from "../../api";
import { ILegalCase } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";
import MoreMenu from "../../components/moreMenu";

import LegalCasesTable from "../../components/legalCase/table";

const Page = () => {
  RedirectIfNotLoggedIn();
  const classes = useStyles();
  const [legalCases, setLegalCases] = React.useState<ILegalCase[]>();

  useEffect(() => {
    async function fetchData() {
      const dataLegalCases = await getLegalCases();
      setLegalCases(dataLegalCases);
    }
    fetchData();
  }, []);

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
            <PersonIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Case list")}</strong>
            </Typography>
          </Grid>
          <Grid item>
            <MoreMenu></MoreMenu>
          </Grid>
          <Grid item className={classes.zeroWidthOnMobile}>
            <Button
              className={classes.canBeFab}
              color="primary"
              variant="contained"
              startIcon={<CreateNewFolderIcon />}
            >
              {i18n.t("New case")}
            </Button>
          </Grid>
        </Grid>

        <Grid container direction="row" spacing={2} alignItems="center">
          <Grid item style={{ flexGrow: 1 }}>
            <strong>
              {legalCases ? legalCases.length : "0"} {i18n.t("Cases")}
            </strong>
          </Grid>
        </Grid>

        <LegalCasesTable legalCases={legalCases} />
      </Container>
    </Layout>
  );
};

export default Page;
