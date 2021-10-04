describe("Login", ()=>{
    it("logs in", ()=>{
        cy.visit("/login");
        cy.get("input[name='email']").type("fake@fakemail.com")
        cy.get("input[name='password']").type("fake1234")
        cy.get("button[type='submit']").click()
        cy.get("h1").should("have.text", "Reporting Dashboard");
    })
})

