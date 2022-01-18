import React, { useState, createContext } from "react";

export const CaseTypesContext = createContext<any>(null);

export const CaseTypesProvider = (props: any) => {
  const [caseTypes, setCaseTypes] = useState([]);

  return (
    <CaseTypesContext.Provider value={[caseTypes, setCaseTypes]}>
      {props.children}
    </CaseTypesContext.Provider>
  );
};
