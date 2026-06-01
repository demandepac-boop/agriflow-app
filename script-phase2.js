// ============ GESTION DES DONNÉES LOCALES ============
const DataManager = {
  init() {
    if (!localStorage.getItem('agriflow_data')) {
      const defaultData = {
        commandes: [
          { id: 1, numero: 'CMD001', client: 'Jean Dupont', montant: 1250, date: '2026-05-28', statut: 'Livrée' },
          { id: 2, numero: 'CMD002', client: 'Marie Martin', montant: 850, date: '2026-05-29', statut: 'En cours' },
          { id: 3, numero: 'CMD003', client: 'Pierre Moreau', montant: 2100, date: '2026-05-27', statut: 'Livrée' },
          { id: 4, numero: 'CMD004', client: 'Jean Dupont', montant: 450, date: '2026-05-30', statut: 'En cours' }
        ],
        clients: [
          { id: 1, nom: 'Jean Dupont', email: 'jean@email.com', tel: '06 12 34 56 78', adresse: '123 Rue de la Ferme' },
          { id: 2, nom: 'Marie Martin', email: 'marie@email.com', tel: '06 98 76 54 32', adresse: '456 Avenue du Champ' },
          { id: 3, nom: 'Pierre Moreau', email: 'pierre@email.com', tel: '06 45 67 89 01', adresse: '789 Chemin Rural' }
        ],
        factures: [
          { id: 1, numero: 'FAC001', client: 'Jean Dupont', montant: 1250, date: '2026-05-28', echéance: '2026-05-30', statut: 'Payée' },
          { id: 2, numero: 'FAC002', client: 'Marie Martin', montant: 850, date: '2026-05-29', echéance: '2026-06-05', statut: 'En attente' },
          { id: 3, numero: 'FAC003', client: 'Pierre Moreau', montant: 2100, date: '2026-05-27', echéance: '2026-05-20', statut: 'En retard' },
          { id: 4, numero: 'FAC004', client: 'Jean Dupont', montant: 450, date: '2026-05-30', echéance: '2026-06-10', statut: 'En attente' }
        ]
      };
      localStorage.setItem('agriflow_data', JSON.stringify(defaultData));
    }
  },

  getAll() {
    return JSON.parse(localStorage.getItem('agriflow_data') || '{}');
  },

  getCategory(category) {
    return this.getAll()[category] || [];
  },

  add(category, item) {
    const data = this.getAll();
    const id = Math.max(...data[category].map(i => i.id), 0) + 1;
    item.id = id;
    data[category].push(item);
    localStorage.setItem('agriflow_data', JSON.stringify(data));
    return item;
  },

  delete(category, id) {
    const data = this.getAll();
    data[category] = data[category].filter(item => item.id !== id);
    localStorage.setItem('agriflow_data', JSON.stringify(data));
  },

  update(category, id, updatedItem) {
    const data = this.getAll();
    const index = data[category].findIndex(item => item.id === id);
    if (index !== -1) {
      data[category][index] = { ...data[category][index], ...updatedItem };
      localStorage.setItem('agriflow_data', JSON.stringify(data));
    }
  }
};

// ============ GESTION DES MODALES ============
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
    modal.style.display = 'flex';
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
    modal.style.display = 'none';
  }
}

window.addEventListener('click', function(event) {
  if (event.target.classList.contains('modal')) {
    event.target.classList.remove('active');
    event.target.style.display = 'none';
  }
});

// ============ GESTION DES NOTIFICATIONS ============
function showNotification(message, type = 'info', duration = 3000) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  notification.className = `notification active ${type}`;
  
  setTimeout(() => {
    notification.classList.remove('active');
  }, duration);
}

// ============ GESTION DES ONGLETS/SECTIONS ============
document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    const sectionId = this.getAttribute('data-section');
    
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    this.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
  });
});

