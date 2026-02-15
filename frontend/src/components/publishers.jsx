import api from "../api"; // Pointing to your src/api.js
import { useEffect, useState } from "react";

function Publishers() {
  const [publishers, setPublishers] = useState([]);
  const [publisher_name, setPublisherName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchPublishers = async () => {
    try {
      const res = await api.get("/publishers");
      setPublishers(res.data);
    } catch (err) {
      console.error("Error fetching publishers:", err);
    }
  };

  useEffect(() => {
    fetchPublishers();
  }, []);

  const handleSave = () => {
    if (!publisher_name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    const publisherData = { publisher_name, email, phone };

    if (editId) {
      api.put(`/publishers/${editId}`, publisherData)
        .then(() => {
          clearForm();
          fetchPublishers();
        });
    } else {
      api.post("/publishers", publisherData)
        .then(() => {
          clearForm();
          fetchPublishers();
        });
    }
  };

  const handleEdit = (p) => {
    setEditId(p.publisher_id);
    setPublisherName(p.publisher_name);
    setEmail(p.email);
    setPhone(p.phone);
  };

  const deletePublisher = (id) => {
    if (window.confirm("Delete this publisher?")) {
      api.delete(`/publishers/${id}`).then(() => fetchPublishers());
    }
  };

  const clearForm = () => {
    setEditId(null);
    setPublisherName("");
    setEmail("");
    setPhone("");
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow mb-4 border-t-4 border-orange-400">
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Publisher" : "Add New Publisher"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <input className="border p-2 rounded" placeholder="Publisher Name" value={publisher_name} onChange={(e) => setPublisherName(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded font-bold ${editId ? 'bg-orange-500' : 'bg-blue-600'}`}>
              {editId ? "Update Publisher" : "Add Publisher"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>

      <table className="w-full bg-white shadow text-center text-sm">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">ID</th>
            <th>Publisher Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {publishers.length === 0 ? (
            <tr><td colSpan="5" className="p-4">No publishers found in database.</td></tr>
          ) : (
            publishers.map((p) => (
              <tr key={p.publisher_id} className="border-t hover:bg-gray-50">
                <td className="p-2">{p.publisher_id}</td>
                <td>{p.publisher_name}</td>
                <td>{p.email}</td>
                <td>{p.phone}</td>
                <td className="p-2 flex justify-center gap-3">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 font-bold hover:underline">Edit</button>
                  <button onClick={() => deletePublisher(p.publisher_id)} className="text-red-600 font-bold hover:underline">Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Publishers;