import { Component } from "react";
import Button from "@material-ui/core/Button";
import { Link } from "react-router-dom";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";

import { http } from "../api";
import { ICaseType } from "../types";

import { toSentence } from "../utils";

interface IProps {}

interface IState {
  caseTypes: ICaseType[];
}

class Home extends Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = { caseTypes: [] };
  }

  async componentDidMount() {
    const caseTypes = await http<ICaseType[]>("/api/v1/case-types");
    this.setState({ caseTypes: caseTypes });
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
            Welcome to CaseFile. For all your {toSentence(this.state.caseTypes.map(caseType => caseType.title))} needs.
          </Typography>
        </Container>
        <Link to="/about">
          <Button variant="contained" color="primary">
            About
          </Button>
        </Link>
      </>
    );
  }
}

export default Home;
