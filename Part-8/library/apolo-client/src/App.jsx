import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useSubscription } from '@apollo/client'
import { ToastContainer, toast, Bounce } from 'react-toastify';

import { BOOK_ADDED } from './graphql/operations'
import { updateCachesAfterBookAdded } from './graphql/cache/handleNewBookCaches'

import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Logout from "./components/Logout";
import RecommendedBooks from "./components/RecommendedBooks";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('library-user-token')
    if (savedToken) {
      setToken(savedToken)
      const decoded = jwtDecode(savedToken);
      setUser(decoded)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onData: ({ data, client }) => {
      const addedBook = data?.data?.bookAdded
      if (addedBook) {
        updateCachesAfterBookAdded(client.cache, addedBook)
        toast(`New book added: "${addedBook.title}" by ${addedBook.author.name}`)
      }
    }
  })

  return (
    <div>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick={true}
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {
          token ? (
            <>
              <button onClick={() => setPage("add")}>add book</button>
              <button onClick={() => setPage("mybooks")}>recommended</button>
              <Logout setToken={setToken} setUser={setUser}/>
            </>
          ) : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors show={page === "authors"} token={token}/>
      <Books show={page === "books"} />
      <LoginForm show={page === "login"} setToken={setToken} setUser={setUser} setPage={setPage}/>
      <NewBook show={page === "add"} />
      <RecommendedBooks show={page === "mybooks"} user={user}/>
    </div>
  );
};

export default App;
