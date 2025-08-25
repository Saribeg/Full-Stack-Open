const api = () => Cypress.env('API_URL');

describe('Login', () => {
  const user = { name: 'Test User', username: 'tester', password: 'secret' };

  beforeEach(() => {
    cy.resetDb();
    cy.seedInitialDbData();
    cy.createUser(user);
    cy.intercept('POST', `${api()}/login`).as('login');
    cy.visit('/');
  });

  it('logs in successfully and shows AuthStatus + global popup', () => {
    cy.fillAndSubmitLoginForm({
      username: user.username,
      password: user.password,
    });

    cy.wait('@login').its('response.statusCode').should('eq', 200);

    cy.get('[data-testid="auth-status"]')
      .should('be.visible')
      .and('contain.text', 'Test User');

    cy.contains(/welcome,\s*test user/i).should('be.visible');

    cy.get('body').find('#username').should('not.exist');
    cy.get('body').find('#password').should('not.exist');

    cy.contains(/invalid username or password/i).should('not.exist');
  });

  it('shows global error notification on login failure and keeps form filled', () => {
    cy.fillAndSubmitLoginForm({ username: 'wrong', password: 'bad' });

    cy.contains(/invalid username or password/i).should('be.visible');
    cy.get('[data-testid="auth-status"]').should('not.exist');
    cy.get('#username').should('have.value', 'wrong');
    cy.get('#password').should('have.value', 'bad');
    cy.get('form').within(() => {
      cy.contains(/invalid username or password/i).should('not.exist');
    });
  });
});
