import '@testing-library/jest-dom';
import { configure } from '@testing-library/react';

configure({
  getElementError: (message) => {
    const error = new Error(message);
    error.name = 'TestingLibraryElementError';
    error.stack = null;
    return error;
  }
});

beforeAll(() => {
  const modalRoot = document.createElement('div');
  modalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(modalRoot);
});
