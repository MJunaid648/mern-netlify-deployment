import { useState } from "react";
import Home from "./screens/Home";
import ThankYou from "./screens/ThankYou";

function App() {
  const [page, setPage] = useState("home");
  const handlePageChange = (page) => {
    setPage(page);
  };

  return (
    <>
      {page === "home" ? (
        <Home handlePageChange={handlePageChange} />
      ) : (
        <ThankYou handlePageChange={handlePageChange} />
      )}
    </>
  );
}

export default App;
