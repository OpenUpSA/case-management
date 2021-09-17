describe("dashboard", () => {
    it("displays dashboard", () => {
        cy.visit("/dashboard");
        cy.get("h1").should("have.text", "Reporting Dashboard");
    });

    it("displays 404", () => {
        cy.visit("/dash");
        cy.get("button").should("have.text", "Home");
    });
});