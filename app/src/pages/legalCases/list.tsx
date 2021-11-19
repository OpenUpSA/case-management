import React, { useEffect } from "react";
import i18n from "../../i18n";
import Typography from "@material-ui/core/Typography";
import {
  Breadcrumbs,
  Container,
  Button,
  Grid,
} from "@material-ui/core";
import FolderIcon from "@material-ui/icons/Folder";
import CreateNewFolderIcon from "@material-ui/icons/CreateNewFolder";

import Layout from "../../components/layout";
import { getLegalCases } from "../../api";
import { ILegalCase } from "../../types";
import { useStyles } from "../../utils";
import { RedirectIfNotLoggedIn } from "../../auth";

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
            <FolderIcon color="primary" style={{ display: "flex" }} />
          </Grid>
          <Grid item style={{ flexGrow: 1 }}>
            <Typography variant="h6">
              <strong>{i18n.t("Case list")}</strong>
            </Typography>
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

        <LegalCasesTable legalCases={legalCases ? legalCases : []} />
      </Container>
    </Layout>
  );
};

export default Page;
