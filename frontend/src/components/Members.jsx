import axios from "axios";
import { useEffect, useState } from "react";

function Members() {
  const [members, setMembers] = useState([]);
  const [full_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [member_type, setType] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchMembers = () => {
    axios.get("http://localhost:5000/members")
      .then(res => setMembers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(fetchMembers, []);

  const handleSave = () => {
    if (!full_name || !email || !phone || !member_type) {
      alert("Please fill all fields");
      return;
    }

    const memberData = {
      full_name,
      email,
      phone,
      member_type,
      registration_date: new Date().toISOString().split('T')[0]
    };

    if (editId) {
      // UPDATE
      axios.put(`http://localhost:5000/members/${editId}`, memberData)
        .then(() => {
          clearForm();
          fetchMembers();
        });
    } else {
      // ADD
      axios.post("http://localhost:5000/members", memberData)
        .then(() => {
          clearForm();
          fetchMembers();
        });
    }
  };

  const handleEdit = (m) => {
    setEditId(m.member_id);
    setName(m.full_name);
    setEmail(m.email);
    setPhone(m.phone);
    setType(m.member_type);
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setPhone("");
    setType("");
  };

  const deleteMember = (id) => {
    if (window.confirm("Are you sure?")) {
      axios.delete(`http://localhost:5000/members/${id}`).then(fetchMembers);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl flex justify-center font-bold mb-4">Members Management</h2>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 shadow w-full max-w-md rounded border-t-4 border-green-500">
          <input className="border p-2 w-full mb-2" placeholder="Full Name" value={full_name} onChange={(e) => setName(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          
          {/* Changed input to select for Teacher/Student */}
          <select 
            className="border p-2 w-full mb-4 bg-white" 
            value={member_type} 
            onChange={(e) => setType(e.target.value)}
          >
            <option value="">Select Type</option>
            <option value="Teacher">Teacher</option>
            <option value="Student">Student</option>
          </select>
          
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded font-bold ${editId ? 'bg-orange-500' : 'bg-green-600'}`}>
              {editId ? "Update Member" : "Add Member"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>

      <table className="w-full bg-white shadow text-center text-sm">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Name</th><th>Email</th><th>Phone</th><th>Type</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {members.map(m => (
            <tr key={m.member_id} className="border-t hover:bg-gray-50">
              <td className="p-2">{m.member_id}</td>
              <td>{m.full_name}</td>
              <td>{m.email}</td>
              <td>{m.phone}</td>
              <td>{m.member_type}</td>
              <td className="p-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(m)} className="text-green-600 font-bold hover:underline">Edit</button>
                <button onClick={() => deleteMember(m.member_id)} className="text-red-600 font-bold hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Members;