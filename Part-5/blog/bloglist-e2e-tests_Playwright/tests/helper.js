const fillAndSubmitLoginForm = async (page, username, password) => {
  await page.getByTestId('username').fill(username);
  await page.getByTestId('password').fill(password);
  await page.getByTestId('login').click();
};

export { fillAndSubmitLoginForm }