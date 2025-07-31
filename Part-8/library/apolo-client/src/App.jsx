import { useState } from "react";
import Authors from "./components/Authors";
import Books from "./components/Books";
import LoginForm from "./components/LoginForm";
import NewBook from "./components/NewBook";
import Logout from "./components/Logout";

const App = () => {
  const [page, setPage] = useState("authors");
  const [token, setToken] = useState("");

  return (
    <div>
      <div>
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {
          token ? (
            <>
              <button onClick={() => setPage("add")}>add book</button>
              <Logout setToken={setToken} />
            </>
          ) : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors show={page === "authors"} token={token}/>
      <Books show={page === "books"} />
      <LoginForm show={page === "login"} setToken={setToken} setPage={setPage}/>
      <NewBook show={page === "add"} />
    </div>
  );
};

export default App;
