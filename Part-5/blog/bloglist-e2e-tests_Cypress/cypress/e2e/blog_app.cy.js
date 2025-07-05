describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/test/initiate-db`);
    cy.visit('/');
  });

  it('Shows login form when visiting page initially', function() {
    cy.contains('Log In to see blogs and work with them');
    cy.get('#username').should('be.visible');
    cy.get('#password').should('be.visible');
    cy.get('#login').should('be.visible');
  });

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.fillAndSubmitLoginForm({
        username: 'harrypotter',
        password: 'sekret'
      });

      cy.get('.notification.success')
        .should('contain', 'User Harry Potter is successfully logged in')
        .and('have.css', 'color', 'rgb(0, 128, 0)');
      cy.get('.user').should('be.visible');
      cy.get('.user-name').should('contain', 'Harry Potter');
      cy.get('.user-status').should('contain', 'Status: Logged In');
    });

    it('fails with wrong credentials', function() {
      cy.fillAndSubmitLoginForm({
        username: 'harrypotter',
        password: 'wrong'
      });

      cy.get('.notification.error')
        .should('contain', 'invalid username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)');
      cy.get('.user').should('not.exist');
    });
  });

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({
        username: 'harrypotter',
        password: 'sekret'
      });
    });

    it('A blog can be created', function() {
      cy.get('.btn.toggler.toggler-closed').click();
      cy.get('#blogTitle').type('Custom hooks in React');
      cy.get('#blogAuthor').type('Albus Dumbledore');
      cy.get('#blogUrl').type('https://reactcustomhooks.com/');
      cy.get('#createBlog').contains('Create').click();

      cy.contains('.blog-title', 'Custom hooks in React by Albus Dumbledore').should('be.visible');
    });
  });
});