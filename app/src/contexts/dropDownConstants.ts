import { countries, CountryType } from "../countries";

const countryLabels: string[][] = countries.map((country: CountryType) => [
  country.code,
  country.label,
]);

export const constants = {
  officialIdentifierTypes: [
    ["National", "National Identity Number"],
    ["Passport", "Passport Number"],
    ["RefugeePassport", "Refugee Passport ID Number"],
    ["Section22AsylymSeekerVisa", "Section 22 Asylym Seeker Visa ID Number"],
    ["Section24RefugeePermit", "Section 24 Refugee Permit File Number"],
  ],
  provinces: [
    ["EasternCape", "Eastern Cape"],
    ["Freestate"],
    ["Gauteng"],
    ["KwaZuluNatal", "KwaZulu-Natal"],
    ["Limpopo"],
    ["Mpumalanga"],
    ["NorthernCape", "Northern Cape"],
    ["NorthWest", "North West"],
    ["WesternCape", "Western Cape"],
  ],
  genders: [
    ["Male"],
    ["Female"],
    ["Other"],
    ["PreferNotToSay", "Prefer Not To Say"],
  ],
  maritalStatuses: [
    ["CivilMarriage", "Civil Marriage"],
    ["CustomaryMarriage", "Customary Marriage"],
    ["Divorced"],
    ["Single"],
    ["Widowed"],
  ],
  homeLanguages: [
    ["Afrikaans"],
    ["English"],
    ["French"],
    ["isiNdebele"],
    ["isiXhosa"],
    ["isiZulu"],
    ["Sepedi"],
    ["Sesotho"],
    ["Setswana"],
    ["siSwati"],
    ["Tshivenda"],
    ["Xitsonga"],
    ["Other"],
  ],
  countries: countryLabels,
  preferredContactMethods: [
    ["Call", "Phone Call"],
    ["SMS", "SMS"],
    ["WhatsApp", "WhatsApp/messenger"],
    ["Email", "Email"],
  ],
};
