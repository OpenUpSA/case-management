import i18next from "i18next";
import { Component, ReactNode } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import logo from "../logo.svg";

type Props = {
  children: ReactNode;
};

export class LayoutSimple extends Component<Props> {
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          style={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <img src={logo} alt={i18next.t("CaseFile Logo")} />
          {this.props.children}
        </Box>
      </Container>
    );
  }
}

export default LayoutSimple;
