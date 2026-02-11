import { useEffect, useState } from "react";
import axios from "axios";

function Home({ setPage }) {
  const [counts, setCounts] = useState({ 
    books: 0, 
    members: 0, 
    borrows: 0, 
    pubs: 0,
    supps: 0 // Added suppliers count
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [b, m, br, p, s] = await Promise.all([
          axios.get("http://localhost:5000/books"),
          axios.get("http://localhost:5000/members"),
          axios.get("http://localhost:5000/borrows"),
          axios.get("http://localhost:5000/publishers"),
          axios.get("http://localhost:5000/suppliers") // Fetching suppliers
        ]);
        setCounts({ 
          books: b.data.length, 
          members: m.data.length, 
          borrows: br.data.length, 
          pubs: p.data.length,
          supps: s.data.length // Setting suppliers
        });
      } catch (err) { 
        console.error("Dashboard error:", err); 
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="h-full flex flex-col p-2 overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="mb-4">
        <h1 className="text-3xl font-extrabold text-gray-900 leading-none">LYBRARY MANAGMENT SYSTEM</h1>
        <p className="text-gray-500 text-sm">System Overview</p>
      </div>

      {/* 2. Stats Grid - Added Suppliers Card */}
      <div className="grid grid-cols-5 gap-4 mb-4">
        <StatCard title="Books" count={counts.books} icon="📚" color="border-blue-300" />
        <StatCard title="Members" count={counts.members} icon="👥" color="border-green-300" />
        <StatCard title="Borrows" count={counts.borrows} icon="📖" color="border-indigo-300" />
        <StatCard title="Publishers" count={counts.pubs} icon="🏢" color="border-orange-300" />
        <StatCard title="Suppliers" count={counts.supps} icon="🚚" color="border-red-300" />
      </div>

      {/* 3. Quick Operations - Added Suppliers Button */}
      <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><span>⚡</span> Quick Operations</h2>
        
        <div className="grid grid-cols-3 gap-6 flex-1">
          <OpBtn label="Books" icon="📚" color="bg-blue-300" onClick={() => setPage('books')} />
          <OpBtn label="Members" icon="👥" color="bg-green-300" onClick={() => setPage('members')} />
          <OpBtn label="Borrows" icon="📖" color="bg-indigo-300" onClick={() => setPage('borrows')} />
          <OpBtn label="Suppliers" icon="🚚" color="bg-red-300" onClick={() => setPage('suppliers')} />
          <OpBtn label="Publishers" icon="🏢" color="bg-orange-300" onClick={() => setPage('publishers')} />
          <OpBtn label="Refresh Dashboard" icon="🏠" color="bg-slate-700" onClick={() => setPage('home')} />
        </div>
      </div>
      
      
      {/* 4. Footer */}
      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400">
        <span>Server Status: <span className="text-green-500 font-bold">CONNECTED</span></span>
        
        <span>Version 1.0.4</span>
       
      </div>

<div className="py-2 text-center  italic">Designed by SANTA
        {/* <p className="text-gray-600 font-medium italic">Designed by SANTA  </p> */}
      </div> 

    </div>
    
  );
}

// Compact Stat Card
function StatCard({ title, count, icon, color }) {
  return (
    <div className={`bg-white p-3 rounded-xl border-t-4 ${color} shadow-sm flex items-center justify-between`}>
      <div>
        <p className="text-gray-400 text-[10px] font-bold uppercase">{title}</p>
        <p className="text-xl font-bold text-gray-800">{count}</p>
      </div>
      <span className="text-2xl opacity-80">{icon}</span>
    </div>
  );
}

// Giant Quick Operation Button
function OpBtn({ label, icon, color, onClick }) {
  return (
    <button 
      onClick={onClick} 
      className={`${color} text-white rounded-2xl flex flex-col items-center justify-center gap-4 hover:brightness-110 hover:shadow-lg transition-all active:scale-95 h-full`}
    >
      <span className="text-5xl">{icon}</span>
      <span className="text-lg font-bold">{label}</span>
    </button>
  );
}

export default Home;