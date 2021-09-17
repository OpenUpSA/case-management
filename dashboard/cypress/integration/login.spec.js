describe("Login", ()=>{
    it("logs in", ()=>{
        cy.visit("/login");
        cy.get("input[name='email']").type("hazemidoo@gmail.com")
        cy.get("input[name='password']").type("72fA0rRFwaTm1twHKUqP")
        cy.get("button[type='submit']").click()
        cy.get("h1").should("have.text", "Reporting Dashboard");

    })
})

