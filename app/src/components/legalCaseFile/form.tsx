import { Grid, InputAdornment } from "@material-ui/core";

import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import i18n from "../../i18n";
import { ILegalCaseFile } from "../../types";
import { useStyles } from "../../utils";

type Props = {
  legalCaseFile: ILegalCaseFile;
  setLegalCaseFile: (legalCaseFile: ILegalCaseFile) => void;
};

const Component = (props: Props) => {
  const classes = useStyles();

  return (
    <div>
      <Grid
        className={classes.pageBar}
        container
        direction="row"
        spacing={2}
        alignItems="center"
      >
        <Grid item xs={12} md={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="upload_file_name"
              shrink={true}
            >
              {i18n.t("File name")}:
            </InputLabel>
            <Input
              disabled
              id="upload_file_name"
              autoFocus
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="Input file name"
              value={props.legalCaseFile.upload_file_name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseFile({
                  ...props.legalCaseFile,
                  upload_file_name: e.target.value,
                });
              }}
            />
            <small className={classes.hugUp}>
              {i18n.t("*File name cannot be changed")}
            </small>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={12}>
          <FormControl fullWidth size="small">
            <InputLabel
              className={classes.inputLabel}
              htmlFor="description"
              shrink={true}
            >
              {i18n.t("Description")}:
            </InputLabel>
            <Input
              id="description"
              multiline
              rows={5}
              autoFocus
              disableUnderline={true}
              className={classes.textField}
              aria-describedby="Input description"
              value={props.legalCaseFile.description}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                props.setLegalCaseFile({
                  ...props.legalCaseFile,
                  description: e.target.value,
                });
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </div>
  );
};

Component.defaultProps = {};

export default Component;
