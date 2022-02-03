import * as React from 'react';
import Switch from '@mui/material/Switch';

type Props = {
    checked: boolean;
    setChecked: (checked: boolean) => void;
};

export default function Toggle(props: Props) {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setChecked(!props.checked);
  };

  return (
    <Switch
      checked={props.checked}
      onChange={handleChange}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  );
}
