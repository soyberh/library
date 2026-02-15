import api from "../api"; // Use api instead of axios
import { useEffect, useState } from "react";

function Books() {
  const [books, setBooks] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [publishers, setPublishers] = useState([]);
  
  const [title, setTitle] = useState("");
  const [publication_year, setYear] = useState("");
  const [supplier_id, setSupplier] = useState("");
  const [publisher_id, setPublisher] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const resBooks = await api.get("/books");
      const resSupps = await api.get("/suppliers");
      const resPubs = await api.get("/publishers");
      
      setBooks(resBooks.data);
      setSuppliers(resSupps.data);
      setPublishers(resPubs.data);
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    if (!title || !publication_year || !supplier_id || !publisher_id) {
      alert("Please fill all fields and select both a supplier and publisher.");
      return;
    }

    const data = { title, publication_year, supplier_id, publisher_id };

    if (editId) {
      api.put(`/books/${editId}`, data).then(() => {
        clearForm();
        fetchData();
      });
    } else {
      api.post("/books", data).then(() => {
        clearForm();
        fetchData();
      });
    }
  };

  const handleEdit = (book) => {
    setEditId(book.book_id);
    setTitle(book.title);
    setYear(book.publication_year);
    setSupplier(book.supplier_id);
    setPublisher(book.publisher_id);
  };

  const clearForm = () => {
    setTitle(""); setYear(""); setSupplier(""); setPublisher(""); setEditId(null);
  };

  const deleteBook = (id) => {
    api.delete(`/books/${id}`).then(fetchData);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl flex justify-center font-bold mb-4">Books Management</h2>
      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 shadow w-full max-w-md rounded border-t-4 border-blue-500">
          <input className="border p-2 w-full mb-2" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Year" value={publication_year} onChange={(e) => setYear(e.target.value)} />
          <label className="text-sm text-gray-600">Select Supplier:</label>
          <select className="border p-2 w-full mb-2" value={supplier_id} onChange={(e) => setSupplier(e.target.value)}>
            <option value="">-- Choose Supplier --</option>
            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
          </select>
          <label className="text-sm text-gray-600">Select Publisher:</label>
          <select className="border p-2 w-full mb-2" value={publisher_id} onChange={(e) => setPublisher(e.target.value)}>
            <option value="">-- Choose Publisher --</option>
            {publishers.map(p => <option key={p.publisher_id} value={p.publisher_id}>{p.publisher_name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded ${editId ? 'bg-orange-500' : 'bg-blue-600'}`}>
              {editId ? "Update Book" : "Add Book"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>
      <table className="w-full bg-white shadow text-sm">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Title</th><th>Supplier ID</th><th>Publisher ID</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.book_id} className="text-center border-t">
              <td>{b.book_id}</td><td>{b.title}</td><td>{b.supplier_id}</td><td>{b.publisher_id}</td>
              <td className="p-2 flex justify-center gap-2">
                <button onClick={() => handleEdit(b)} className="text-blue-600 font-bold">Edit</button>
                <button onClick={() => deleteBook(b.book_id)} className="text-red-600 font-bold">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Books;