/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("cases", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", "testtoken1234");
    cy.setLocalStorage("user_id", "1");
  });

  it("displays cases", () => {
    cy.visit("/cases");
    cy.get("h6").should("have.text", "Case list");
  });

  it("displays new case", () => {
    cy.visit("/clients/2/cases/new");
    cy.get("h6").should("have.text", "New case");
  });

  it("displays case", () => {
    cy.visit("/cases/2");
    cy.get("h6").should("have.text", "CASE12346");
  });

  it("displays edit case", () => {
    cy.visit("/cases/2/edit");
    cy.get("h6").should("have.text", "CASE12346");
  });
});
