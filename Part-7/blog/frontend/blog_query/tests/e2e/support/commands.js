const api = () => Cypress.env('API_URL');

Cypress.Commands.add('resetDb', () =>
  cy.request('POST', `${api()}/test/reset`)
);

Cypress.Commands.add('seedInitialDbData', () =>
  cy.request('POST', `${api()}/test/initiate-db`)
);

Cypress.Commands.add('createUser', ({ name, username, password }) =>
  cy.request('POST', `${api()}/users`, { name, username, password })
);

Cypress.Commands.add('fillAndSubmitLoginForm', ({ username, password }) => {
  cy.findByTestId('username').type(username);
  cy.findByTestId('password').type(password);
  cy.findByTestId('login').click();
});

Cypress.Commands.add('login', ({ username, password }) => {
  cy.request('POST', `${api()}/login`, {
    username, password
  }).then(({ body }) => {
    localStorage.setItem('user', JSON.stringify(body));
    cy.visit('/');
  });
});

Cypress.Commands.add('createBlog', ({ title, author, url }) => {
  cy.request({
    url: `${api()}/blogs`,
    method: 'POST',
    body: { title, author, url },
    headers: {
      'Authorization': `Bearer ${JSON.parse(localStorage.getItem('user')).token}`
    }
  });

  cy.visit('/');
});