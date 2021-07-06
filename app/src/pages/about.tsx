import { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { http } from "../api";
import { ICaseOffice } from "../types";

import { toSentence } from "../utils";

interface IProps {}

interface IState {
  caseOffices: ICaseOffice[];
}

class About extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { caseOffices: [] };
  }

  async componentDidMount() {
    const caseOffices = await http<ICaseOffice[]>("/api/v1/case-offices");
    this.setState({ caseOffices: caseOffices });
  }
  render() {
    return (
      <>
        <Container maxWidth="sm">
          <Typography
            variant="body2"
            color="textPrimary"
            align="center"
            gutterBottom
          >
            A client-side browser app for the OSF Case Management project built
            by OpenUp. Serving the {toSentence(this.state.caseOffices.map(caseOffice => caseOffice.name))} community case offices.
          </Typography>
        </Container>
        <Link to="/">
          <Button variant="contained" color="primary">
            Home
          </Button>
        </Link>
      </>
    );
  }
}

export default About;
