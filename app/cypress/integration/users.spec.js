/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("meetings", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", "testtoken1234");
    cy.setLocalStorage("user_id", "1");
  });

  it("displays user", () => {
    cy.visit("/users/1");
    cy.get("h6").should("have.text", "nala@nxolala.test");
  });

  it("displays edit user", () => {
    cy.visit("/users/1/edit");
    cy.get("h6").should("have.text", "nala@nxolala.test");
  });
});
