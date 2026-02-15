import { useEffect, useState } from "react";
import api from "../api";

function Home({ setPage }) {
  const [counts, setCounts] = useState({ 
    books: 0, members: 0, borrows: 0, pubs: 0, supps: 0 
  });

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const [b, m, br, p, s] = await Promise.all([
          api.get("/books"),
          api.get("/members"),
          api.get("/borrows"),
          api.get("/publishers"),
          api.get("/suppliers")
        ]);
        setCounts({ 
          books: b.data.length, 
          members: m.data.length, 
          borrows: br.data.length, 
          pubs: p.data.length,
          supps: s.data.length 
        });
      } catch (err) { 
        console.error("Dashboard error:", err); 
      }
    };
    fetchCounts();
  }, []);

  return (
    <div className="h-full flex flex-col p-2 overflow-y-auto">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
        <StatCard title="Books" count={counts.books} icon="📚" color="border-blue-500" />
        <StatCard title="Members" count={counts.members} icon="👥" color="border-green-500" />
        <StatCard title="Borrows" count={counts.borrows} icon="📝" color="border-purple-500" />
        <StatCard title="Publishers" count={counts.pubs} icon="🏢" color="border-orange-500" />
        <StatCard title="Suppliers" count={counts.supps} icon="🚚" color="border-red-500" />
      </div>

      <div className="flex-grow grid grid-cols-2 gap-3 mb-4">
        <OpBtn label="Issue Book" icon="📤" color="bg-blue-50" onClick={() => setPage('borrows')} />
        <OpBtn label="New Member" icon="👤" color="bg-green-50" onClick={() => setPage('members')} />
        <OpBtn label="Add Book" icon="➕" color="bg-purple-50" onClick={() => setPage('books')} />
        <OpBtn label="Reports" icon="📊" color="bg-orange-50" onClick={() => setPage('home')} />
      </div>

      <div className="pt-2 flex justify-between items-center text-[10px] text-gray-400">
        <span>Server Status: <span className="text-green-500 font-bold">CONNECTED</span></span>
        <span>Version 1.0.4</span>
      </div>
      <div className="py-2 text-center italic">Designed by N.Elyse</div>
    </div>
  );
}

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

function OpBtn({ label, icon, color, onClick }) {
  return (
    <button onClick={onClick} className={`${color} p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:scale-95 transition-transform border border-gray-100 shadow-sm`}>
      <span className="text-3xl">{icon}</span>
      <span className="font-bold text-gray-700 text-sm">{label}</span>
    </button>
  );
}

export default Home;