import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Books from "./components/Books";
import Members from "./components/Members";
import Suppliers from "./components/suppliers";
import Publishers from "./components/publishers";
import Borrows from "./components/Borrows";

function App() {
  const [page, setPage] = useState("home");

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Sidebar (Left Side) */}
      <Navbar setPage={setPage} currentPage={page} />

      {/* Main Content (Right Side) */}
      <main className="grow ml-64 p-8">
        <div className="max-w-7xl mx-auto">
          {page === "home" && <Home setPage={setPage} />}
          {page === "books" && <Books />}
          {page === "members" && <Members />}
          {page === "suppliers" && <Suppliers />}
          {page === "publishers" && <Publishers />}
          {page === "borrows" && <Borrows />}
        </div>
      </main>
    </div>
  );
}

export default App;