describe('Blog app', function() {
  beforeEach(function() {
    cy.visit('http://localhost:5173')
  })

  it('Shows login form when visiting page initially', function() {
    cy.contains('Log In to see blogs and work with them');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#login').should('be.visible');
  })
})