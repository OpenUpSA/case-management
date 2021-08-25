import { red } from "@material-ui/core/colors";
import { createTheme } from "@material-ui/core/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#556cd6",
    },
    secondary: {
      main: "#ffffff",
    },
    error: {
      main: red.A400,
    },
    background: {
      default: "#fafafa",
    },
  },
});

theme.shadows[1] = "0px 2px 1px -1px rgba(0,0,0,0.05),0px 1px 1px 0px rgba(0,0,0,0.03),0px 1px 3px 0px rgba(0,0,0,0.01)";

export default theme;
