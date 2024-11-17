describe("My First Test", () => {
  it("Visits the Angular App", () => {
    cy.visit("http://localhost:4200"); // Asegúrate de que tu app esté corriendo en localhost:4200
    cy.contains("TkdHub");
  });
});
