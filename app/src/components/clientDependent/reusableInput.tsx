import { useState } from "react";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { useStyles } from "../../utils";
import i18n from "../../i18n";
import { BlackTooltip } from "../general/tooltip";

type Props = {
  value: any;
  setClientDependent: any;
  prevValue: any;
  title: string;
  inputName: string;
  editClientDependentInput: any;
  type?: string;
};

export default function ReusableInput(props: Props) {
  const classes = useStyles();
  const [showButton, setShowButton] = useState<boolean>(false);

  return (
    <FormControl fullWidth size="small">
      <InputLabel
        className={classes.clientDetailLabel}
        htmlFor={props.title}
        shrink={true}
      >
        {i18n.t(props.title)}:
      </InputLabel>
      <Input
        id={props.title}
        type={props.type || "text"}
        name={props.inputName}
        disableUnderline={true}
        disabled={false}
        className={classes.clientDetailInput}
        aria-describedby="my-helper-text"
        value={props.value}
        onClick={() => (!showButton ? setShowButton(true) : null)}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          props.setClientDependent((clientDependent: any) => ({
            ...clientDependent,
            [props.inputName]: e.target.value,
          }));
        }}
        endAdornment={
          showButton ? (
            <InputAdornment position="end" sx={{ marginBottom: "4px" }}>
              <BlackTooltip title="Discard changes" arrow placement="top">
                <IconButton
                  aria-label="delete icon"
                  edge="end"
                  onClick={() => {
                    setShowButton(false);
                    props.setClientDependent((clientDependent: any) => ({
                      ...clientDependent,
                      [props.inputName]: props.prevValue,
                    }));
                  }}
                >
                  {<DeleteIcon sx={{ color: "#a9a9a9" }} />}
                </IconButton>
              </BlackTooltip>
              <BlackTooltip title="Save changes" arrow placement="top">
                <IconButton
                  style={{
                    backgroundColor: "#00d97e",
                    borderRadius: 5,
                    marginLeft: 12,
                  }}
                  aria-label="check icon"
                  edge="end"
                  onClick={(e) => {
                    props.editClientDependentInput();
                    setShowButton(false);
                  }}
                >
                  {<CheckIcon style={{ color: "#fff" }} />}
                </IconButton>
              </BlackTooltip>
            </InputAdornment>
          ) : null
        }
      />
    </FormControl>
  );
}