// ============ GESTION DES FORMULAIRES ============
function submitForm(event, type) {
  event.preventDefault();
  
  const inputs = event.target.querySelectorAll('input, select');
  const item = {};
  
  if (type === 'commande') {
    item.numero = inputs[0].value;
    item.client = inputs[1].value;
    item.montant = parseFloat(inputs[2].value);
    item.date = inputs[3].value;
    item.statut = inputs[4].value;
  } else if (type === 'client') {
    item.nom = inputs[0].value;
    item.email = inputs[1].value;
    item.tel = inputs[2].value;
    item.adresse = inputs[3].value;
  } else if (type === 'facture') {
    item.numero = inputs[0].value;
    item.client = inputs[1].value;
    item.montant = parseFloat(inputs[2].value);
    item.date = inputs[3].value;
    item.echéance = inputs[4].value;
    item.statut = 'En attente';
  }
  
  const mapping = {
    'commande': 'commandes',
    'client': 'clients',
    'facture': 'factures'
  };
  
  DataManager.add(mapping[type], item);
  showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} créé(e) avec succès!`, 'success');
  
  closeModal(`modal-${type}`);
  event.target.reset();
  
  updateDisplay();
}

// ============ GESTION DES ACTIONS ============
function deleteItem(type, id) {
  if (confirm('Êtes-vous sûr de vouloir supprimer cet élément?')) {
    const mapping = {
      'cmd': 'commandes',
      'client': 'clients',
      'fact': 'factures'
    };
    
    DataManager.delete(mapping[type], id);
    showNotification('Élément supprimé avec succès!', 'success');
    updateDisplay();
  }
}

function editItem(type, id) {
  showNotification(`Édition de l'élément #${id} - Fonctionnalité en développement`, 'info');
}

function viewInvoice(id) {
  const factures = DataManager.getCategory('factures');
  const facture = factures.find(f => f.id === id);
  if (facture) {
    showNotification(`Facture: ${facture.numero} - ${facture.montant}€`, 'info');
  }
}

function resetData() {
  if (confirm('Êtes-vous sûr? Toutes les données seront réinitialisées!')) {
    localStorage.removeItem('agriflow_data');
    DataManager.init();
    showNotification('Données réinitialisées!', 'warning');
    updateDisplay();
  }
}

// ============ MISE À JOUR DE L'AFFICHAGE ============
function updateDisplay() {
  updateStats();
  updateCommandesDisplay();
  updateClientsDisplay();
  updateFacturesDisplay();
  if (document.getElementById('dashboard').classList.contains('active')) {
    initCharts();
  }
}

function updateStats() {
  const data = DataManager.getAll();
  
  const ca = data.factures.reduce((sum, f) => f.statut === 'Payée' ? sum + f.montant : sum, 0);
  document.getElementById('ca-value').textContent = ca.toLocaleString('fr-FR') + ' €';
  
  document.getElementById('cmd-value').textContent = data.commandes.length;
  document.getElementById('cli-value').textContent = data.clients.length;
  
  const impayees = data.factures.filter(f => f.statut !== 'Payée').length;
  document.getElementById('fact-value').textContent = impayees;
}

