import InputLabel from "@material-ui/core/InputLabel";
import { Input, MenuItem } from "@material-ui/core";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import FormControl from "@material-ui/core/FormControl";
import { useStyles } from "../../utils";
import i18n from "../../i18n";

type Props = {
  value: any;
  setClientDependent: any;
  title: string;
  menuItems: string[][];
  inputName: string;
  editClientDependentSelect: any;
};

function ReusableSelect(props: Props) {
  const classes = useStyles();
  return (
    <FormControl fullWidth size="small">
      <InputLabel className={classes.clientDetailLabel} htmlFor="date" shrink={true}>
        {i18n.t(props.title)}:
      </InputLabel>
      <Select
        id="select"
        disableUnderline
        className={classes.clientDetailSelect}
        name={props.inputName}
        input={<Input />}
        value={props.value}
        onChange={(e: SelectChangeEvent<HTMLInputElement>) => {
          props.setClientDependent((clientDependent: any) => ({
            ...clientDependent,
            [props.inputName]: e.target.value,
          }));
            props.editClientDependentSelect(e.target.value as any, props.inputName);
        }}
        renderValue={() => {
          return props.menuItems
            .filter((item) => item[0] === props.value)
            .map((item) => {
              return item.length > 1 ? item[1] : item[0];
            });
        }}
      >
        {props.menuItems.map((item) => (
          <MenuItem key={item[0]} value={item[0]}>
            {item.length > 1 ? item[1] : item[0]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}

export default ReusableSelect;
