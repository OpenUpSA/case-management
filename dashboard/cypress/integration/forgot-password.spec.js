describe("forgot password page", () => {
    it("displays forgot password page", () => {
        cy.visit("/forgot-password");
        cy.get("button[type='submit']").should("have.text", "Reset password");
    });
});