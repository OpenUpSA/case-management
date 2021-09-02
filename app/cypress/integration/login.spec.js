/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("home", () => {
  it("displays home", () => {
    cy.setLocalStorage("user_id", "1");
    cy.visit("/login");
    cy.get("button").should("have.text", "Login");
    cy.get("h1").should("have.text", "Login");
  });
});
