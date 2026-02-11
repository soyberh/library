import axios from "axios";
import { useEffect, useState } from "react";

function Borrows() {
  const [borrows, setBorrows] = useState([]);
  const [books, setBooks] = useState([]); // Added state for books list
  const [members, setMembers] = useState([]); // Added state for members list
  const [book_id, setBookId] = useState("");
  const [member_id, setMemberId] = useState("");
  const [borrow_date, setBorrowDate] = useState("");
  const [return_date, setReturnDate] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const [borrowsRes, booksRes, membersRes] = await Promise.all([
        axios.get("http://localhost:5000/borrows"),
        axios.get("http://localhost:5000/books"),
        axios.get("http://localhost:5000/members")
      ]);
      setBorrows(borrowsRes.data);
      setBooks(booksRes.data);
      setMembers(membersRes.data);
    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSave = () => {
    if (!book_id || !member_id || !borrow_date) {
      alert("Please select a book, member, and borrow date");
      return;
    }

    const borrowData = { book_id, member_id, borrow_date, return_date };

    if (editId) {
      axios.put(`http://localhost:5000/borrows/${editId}`, borrowData).then(() => {
        clearForm();
        fetchData();
      });
    } else {
      axios.post("http://localhost:5000/borrows", borrowData).then(() => {
        clearForm();
        fetchData();
      });
    }
  };

  const handleEdit = (b) => {
    setEditId(b.borrow_id);
    setBookId(b.book_id);
    setMemberId(b.member_id);
    setBorrowDate(b.borrow_date ? b.borrow_date.split('T')[0] : "");
    setReturnDate(b.return_date ? b.return_date.split('T')[0] : "");
  };

  const clearForm = () => {
    setEditId(null);
    setBookId(""); setMemberId(""); setBorrowDate(""); setReturnDate("");
  };

  const deleteBorrow = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/borrows/${id}`).then(fetchData);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl flex justify-center font-bold mb-4">Borrowing Records</h2>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 shadow w-full max-w-md rounded border-t-4 border-blue-400">
          
          {/* SELECT BOOK DROPDOWN */}
          <label className="text-xs text-gray-400 font-bold ml-1">Select Book</label>
          <select 
            className="border p-2 w-full mb-2 bg-white" 
            value={book_id} 
            onChange={(e) => setBookId(e.target.value)}
          >
            <option value="">-- Choose a Book --</option>
            {books.map(book => (
              <option key={book.book_id} value={book.book_id}>
                {book.title} (ID: {book.book_id})
              </option>
            ))}
          </select>

          {/* SELECT MEMBER DROPDOWN */}
          <label className="text-xs text-gray-400 font-bold ml-1">Select Member</label>
          <select 
            className="border p-2 w-full mb-2 bg-white" 
            value={member_id} 
            onChange={(e) => setMemberId(e.target.value)}
          >
            <option value="">-- Choose a Member --</option>
            {members.map(member => (
              <option key={member.member_id} value={member.member_id}>
                {member.full_name} (ID: {member.member_id})
              </option>
            ))}
          </select>
          
          <label className="text-xs text-gray-400 font-bold ml-1">Borrow Date</label>
          <input type="date" className="border p-2 w-full mb-2" value={borrow_date} onChange={(e) => setBorrowDate(e.target.value)} />
          
          <label className="text-xs text-gray-400 font-bold ml-1">Return Date</label>
          <input type="date" className="border p-2 w-full mb-4" value={return_date} onChange={(e) => setReturnDate(e.target.value)} />
          
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded font-bold ${editId ? 'bg-orange-500' : 'bg-blue-400'}`}>
              {editId ? "Update Record" : "Add Record"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>

      <table className="w-full bg-white shadow text-center text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th>Book</th>
            <th>Member</th>
            <th>Borrow Date</th>
            <th>Return Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {borrows.map(b => (
            <tr key={b.borrow_id} className="border-t hover:bg-gray-50">
              <td className="p-2">{b.borrow_id}</td>
              <td>{b.book_id}</td>
              <td>{b.member_id}</td>
              <td>{b.borrow_date ? b.borrow_date.split('T')[0] : "N/A"}</td>
              <td>{b.return_date ? b.return_date.split('T')[0] : "Pending"}</td>
              <td className="p-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(b)} className="text-blue-600 font-bold hover:underline">Edit</button>
                <button onClick={() => deleteBorrow(b.borrow_id)} className="text-red-600 font-bold hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Borrows;