function updateCommandesDisplay(filtered = null) {
  const data = filtered || DataManager.getCategory('commandes');
  const cmdList = document.getElementById('cmd-list');
  
  if (!data.length) {
    cmdList.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">Aucune commande trouvée</div>';
    return;
  }
  
  cmdList.innerHTML = data.map(cmd => `
    <div class="list-item">
      <div class="list-header">
        <span>#${cmd.numero}</span>
        <span class="badge badge-${cmd.statut === 'Livrée' ? 'success' : cmd.statut === 'En cours' ? 'warning' : 'danger'}">
          ${cmd.statut}
        </span>
      </div>
      <div class="list-details">Client: ${cmd.client} | ${cmd.montant}€ | ${cmd.date}</div>
      <div class="list-actions">
        <button class="btn-sm btn-info" onclick="editItem('cmd', ${cmd.id})">Modifier</button>
        <button class="btn-sm btn-danger" onclick="deleteItem('cmd', ${cmd.id})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function updateClientsDisplay(filtered = null) {
  const data = filtered || DataManager.getCategory('clients');
  const clientsList = document.getElementById('clients-list');
  
  if (!data.length) {
    clientsList.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">Aucun client trouvé</div>';
    return;
  }
  
  clientsList.innerHTML = data.map(client => `
    <div class="list-item">
      <div class="list-header">
        <span>${client.nom}</span>
        <span class="badge badge-success">Actif</span>
      </div>
      <div class="list-details">📧 ${client.email} | 📞 ${client.tel}</div>
      <div class="list-actions">
        <button class="btn-sm btn-info" onclick="editItem('client', ${client.id})">Modifier</button>
        <button class="btn-sm btn-danger" onclick="deleteItem('client', ${client.id})">Supprimer</button>
      </div>
    </div>
  `).join('');
}

function updateFacturesDisplay(filtered = null) {
  const data = filtered || DataManager.getCategory('factures');
  const factList = document.getElementById('factures-list');
  
  if (!data.length) {
    factList.innerHTML = '<div style="text-align:center; padding:20px; color:#999;">Aucune facture trouvée</div>';
    return;
  }
  
  factList.innerHTML = data.map(fact => {
    let badgeClass = 'success';
    if (fact.statut === 'En attente') badgeClass = 'warning';
    if (fact.statut === 'En retard') badgeClass = 'danger';
    
    return `
      <div class="list-item">
        <div class="list-header">
          <span>#${fact.numero}</span>
          <span class="badge badge-${badgeClass}">
            ${fact.statut}
          </span>
        </div>
        <div class="list-details">
          ${fact.client} | ${fact.montant}€ | Échéance: ${fact.echéance}
          ${fact.statut === 'En retard' ? ' ⚠️' : ''}
        </div>
        <div class="list-actions">
          <button class="btn-sm btn-info" onclick="viewInvoice(${fact.id})">Voir</button>
          <button class="btn-sm btn-danger" onclick="deleteItem('fact', ${fact.id})">Supprimer</button>
        </div>
      </div>
    `;
  }).join('');
}

// ============ RECHERCHE EN TEMPS RÉEL ============
let searchTimeout;

function searchCommandes(term) {
  const data = DataManager.getCategory('commandes');
  const filtered = data.filter(cmd => 
    cmd.numero.toLowerCase().includes(term.toLowerCase()) ||
    cmd.client.toLowerCase().includes(term.toLowerCase()) ||
    cmd.montant.toString().includes(term)
  );
  updateCommandesDisplay(filtered);
}

function searchClients(term) {
  const data = DataManager.getCategory('clients');
  const filtered = data.filter(client => 
    client.nom.toLowerCase().includes(term.toLowerCase()) ||
    client.email.toLowerCase().includes(term.toLowerCase()) ||
    client.tel.includes(term)
  );
  updateClientsDisplay(filtered);
}

function searchAndFilterFactures(term, status = '') {
  const data = DataManager.getCategory('factures');
  let filtered = data.filter(fact => 
    fact.numero.toLowerCase().includes(term.toLowerCase()) ||
    fact.client.toLowerCase().includes(term.toLowerCase())
  );
  
  if (status) {
    filtered = filtered.filter(f => f.statut === status);
  }
  
  updateFacturesDisplay(filtered);
}

// Event listeners pour la recherche
document.addEventListener('DOMContentLoaded', function() {
  DataManager.init();
  updateDisplay();
  
  // Recherche Commandes
  const searchCmd = document.getElementById('search-cmd');
  if (searchCmd) {
    searchCmd.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchCommandes(this.value);
      }, 300);
    });
  }
  
  // Recherche Clients
  const searchClients = document.getElementById('search-clients');
  if (searchClients) {
    searchClients.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        searchClients(this.value);
      }, 300);
    });
  }
  
  // Recherche Factures
  const searchFactures = document.getElementById('search-factures');
  if (searchFactures) {
    searchFactures.addEventListener('input', function() {
      clearTimeout(searchTimeout);
      searchTimeout = setTimeout(() => {
        filterAndSearchFactures();
      }, 300);
    });
  }
});

function filterAndSearchFactures() {
  const term = document.getElementById('search-factures')?.value || '';
  const status = document.getElementById('filter-status')?.value || '';
  searchAndFilterFactures(term, status);
}

// ============ GRAPHIQUES AVEC CHART.JS ============
let charts = {};

function initCharts() {
  const data = DataManager.getAll();
  
  // Graphique Chiffre d'affaires
  drawRevenueChart(data.factures);
  
  // Graphique Factures
  drawInvoiceChart(data.factures);
  
  // Graphique Commandes
  drawOrdersChart(data.commandes);
  
  // Graphique Top Clients
  drawClientsChart(data);
}

function drawRevenueChart(factures) {
  const ctx = document.getElementById('revenueChart');
  if (!ctx) return;
  
  if (charts.revenue) charts.revenue.destroy();
  
  const labels = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin'];
  const revenues = [18450, 15600, 19200, 17800, 18900, 20100];
  
  charts.revenue = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'CA (€)',
        data: revenues,
        borderColor: '#2e7d32',
        backgroundColor: 'rgba(46, 125, 50, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 6,
        pointBackgroundColor: '#4caf50',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: { display: true, position: 'top' }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { callback: function(value) { return value.toLocaleString() + '€'; } }
        }
      }
    }
  });
}

function drawInvoiceChart(factures) {
  const ctx = document.getElementById('invoiceChart');
  if (!ctx) return;
  
  if (charts.invoice) charts.invoice.destroy();
  
  const paid = factures.filter(f => f.statut === 'Payée').length;
  const pending = factures.filter(f => f.statut === 'En attente').length;
  const overdue = factures.filter(f => f.statut === 'En retard').length;
  
  charts.invoice = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ['Payées', 'En attente', 'En retard'],
      datasets: [{
        data: [paid, pending, overdue],
        backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
        borderColor: '#fff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: 'bottom' }
      }
    }
  });
}

function drawOrdersChart(commandes) {
  const ctx = document.getElementById('ordersChart');
  if (!ctx) return;
  
  if (charts.orders) charts.orders.destroy();
  
  const delivered = commandes.filter(c => c.statut === 'Livrée').length;
  const pending = commandes.filter(c => c.statut === 'En cours').length;
  const cancelled = commandes.filter(c => c.statut === 'Annulée').length;
  
  charts.orders = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Livrées', 'En cours', 'Annulées'],
      datasets: [{
        label: 'Nombre de commandes',
        data: [delivered, pending, cancelled],
        backgroundColor: ['#4caf50', '#2196f3', '#f44336']
      }]
    },
    options: {
      responsive: true,
      indexAxis: 'y',
      plugins: {
        legend: { display: true }
      }
    }
  });
}

function drawClientsChart(data) {
  const ctx = document.getElementById('clientsChart');
  if (!ctx) return;
  
  if (charts.clients) charts.clients.destroy();
  
  // Compter les commandes par client
  const clientCounts = {};
  data.commandes.forEach(cmd => {
    clientCounts[cmd.client] = (clientCounts[cmd.client] || 0) + 1;
  });
  
  const sorted = Object.entries(clientCounts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  const labels = sorted.map(([name]) => name);
  const values = sorted.map(([, count]) => count);
  
  charts.clients = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Nombre de commandes',
        data: values,
        backgroundColor: '#2196f3'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      },
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// ============ EXPORT EN PDF ============
function exportToPDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFontSize(16);
  doc.text('AgriFlow - Rapport complet', 14, 22);
  doc.setFontSize(10);
  doc.text(`Généré le: ${new Date().toLocaleDateString('fr-FR')}`, 14, 30);
  
  const data = DataManager.getAll();
  let yPos = 40;
  
  // Factures
  doc.setFontSize(12);
  doc.text('📄 Factures', 14, yPos);
  yPos += 10;
  
  const factureRows = data.factures.map(f => [f.numero, f.client, f.montant + '€', f.statut]);
  doc.autoTable({
    head: [['Numéro', 'Client', 'Montant', 'Statut']],
    body: factureRows,
    startY: yPos,
    margin: 14,
    theme: 'grid'
  });
  
  yPos = doc.lastAutoTable.finalY + 15;
  
  // Commandes
  doc.addPage();
  doc.setFontSize(12);
  doc.text('📦 Commandes', 14, 22);
  
  const cmdRows = data.commandes.map(c => [c.numero, c.client, c.montant + '€', c.statut]);
  doc.autoTable({
    head: [['Numéro', 'Client', 'Montant', 'Statut']],
    body: cmdRows,
    startY: 35,
    margin: 14,
    theme: 'grid'
  });
  
  // Résumé financier
  doc.addPage();
  doc.setFontSize(12);
  doc.text('💰 Résumé financier', 14, 22);
  
  const totalCA = data.factures.reduce((sum, f) => sum + f.montant, 0);
  const totalPaid = data.factures.filter(f => f.statut === 'Payée').reduce((sum, f) => sum + f.montant, 0);
  const totalPending = data.factures.filter(f => f.statut !== 'Payée').reduce((sum, f) => sum + f.montant, 0);
  
  doc.setFontSize(11);
  doc.text(`CA Total: ${totalCA.toLocaleString('fr-FR')}€`, 14, 35);
  doc.text(`Facturé payé: ${totalPaid.toLocaleString('fr-FR')}€`, 14, 45);
  doc.text(`Facturé à percevoir: ${totalPending.toLocaleString('fr-FR')}€`, 14, 55);
  
  doc.save('AgriFlow-Rapport.pdf');
  showNotification('PDF exporté avec succès! 📄', 'success');
}

// ============ EXPORT EN CSV ============
function exportToCSV() {
  const data = DataManager.getAll();
  let csv = 'AGRIFLOW - EXPORT COMPLET\n\n';
  
  // Factures
  csv += 'FACTURES\n';
  csv += 'Numéro,Client,Montant,Date,Échéance,Statut\n';
  data.factures.forEach(f => {
    csv += `${f.numero},"${f.client}",${f.montant},${f.date},${f.echéance},${f.statut}\n`;
  });
  
  csv += '\n\nCOMMANDES\n';
  csv += 'Numéro,Client,Montant,Date,Statut\n';
  data.commandes.forEach(c => {
    csv += `${c.numero},"${c.client}",${c.montant},${c.date},${c.statut}\n`;
  });
  
  csv += '\n\nCLIENTS\n';
  csv += 'Nom,Email,Téléphone,Adresse\n';
  data.clients.forEach(cl => {
    csv += `"${cl.nom}","${cl.email}","${cl.tel}","${cl.adresse}"\n`;
  });
  
  downloadCSV(csv, 'AgriFlow-Complet.csv');
}

function exportCommandesCSV() {
  const data = DataManager.getCategory('commandes');
  let csv = 'Numéro,Client,Montant,Date,Statut\n';
  data.forEach(c => {
    csv += `${c.numero},"${c.client}",${c.montant},${c.date},${c.statut}\n`;
  });
  downloadCSV(csv, 'Commandes.csv');
}

function exportClientsCSV() {
  const data = DataManager.getCategory('clients');
  let csv = 'Nom,Email,Téléphone,Adresse\n';
  data.forEach(cl => {
    csv += `"${cl.nom}","${cl.email}","${cl.tel}","${cl.adresse}"\n`;
  });
  downloadCSV(csv, 'Clients.csv');
}

function exportFacturesCSV() {
  const data = DataManager.getCategory('factures');
  let csv = 'Numéro,Client,Montant,Date,Échéance,Statut\n';
  data.forEach(f => {
    csv += `${f.numero},"${f.client}",${f.montant},${f.date},${f.echéance},${f.statut}\n`;
  });
  downloadCSV(csv, 'Factures.csv');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  showNotification(`${filename} téléchargé avec succès! 📊`, 'success');
}

// Initialiser les graphiques quand on change de section
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      if (this.getAttribute('data-section') === 'dashboard') {
        setTimeout(() => initCharts(), 100);
      }
    });
  });
});

window.addEventListener('resize', function() {
  if (document.getElementById('dashboard').classList.contains('active')) {
    setTimeout(() => {
      Object.values(charts).forEach(chart => chart?.resize());
    }, 100);
  }
});
