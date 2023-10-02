import React, { useState, createContext } from "react";

export const LanguagesContext = createContext<any>(null);

export const LanguagesProvider = (props: any) => {
  const [languages, setLanguages] = useState([]);

  return (
    <LanguagesContext.Provider value={[languages, setLanguages]}>
      {props.children}
    </LanguagesContext.Provider>
  );
};
