describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', `${Cypress.env('BACKEND')}/test/initiate-db`).then((response) => {
      this.initData = response.body;
    });
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

    it('A blog can be liked', function() {
      cy.contains('.blog-title', 'Type wars by Robert C. Martin')
        .parent()
        .as('targetBlog');
    
      cy.get('@targetBlog').click();
    
      cy.get('@targetBlog').within(() => {
        cy.get('.blog-likes').should('contain', 'Likes: 2');
        cy.get('.blog-user').should('contain', 'Jessica Huston');
    
        cy.get('.blog-like').click();
        cy.get('.blog-likes').should('contain', 'Likes: 3');
        cy.get('.blog-user').should('contain', 'Harry Potter');
    
        cy.get('.blog-like').click();
        cy.get('.blog-likes').should('contain', 'Likes: 4');
        cy.get('.blog-user').should('contain', 'Harry Potter');
      });
    });

    it('A blog can be deleted by user who created or edited it', function() {
      cy.createBlog({
        title: 'Custom hooks in React',
        author: 'Albus Dumbledore',
        url: 'https://reactcustomhooks.com/'
      });

      cy.on('window:confirm', (message) => {
        expect(message).to.contain('Are you sure you want to delete the blog Custom hooks in React?');
        return true;
      });

      cy.contains('.blog-title', 'Custom hooks in React by Albus Dumbledore').should('exist').as('targetBlogTitle');
      cy.get('@targetBlogTitle').parent().as('targetBlog');
    
      cy.get('@targetBlogTitle').click();
    
      cy.get('@targetBlog').within(() => {
        cy.get('.blog-delete').should('contain', 'Delete').click();
      });

      cy.contains('.blog-title', 'Custom hooks in React by Albus Dumbledore').should('not.exist');
      cy.get('.blog-card').should('not.contain', 'Custom hooks in React by Albus Dumbledore');
    });

    it('Only creator of a blog can see the delete button', function() {
      cy.contains('.blog-title', 'React patterns by Michael Chan').as('notMyBlog').click();
      cy.get('@notMyBlog').parent().get('.blog-delete').should('not.exist');
    
      cy.contains('.blog-title', 'Full Stack Open by Albus Dumbledore').as('myBlog').click();
      cy.get('@myBlog').parent().get('.blog-delete').should('exist');
    });

    it('Blogs are sorted in correct order by likes count', function() {
      cy.get('.blog-title').should(($blogTitle) => {
        let actualTitles = $blogTitle.map((i, el) => {
          return Cypress.$(el).text()
        }).get();
        const { blogs } = this.initData;
        const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);
        const expectedTitles = sortedBlogs.map(blog => `${blog.title} by ${blog.author}`); 
      
        expect(actualTitles).to.have.length(expectedTitles.length);
        expect(actualTitles).to.deep.eq(expectedTitles);
      });

      cy.contains('.blog-title', 'First class tests by Robert C. Martin').parent().as('targetBlog')
      cy.get('@targetBlog').click();
      cy.get('@targetBlog').within(() => {
        cy.get('.blog-like').click();
        cy.get('.blog-likes').should('contain', 'Likes: 11');
      
        cy.get('.blog-like').click();
        cy.get('.blog-likes').should('contain', 'Likes: 12');
      
        cy.get('.blog-like').click();
        cy.get('.blog-likes').should('contain', 'Likes: 13');
      });

      cy.get('.blog-title').should(($blogTitle) => {
        let actualTitles = $blogTitle.map((i, el) => {
          return Cypress.$(el).text()
        }).get();
        const { blogs } = this.initData;
        const sortedBlogs = [...blogs]
          .map(blog => blog.title === 'First class tests' ? { ...blog, likes: 13 } : blog)
          .sort((a, b) => b.likes - a.likes);
        const expectedTitles = sortedBlogs.map(blog => `${blog.title} by ${blog.author}`); 
      
        expect(actualTitles).to.have.length(expectedTitles.length);
        expect(actualTitles).to.deep.eq(expectedTitles);
      });
    });
  });
});