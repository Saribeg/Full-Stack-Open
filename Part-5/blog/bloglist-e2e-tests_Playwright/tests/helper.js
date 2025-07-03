const fillAndSubmitLoginForm = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login').click();
};

const loginByLocalStorage = async (page, request, username, password) => {
  const response = await request.post('/api/login', {
    data: { username, password },
  });

  const userData = await response.json();

  await page.goto('http://localhost:5173');
  await page.evaluate((user) => {
    localStorage.setItem('user', JSON.stringify(user));
  }, userData);

  await page.reload();
};

const createBlog = async (page, { title, author, url }) => {
  await page.getByRole('button', { name: /new blog/i }).click()
  await page.getByTestId('blogTitle').fill(title);
  await page.getByTestId('blogAuthor').fill(author);
  await page.getByTestId('blogUrl').fill(url);
  await page.getByTestId('createBlog').click();
}

export { fillAndSubmitLoginForm, loginByLocalStorage, createBlog }