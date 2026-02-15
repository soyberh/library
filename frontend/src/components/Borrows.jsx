import api from "../api";
import { useEffect, useState } from "react";

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [book_id, setBookId] = useState("");
  const [member_id, setMemberId] = useState("");
  const [borrow_date, setBorrowDate] = useState("");
  const [return_date, setReturnDate] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const [borrowsRes, booksRes, membersRes] = await Promise.all([
        api.get("/borrows"),
        api.get("/books"),
        api.get("/members")
      ]);
      setBorrows(borrowsRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSave = () => {
    const data = { book_id, member_id, borrow_date, return_date };
    if (editId) {
      api.put(`/borrows/${editId}`, data).then(() => { clearForm(); fetchData(); });
    } else {
      api.post("/borrows", data).then(() => { clearForm(); fetchData(); });
    }
  };

  const clearForm = () => {
    setEditId(null); setBookId(""); setMemberId(""); setBorrowDate(""); setReturnDate("");
  };

  const handleEdit = (b) => {
    setEditId(b.borrow_id);
    setBookId(b.book_id);
    setMemberId(b.member_id);
    setBorrowDate(b.borrow_date ? b.borrow_date.split('T')[0] : "");
    setReturnDate(b.return_date ? b.return_date.split('T')[0] : "");
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-3">{editId ? "Update Record" : "New Borrow Record"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <select className="border p-2 rounded" value={book_id} onChange={e => setBookId(e.target.value)}>
            <option value="">-- Select Book --</option>
            {books.map(b => <option key={b.book_id} value={b.book_id}>{b.title}</option>)}
          </select>
          <select className="border p-2 rounded" value={member_id} onChange={e => setMemberId(e.target.value)}>
            <option value="">-- Select Member --</option>
            {members.map(m => <option key={m.member_id} value={m.member_id}>{m.full_name}</option>)}
          </select>
          <input type="date" className="border p-2 rounded" value={borrow_date} onChange={e => setBorrowDate(e.target.value)} />
          <input type="date" className="border p-2 rounded" value={return_date} onChange={e => setReturnDate(e.target.value)} />
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded ${editId ? 'bg-orange-500' : 'bg-blue-400'}`}>
              {editId ? "Update" : "Add"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>
      <table className="w-full bg-white shadow text-center text-sm">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Book ID</th><th>Member ID</th><th>Borrow Date</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {borrows.map(b => (
            <tr key={b.borrow_id} className="border-t">
              <td>{b.borrow_id}</td><td>{b.book_id}</td><td>{b.member_id}</td>
              <td>{b.borrow_date ? b.borrow_date.split('T')[0] : "N/A"}</td>
              <td className="p-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(b)} className="text-blue-600 font-bold">Edit</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Borrows;