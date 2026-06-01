// ============ GESTION DES DONNÉES LOCALES ============
const DataManager = {
  // Initialiser le localStorage avec des données par défaut
  init() {
    if (!localStorage.getItem('agriflow_data')) {
      const defaultData = {
        commandes: [
          { id: 1, numero: 'CMD001', client: 'Jean Dupont', montant: 1250, date: '2026-05-28', statut: 'Livrée' },
          { id: 2, numero: 'CMD002', client: 'Marie Martin', montant: 850, date: '2026-05-29', statut: 'En cours' }
        ],
        clients: [
          { id: 1, nom: 'Jean Dupont', email: 'jean@email.com', tel: '06 12 34 56 78', adresse: '123 Rue de la Ferme' },
          { id: 2, nom: 'Marie Martin', email: 'marie@email.com', tel: '06 98 76 54 32', adresse: '456 Avenue du Champ' }
        ],
        factures: [
          { id: 1, numero: 'FAC001', client: 'Jean Dupont', montant: 1250, echéance: '2026-05-30', statut: 'Payée' },
          { id: 2, numero: 'FAC002', client: 'Marie Martin', montant: 850, echéance: '2026-06-05', statut: 'En attente' },
          { id: 3, numero: 'FAC003', client: 'Pierre Moreau', montant: 620, echéance: '2026-05-20', statut: 'En retard' }
        ]
      };
      localStorage.setItem('agriflow_data', JSON.stringify(defaultData));
    }
  },

  // Obtenir toutes les données
  getAll() {
    return JSON.parse(localStorage.getItem('agriflow_data') || '{}');
  },

  // Obtenir une catégorie spécifique
  getCategory(category) {
    return this.getAll()[category] || [];
  },

  // Ajouter un élément
  add(category, item) {
    const data = this.getAll();
    const id = Math.max(...data[category].map(i => i.id), 0) + 1;
    item.id = id;
    data[category].push(item);
    localStorage.setItem('agriflow_data', JSON.stringify(data));
    return item;
  },

  // Supprimer un élément
  delete(category, id) {
    const data = this.getAll();
    data[category] = data[category].filter(item => item.id !== id);
    localStorage.setItem('agriflow_data', JSON.stringify(data));
  },

  // Mettre à jour un élément
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

// Fermer modal en cliquant en dehors
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
    
    // Désactiver tous les onglets et sections
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    
    // Activer l'onglet et la section cliqués
    this.classList.add('active');
    document.getElementById(sectionId).classList.add('active');
  });
});

// ============ GESTION DES FORMULAIRES ============
function submitForm(event, type) {
  event.preventDefault();
  
  const formData = new FormData(event.target);
  const data = Object.fromEntries(formData);
  
  // Récupérer les valeurs du formulaire
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
  }
  
  // Ajouter les données
  const mapping = {
    'commande': 'commandes',
    'client': 'clients',
    'facture': 'factures'
  };
  
  DataManager.add(mapping[type], item);
  showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} créé(e) avec succès!`, 'success');
  
  // Fermer le modal
  closeModal(`modal-${type}`);
  
  // Réinitialiser le formulaire
  event.target.reset();
  
  // Mettre à jour l'affichage
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

function filterFactures() {
  const filter = document.getElementById('filter-status').value;
  showNotification(`Filtre appliqué: ${filter || 'Tous'}`, 'info');
  // À développer: filtrer les factures
}

// ============ MISE À JOUR DE L'AFFICHAGE ============
function updateDisplay() {
  updateStats();
  updateCommandesDisplay();
  updateClientsDisplay();
  updateFacturesDisplay();
}

function updateStats() {
  const data = DataManager.getAll();
  
  // Calculer le CA total
  const ca = data.factures.reduce((sum, f) => f.statut === 'Payée' ? sum + f.montant : sum, 0);
  document.getElementById('ca-value').textContent = ca.toLocaleString('fr-FR') + ' €';
  
  // Nombre de commandes
  document.getElementById('cmd-value').textContent = data.commandes.length;
  
  // Nombre de clients
  document.getElementById('cli-value').textContent = data.clients.length;
  
  // Factures impayées
  const impayees = data.factures.filter(f => f.statut !== 'Payée').length;
  document.getElementById('fact-value').textContent = impayees;
}

function updateCommandesDisplay() {
  const data = DataManager.getCategory('commandes');
  const cmdList = document.getElementById('cmd-list');
  
  cmdList.innerHTML = data.map(cmd => `
    <div class="list-item">
      <div class="list-header">
        <span>#${cmd.numero}</span>
        <span class="badge badge-${cmd.statut === 'Livrée' ? 'success' : 'warning'}">
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

function updateClientsDisplay() {
  const data = DataManager.getCategory('clients');
  const clientsList = document.getElementById('clients-list');
  
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

function updateFacturesDisplay() {
  const data = DataManager.getCategory('factures');
  const factList = document.getElementById('factures-list');
  
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

// ============ GRAPHIQUE SIMPLE ============
function drawChart() {
  const canvas = document.getElementById('revenueChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  
  // Données fictives
  const data = [18450, 15600, 19200, 17800, 18900, 20100];
  const maxValue = Math.max(...data);
  const barWidth = width / data.length;
  
  // Effacer le canvas
  ctx.fillStyle = '#f6f6f6';
  ctx.fillRect(0, 0, width, height);
  
  // Dessiner les barres
  data.forEach((value, index) => {
    const barHeight = (value / maxValue) * (height - 20);
    const x = index * barWidth + 10;
    const y = height - barHeight - 10;
    
    // Gradient de couleur
    const gradient = ctx.createLinearGradient(x, y, x, height - 10);
    gradient.addColorStop(0, '#4caf50');
    gradient.addColorStop(1, '#2e7d32');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(x, y, barWidth - 15, barHeight);
    
    // Label
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText((value / 1000).toFixed(0) + 'k€', x + barWidth / 2 - 7.5, height - 5);
  });
}

// ============ RECHERCHE ============
document.addEventListener('DOMContentLoaded', function() {
  // Initialiser les données
  DataManager.init();
  updateDisplay();
  drawChart();
  
  // Recherche dans les commandes
  const searchCmd = document.getElementById('search-cmd');
  if (searchCmd) {
    searchCmd.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      // À développer: filtrer les commandes
      showNotification(`Recherche: ${term}`, 'info');
    });
  }
  
  // Recherche dans les clients
  const searchClients = document.getElementById('search-clients');
  if (searchClients) {
    searchClients.addEventListener('input', function() {
      const term = this.value.toLowerCase();
      // À développer: filtrer les clients
      showNotification(`Recherche: ${term}`, 'info');
    });
  }
});

// ============ GESTION DE LA TAILLE D'ÉCRAN ============
window.addEventListener('resize', function() {
  // Redessiner le graphique en responsive
  if (document.getElementById('revenueChart')) {
    drawChart();
  }
});
