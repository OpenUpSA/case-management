/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("home", () => {
  it("displays home", () => {
    cy.visit("/");
    cy.get("button").should("have.text", "Login");
  });

  it("displays 404", () => {
    cy.setLocalStorage("user_id", "1");
    cy.visit("/mandela");
    cy.get("button").should("have.text", "Home");
  });
});
