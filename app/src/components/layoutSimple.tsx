import { Component, ReactNode } from "react";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Box from "@material-ui/core/Box";
import { Grid } from "@material-ui/core";

type Props = {
  children: ReactNode;
};

export class LayoutSimple extends Component<Props> {
  render() {
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justifyContent="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item>
            <Box
              style={{
                marginTop: 8,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {this.props.children}
            </Box>
          </Grid>
        </Grid>
      </Container>
    );
  }
}

export default LayoutSimple;
