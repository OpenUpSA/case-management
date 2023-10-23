/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("clients", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", "testtoken1234");
    cy.setLocalStorage("user_id", "1");
  });

  it("displays clients", () => {
    cy.visit("/clients");
    cy.get("h6").should("have.text", "Client list");
  });

  it("displays new client", () => {
    cy.visit("/clients/new");
    cy.get("h6").should("have.text", "New client");
  });

  it("displays client", () => {
    cy.visit("/clients/2");
    cy.get("h6").should("have.text", "Hubert Blaine");
  });

  it("displays edit client", () => {
    cy.visit("/clients/2/edit");
    cy.get("h6").should("have.text", "Hubert Blaine");
  });
});
