describe("Find and Interact with Campeonato", () => {
  it("Navigates and interacts with elements", () => {
    cy.visit("http://localhost:4200/");
    cy.get("button").contains("Ver Más").click();
    cy.get("button").contains("Ver Más").click();

    const clickSeeMoreUntilFound = () => {
      cy.get("span")
        .contains("Campeonato Ranking 2")
        .then(($span) => {
          if ($span.length) {
            cy.wrap($span).click();
          } else {
            cy.get("button").contains("Ver Más").click();
            clickSeeMoreUntilFound();
          }
        });
    };

    clickSeeMoreUntilFound();

    cy.contains("span", "INGRESAR").click();
    cy.get("#form2Example11").type("barra.amir14@gmail.com");
    cy.get("#form2Example22").type("mega123");
    cy.get("button").contains("Iniciar Sesión").click();
  });
});
