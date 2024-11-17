describe("Create Championship Test", () => {
  it("Visits the create championship page and enters data", () => {
    cy.visit("http://localhost:4200/Administrator/CrearCampeonato");

    cy.get("#championshipName").type("Campeonato Cypress");
    cy.get("#organizer").type("Cypress");
    cy.get("#email").type("barra.amir14@gmail.com");
    cy.get("#championshipDate").type("2024-05-05"); // Ensure the date format matches your input field

    // Optional: Submit the form if there's a submit button
    cy.get('button[type="submit"]').click();
  });
});
