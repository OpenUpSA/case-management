import logo from "../logo.svg";

import i18next from "i18next";

import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Link } from "react-router-dom";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export default function Page() {
  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        style={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <img src={logo} alt={i18next.t("CaseFile Logo")} />

        <Typography component="h1" variant="h5" style={{ marginTop: 8 }}>
          {i18next.t("Lost")}
        </Typography>
        <p>{i18next.t("Lost message")}</p>
        <Link to="/">
          <Button variant="contained" color="primary">
            {i18next.t("Home")}
          </Button>
        </Link>
      </Box>
    </Container>
  );
}
