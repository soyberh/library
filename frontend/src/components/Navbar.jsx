function Navbar({ setPage, currentPage }) {
  const navItems = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'books', label: 'Books', icon: '📚' },
    { id: 'members', label: 'Members', icon: '👥' },
    { id: 'suppliers', label: 'Suppliers', icon: '🚚' },
    { id: 'publishers', label: 'Publishers', icon: '🏢' },
    { id: 'borrows', label: 'Borrows', icon: '📖' },
  ];

  return (
    <nav className="w-64 bg-slate-900 text-white min-h-screen flex flex-col shadow-2xl fixed left-0 top-0">
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-2xl font-bold text-blue-400 tracking-tighter">
          LIB<span className="text-white">SYS</span>
        </h1>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">Management v1.0</p>
      </div>

      {/* Navigation Links */}
      <div className="Flex-grow p-4 space-y-2 mt-4">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
              ${currentPage === item.id 
                ? 'bg-blue-600 text-white shadow-lg' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
          >
            <span className="text-xl group-hover:scale-110 transition-transform">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-slate-800 text-slate-500 text-xs text-center">
        &copy; 2026 Library Admin
      </div>
    </nav>
  );
}

export default Navbar;