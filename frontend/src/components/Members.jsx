import api from "../api";
import { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [member_type, setType] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchMembers = () => {
    api.get("/members").then(res => setMembers(res.data)).catch(err => console.error(err));
  };

  useEffect(fetchMembers, []);

  const handleSave = () => {
    const data = { full_name, email, phone, member_type, registration_date: new Date().toISOString().split('T')[0] };
    if (editId) {
      api.put(`/members/${editId}`, data).then(() => { clearForm(); fetchMembers(); });
    } else {
      api.post("/members", data).then(() => { clearForm(); fetchMembers(); });
    }
  };

  const deleteMember = (id) => {
    if(window.confirm("Delete member?")) {
      api.delete(`/members/${id}`).then(() => fetchMembers());
    }
  };

  const handleEdit = (m) => {
    setEditId(m.member_id); setName(m.full_name); setEmail(m.email); setPhone(m.phone); setType(m.member_type);
  };

  const clearForm = () => {
    setEditId(null); setName(""); setEmail(""); setPhone(""); setType("");
  };

  return (
    <div className="p-4">
      <div className="bg-white p-4 rounded shadow mb-4">
        <h2 className="text-xl font-bold mb-3">{editId ? "Edit Member" : "New Member"}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="border p-2 rounded" placeholder="Full Name" value={full_name} onChange={e => setName(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="border p-2 rounded" placeholder="Phone" value={phone} onChange={e => setPhone(e.target.value)} />
          <select className="border p-2 rounded" value={member_type} onChange={e => setType(e.target.value)}>
            <option value="">-- Member Type --</option>
            <option value="Staff">Staff</option>
            <option value="Student">Student</option>
          </select>
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded font-bold ${editId ? 'bg-orange-500' : 'bg-green-600'}`}>{editId ? "Update" : "Add"}</button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>
      <table className="w-full bg-white shadow text-sm text-center">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.member_id} className="border-t">
              <td>{m.member_id}</td><td>{m.full_name}</td><td>{m.email}</td>
              <td className="p-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(m)} className="text-green-600 font-bold">Edit</button>
                <button onClick={() => deleteMember(m.member_id)} className="text-red-600 font-bold">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
export default Members;