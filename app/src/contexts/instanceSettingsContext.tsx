import React, { useState, createContext } from "react";

export const InstanceSettingsContext = createContext<any>(null);

export const InstanceSettingsProvider = (props: any) => {
  const [instanceSettings, setInstanceSettings] = useState([]);

  return (
    <InstanceSettingsContext.Provider value={[instanceSettings, setInstanceSettings]}>
      {props.children}
    </InstanceSettingsContext.Provider>
  );
};
