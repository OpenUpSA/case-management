import React, { useState, createContext } from "react";

export const CaseOfficesContext = createContext<any>(null);

export const CaseOfficesProvider = (props: any) => {
  const [caseOffices, setCaseOffices] = useState([]);

  return (
    <CaseOfficesContext.Provider value={[caseOffices, setCaseOffices]}>
      {props.children}
    </CaseOfficesContext.Provider>
  );
};
