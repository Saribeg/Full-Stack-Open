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

export { fillAndSubmitLoginForm, loginByLocalStorage }