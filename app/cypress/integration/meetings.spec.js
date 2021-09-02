/// <reference types="cypress" />
import "cypress-localstorage-commands";

describe("meetings", () => {
  beforeEach(() => {
    cy.setLocalStorage("access_token", "testtoken1234");
    cy.setLocalStorage("user_id", "1");
  });

  it("displays meetings", () => {
    cy.visit("/meetings");
    cy.get("h6").should("have.text", "Meeting list");
  });

  it("displays new meeting", () => {
    cy.visit("/cases/2/meetings/new");
    cy.get("h6").should("have.text", "New meeting");
  });

  it("displays meeting", () => {
    cy.visit("/meetings/18");
    cy.get("h6").should("have.text", "asdasdasd");
  });

  it("displays edit case", () => {
    cy.visit("/meetings/18/edit");
    cy.get("h6").should("have.text", "asdasdasd");
  });
});
