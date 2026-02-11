import express from "express";
import mysql from "mysql2";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// DATABASE CONNECTION
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "library_db"
});

db.connect((err) => {
  if (err) {
    console.log("Database connection failed", err);
  } else {
    console.log("Connected to MySQL");
  }
});

// ================= BOOKS =================
app.get("/books", (req, res) => {
  db.query("SELECT * FROM books", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/books", (req, res) => {
  const { title, publication_year, supplier_id, publisher_id } = req.body;
  db.query(
    "INSERT INTO books (title, publication_year, supplier_id, publisher_id) VALUES (?,?,?,?)",
    [title, publication_year, supplier_id, publisher_id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Book added successfully");
    }
  );
});

app.put("/books/:id", (req, res) => {
  const { title, publication_year, supplier_id, publisher_id } = req.body;
  db.query(
    "UPDATE books SET title=?, publication_year=?, supplier_id=?, publisher_id=? WHERE book_id=?",
    [title, publication_year, supplier_id, publisher_id, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Book updated");
    }
  );
});

app.delete("/books/:id", (req, res) => {
  db.query("DELETE FROM books WHERE book_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Book deleted");
  });
});

// ================= MEMBERS =================
app.get("/members", (req, res) => {
  db.query("SELECT * FROM members", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/members", (req, res) => {
  const { full_name, email, phone, member_type, registration_date } = req.body;
  db.query(
    "INSERT INTO members (full_name, email, phone, member_type, registration_date) VALUES (?,?,?,?,?)",
    [full_name, email, phone, member_type, registration_date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Member added");
    }
  );
});

// Added Member Update logic
app.put("/members/:id", (req, res) => {
  const { full_name, email, phone, member_type } = req.body;
  db.query(
    "UPDATE members SET full_name=?, email=?, phone=?, member_type=? WHERE member_id=?",
    [full_name, email, phone, member_type, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Member updated");
    }
  );
});

app.delete("/members/:id", (req, res) => {
  db.query("DELETE FROM members WHERE member_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Member deleted");
  });
});

// ================= PUBLISHERS (Fixed Table Name to Plural) =================
app.get("/publishers", (req, res) => {
  // Changed "publisher" to "publishers" to match database convention
  db.query("SELECT * FROM publishers", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/publishers", (req, res) => {
  const { publisher_name, email, phone } = req.body;
  db.query(
    "INSERT INTO publishers (publisher_name, email, phone) VALUES (?,?,?)",
    [publisher_name, email, phone],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Publisher added");
    }
  );
});

app.put("/publishers/:id", (req, res) => {
  const { publisher_name, email, phone } = req.body;
  db.query(
    "UPDATE publishers SET publisher_name=?, email=?, phone=? WHERE publisher_id=?",
    [publisher_name, email, phone, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Publisher updated");
    }
  );
});

app.delete("/publishers/:id", (req, res) => {
  db.query("DELETE FROM publishers WHERE publisher_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Publisher deleted");
  });
});

// ================= SUPPLIERS =================
app.get("/suppliers", (req, res) => {
  db.query("SELECT * FROM suppliers", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/suppliers", (req, res) => {
  const { supplier_name, email, phone } = req.body;
  db.query(
    "INSERT INTO suppliers (supplier_name, email, phone) VALUES (?,?,?)",
    [supplier_name, email, phone],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Supplier added");
    }
  );
});

// Added Supplier Update logic
app.put("/suppliers/:id", (req, res) => {
  const { supplier_name, email, phone } = req.body;
  db.query(
    "UPDATE suppliers SET supplier_name=?, email=?, phone=? WHERE supplier_id=?",
    [supplier_name, email, phone, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Supplier updated");
    }
  );
});

app.delete("/suppliers/:id", (req, res) => {
  db.query("DELETE FROM suppliers WHERE supplier_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Supplier deleted");
  });
});

// ================= BORROWS =================
app.get("/borrows", (req, res) => {
  db.query("SELECT * FROM borrows", (err, data) => {
    if (err) return res.status(500).json(err);
    res.json(data);
  });
});

app.post("/borrows", (req, res) => {
  const { member_id, book_id, borrow_date, return_date } = req.body;
  db.query(
    "INSERT INTO borrows (member_id, book_id, borrow_date, return_date) VALUES (?,?,?,?)",
    [member_id, book_id, borrow_date, return_date],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Book borrowed");
    }
  );
});

// Added Borrows Update logic
app.put("/borrows/:id", (req, res) => {
  const { member_id, book_id, borrow_date, return_date } = req.body;
  db.query(
    "UPDATE borrows SET member_id=?, book_id=?, borrow_date=?, return_date=? WHERE borrow_id=?",
    [member_id, book_id, borrow_date, return_date, req.params.id],
    (err) => {
      if (err) return res.status(500).json(err);
      res.json("Borrow record updated");
    }
  );
});

app.delete("/borrows/:id", (req, res) => {
  db.query("DELETE FROM borrows WHERE borrow_id=?", [req.params.id], (err) => {
    if (err) return res.status(500).json(err);
    res.json("Borrow record deleted");
  });
});

app.listen(5000, () => {
  console.log("Server running on port 5000");
});