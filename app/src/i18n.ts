import i18n from "i18next";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
const resources = {
  en: {
    translation: {
      Login: "Login",
      "Email Address": "Email Address",
      Password: "Password",
      "Forgot password": "Forgot your password?",
      "CaseFile Logo": "CaseFile Logo",
      "Lost": "Lost?",
      "Lost message": "We can't find what you are looking for.",
      "Legal Cases": "Cases",
      "New legal case": "New case",
      "New client": "Add new client",
      "New client dependent": "Add new dependent",
      "Legal Case": "Case",
      "Case Number": "Case Number",
      "Welcome to CaseFile": "Welcome to CaseFile.",
      "Login error": "Invalid email or password, please try again.",
      "© 2021 OpenUp": "© 2021 OpenUp.",
      "Error saving account details": "There was an error saving your details.",
      "Logs list": "All history",
      "Logs": "Updates",
      "Log": "Update",
    },
  },
  fr: {
    translation: {
      Login: "Connexion",
    },
  },
};

i18n
  .init({
    resources,
    lng: "en", // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    missingKeyHandler: function (lng: any, ns: any, key: any, fallbackValue: any) {
      console.log('missing');
      console.log({ lng });
    },

    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
