import axios from "axios";
import { useEffect, useState } from "react";

function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [supplier_name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchSuppliers = () => {
    axios.get("http://localhost:5000/suppliers")
      .then(res => setSuppliers(res.data))
      .catch(err => console.error(err));
  };

  useEffect(fetchSuppliers, []);

  const handleSave = () => {
    if (!supplier_name || !email || !phone) {
      alert("Please fill all fields");
      return;
    }

    const data = { supplier_name, email, phone };

    if (editId) {
      axios.put(`http://localhost:5000/suppliers/${editId}`, data).then(() => {
        clearForm();
        fetchSuppliers();
      });
    } else {
      axios.post("http://localhost:5000/suppliers", data).then(() => {
        clearForm();
        fetchSuppliers();
      });
    }
  };

  const handleEdit = (s) => {
    setEditId(s.supplier_id);
    setName(s.supplier_name);
    setEmail(s.email);
    setPhone(s.phone);
  };

  const clearForm = () => {
    setEditId(null);
    setName("");
    setEmail("");
    setPhone("");
  };

  const deleteSupplier = (id) => {
    if(window.confirm("Delete this supplier?")) {
      axios.delete(`http://localhost:5000/suppliers/${id}`).then(fetchSuppliers);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl flex justify-center font-bold mb-4">Suppliers Management</h2>

      <div className="flex justify-center mb-6">
        <div className="bg-white p-4 shadow w-full max-w-md rounded border-t-4 border-green-500">
          <input className="border p-2 w-full mb-2" placeholder="Supplier Name" value={supplier_name} onChange={(e) => setName(e.target.value)} />
          <input className="border p-2 w-full mb-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="border p-2 w-full mb-4" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          
          <div className="flex gap-2">
            <button onClick={handleSave} className={`p-2 w-full text-white rounded font-bold ${editId ? 'bg-orange-500' : 'bg-green-600'}`}>
              {editId ? "Update Supplier" : "Add Supplier"}
            </button>
            {editId && <button onClick={clearForm} className="bg-gray-500 text-white p-2 rounded">Cancel</button>}
          </div>
        </div>
      </div>

      <table className="w-full bg-white shadow text-center text-sm">
        <thead className="bg-gray-200">
          <tr><th>ID</th><th>Supplier Name</th><th>Email</th><th>Phone</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {suppliers.map(s => (
            <tr key={s.supplier_id} className="border-t hover:bg-gray-50">
              <td className="p-2">{s.supplier_id}</td>
              <td>{s.supplier_name}</td>
              <td>{s.email}</td>
              <td>{s.phone}</td>
              <td className="p-2 flex justify-center gap-3">
                <button onClick={() => handleEdit(s)} className="text-blue-600 font-bold hover:underline">Edit</button>
                <button onClick={() => deleteSupplier(s.supplier_id)} className="text-red-600 font-bold hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Suppliers;