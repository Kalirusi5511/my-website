// ===== INIT LOCAL STORAGE =====
let users = JSON.parse(localStorage.getItem('users') || '[]');
let studios = JSON.parse(localStorage.getItem('studios') || '[]');
let requests = JSON.parse(localStorage.getItem('requests') || '[]');
let currentUser = null;

// ===== SICHERE OWNER-INITIALISIERUNG =====
(function initOwner(){
  if (!users.some(u => u.role === 'owner')) {
    users.push({
      name: 'Owner',
      pw: '1234',
      role: 'owner',
      tableLimit: 999,
      tablesUsed: 0
    });
    console.warn('Default Owner erstellt: Owner / 1234');
    save();
  }
})();
