import api from "../api";
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
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = () => {
    const data = { title, publication_year, supplier_id, publisher_id };
    if (editId) {
      api.put(`/books/${editId}`, data).then(() => { clearForm(); fetchData(); });
    } else {
      api.post("/books", data).then(() => { clearForm(); fetchData(); });
    }
  };

  const deleteBook = (id) => {
    if(window.confirm("Delete book?")) {
      api.delete(`/books/${id}`).then(() => fetchData());
    }
  };

  const handleEdit = (b) => {
    setEditId(b.book_id);
    setTitle(b.title);
    setYear(b.publication_year);
    setSupplier(b.supplier_id);
    setPublisher(b.publisher_id);
  };

  const clearForm = () => {
    setEditId(null); setTitle(""); setYear(""); setSupplier(""); setPublisher("");
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Book" : "Add New Book"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Book Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Year" value={publication_year} onChange={e => setYear(e.target.value)} />
          <select className="border p-2 rounded" value={supplier_id} onChange={e => setSupplier(e.target.value)}>
            <option value="">-- Choose Supplier --</option>
            {suppliers.map(s => <option key={s.supplier_id} value={s.supplier_id}>{s.supplier_name}</option>)}
          </select>
          <select className="border p-2 rounded" value={publisher_id} onChange={e => setPublisher(e.target.value)}>
            <option value="">-- Choose Publisher --</option>
            {publishers.map(p => <option key={p.publisher_id} value={p.publisher_id}>{p.publisher_name}</option>)}
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded ${editId ? 'bg-orange-500' : 'bg-blue-600'}`}>{editId ? "Update" : "Add"}</button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>
      <table className="w-full bg-white shadow text-sm text-center">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Title</th><th>Year</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {books.map(b => (
            <tr key={b.book_id} className="border-t">
              <td>{b.book_id}</td><td>{b.title}</td><td>{b.publication_year}</td>
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