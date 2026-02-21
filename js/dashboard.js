/**
 * Dashboard Module - Handles all dashboard interactions and updates
 */

const Dashboard = {
  categories: ['Food', 'Rent', 'Travel', 'EMI', 'Shopping', 'Bills', 'Investment', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other'],
  paymentMethods: ['Cash', 'Debit Card', 'Credit Card', 'UPI', 'Bank Transfer', 'Wallet', 'Cheque', 'Other'],

  /**
   * Initialize dashboard
   */
  init() {
    Auth.ensureLoggedIn();
    this.displayUserGreeting();
    this.setupEventListeners();
    this.updateDashboard();
    this.populateAccountSelects();
    this.populateCategorySelect();
    this.populatePaymentMethodSelect();
  },

  /**
   * Display user greeting with first name
   */
  displayUserGreeting() {
    const currentUser = Storage.getCurrentUser();
    if (currentUser && currentUser.name) {
      const firstName = currentUser.name.split(' ')[0];
      const greetingElement = document.getElementById('userGreeting');
      if (greetingElement) {
        greetingElement.textContent = `Welcome back, ${firstName}!`;
      }
    }
  },

  /**
   * Setup all event listeners
   */
  setupEventListeners() {
    // Add Account Form
    const addAccountForm = document.getElementById('addAccountForm');
    if (addAccountForm) {
      addAccountForm.addEventListener('submit', (e) => this.handleAddAccount(e));
    }

    // Add Transaction Form
    const addTransactionForm = document.getElementById('addTransactionForm');
    if (addTransactionForm) {
      addTransactionForm.addEventListener('submit', (e) => this.handleAddTransaction(e));
    }

    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('click', () => this.toggleDarkMode());
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
      logoutBtn.addEventListener('click', () => Auth.logout());
    }

    // Mobile menu toggle
    const menuToggle = document.getElementById('menuToggle');
    if (menuToggle) {
      menuToggle.addEventListener('click', () => this.toggleSidebar());
    }

    // Sidebar header toggle
    const sidebarHeader = document.querySelector('.sidebar-header');
    if (sidebarHeader) {
      sidebarHeader.addEventListener('click', () => this.toggleSidebar());
    }

    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        window.openAccountSettings();
      });
    }

    // Clear input errors on focus
    document.querySelectorAll('input, select').forEach(field => {
      field.addEventListener('focus', function() {
        this.classList.remove('error');
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      });
    });
  },

  /**
   * Toggle dark mode
   */
  toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    const darkModeIcon = document.getElementById('darkModeIcon');
    if (darkModeIcon) {
      darkModeIcon.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    }
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  },

  /**
   * Apply saved dark mode preference
   */
  applyDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
      const darkModeIcon = document.getElementById('darkModeIcon');
      if (darkModeIcon) {
        darkModeIcon.textContent = '☀️';
      }
    }
  },

  /**
   * Toggle mobile menu
   */
  toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('expanded');
    }
  },

  /**
   * Update entire dashboard
   */
  updateDashboard() {
    this.updateSummaryCards();
    this.displayAccounts();
    this.displayTransactions();
    this.displaySpendingBreakdown();
    this.updateFinancialInsights();
    Charts.refreshAllCharts();
  },

  /**
   * Update summary cards
   */
  updateSummaryCards() {
    const analytics = Storage.getSpendingAnalytics();
    const totalBalance = Storage.getTotalBalance();

    document.getElementById('totalBalanceAmount').textContent = '₹' + totalBalance.toFixed(2);
    document.getElementById('totalCreditAmount').textContent = '₹' + analytics.totalCredit.toFixed(2);
    document.getElementById('totalDebitAmount').textContent = '₹' + analytics.totalDebit.toFixed(2);
    document.getElementById('netSavingsAmount').textContent = '₹' + analytics.netSavings.toFixed(2);

    // Change color based on savings
    const netSavingsCard = document.getElementById('netSavingsAmount').closest('.summary-card');
    if (netSavingsCard) {
      if (analytics.netSavings < 0) {
        netSavingsCard.classList.add('negative');
      } else {
        netSavingsCard.classList.remove('negative');
      }
    }
  },

  /**
   * Handle add account form submission
   */
  handleAddAccount(event) {
    event.preventDefault();

    const accountData = {
      bankName: document.getElementById('bankName').value.trim(),
      accountType: document.getElementById('accountType').value,
      balance: document.getElementById('initialBalance').value
    };

    const errors = this.validateAccountForm(accountData);
    if (Object.keys(errors).length > 0) {
      this.displayFormErrors(errors, 'addAccountForm');
      return;
    }

    const result = Storage.addAccount(accountData);
    if (result.success) {
      event.target.reset();
      this.updateDashboard();
      this.populateAccountSelects();
      alert('Account added successfully!');
    } else {
      alert(result.message);
    }
  },

  /**
   * Validate account form
   */
  validateAccountForm(data) {
    const errors = {};

    if (!data.bankName) {
      errors.bankName = 'Bank name is required';
    }

    if (!data.balance || isNaN(parseFloat(data.balance))) {
      errors.balance = 'Valid balance is required';
    } else if (parseFloat(data.balance) < 0) {
      errors.balance = 'Balance cannot be negative';
    }

    return errors;
  },

  /**
   * Display accounts list
   */
  displayAccounts() {
    const accounts = Storage.getAccounts();
    const accountsContainer = document.getElementById('accountsList');

    if (!accountsContainer) return;

    if (accounts.length === 0) {
      accountsContainer.innerHTML = '<p class="no-data">No accounts added yet. Add one to get started!</p>';
      return;
    }

    accountsContainer.innerHTML = accounts.map(account => `
      <div class="account-card">
        <div class="account-header">
          <div>
            <h3>${account.bankName}</h3>
            <span class="account-type">${account.accountType}</span>
          </div>
          <div class="account-actions">
            <button type="button" class="btn-icon edit-btn" onclick="Dashboard.editAccount(${account.id})" title="Edit">✎</button>
            <button type="button" class="btn-icon delete-btn" onclick="Dashboard.deleteAccount(${account.id})" title="Delete">✕</button>
          </div>
        </div>
        <div class="account-balance">
          Balance: <strong>₹${account.balance.toFixed(2)}</strong>
        </div>
        <div class="account-meta">
          <small>Initial: ₹${account.initialBalance.toFixed(2)}</small>
        </div>
      </div>
    `).join('');
  },

  /**
   * Handle add transaction form submission
   */
  handleAddTransaction(event) {
    event.preventDefault();

    const transactionData = {
      accountId: parseInt(document.getElementById('transactionAccount').value),
      type: document.getElementById('transactionType').value,
      category: document.getElementById('transactionCategory').value,
      paymentMethod: document.getElementById('transactionPaymentMethod').value,
      amount: document.getElementById('transactionAmount').value,
      date: document.getElementById('transactionDate').value,
      notes: document.getElementById('transactionNotes').value.trim()
    };

    const errors = this.validateTransactionForm(transactionData);
    if (Object.keys(errors).length > 0) {
      this.displayFormErrors(errors, 'addTransactionForm');
      return;
    }

    const result = Storage.addTransaction(transactionData);
    if (result.success) {
      event.target.reset();
      this.updateDashboard();
      alert('Transaction added successfully!');
    } else {
      alert(result.message);
    }
  },

  /**
   * Validate transaction form
   */
  validateTransactionForm(data) {
    const errors = {};

    if (!data.accountId || data.accountId === 0) {
      errors.accountId = 'Please select an account';
    }

    if (!data.category) {
      errors.category = 'Please select a category';
    }

    if (!data.paymentMethod) {
      errors.paymentMethod = 'Please select a payment method';
    }

    if (!data.amount || isNaN(parseFloat(data.amount))) {
      errors.amount = 'Valid amount is required';
    } else if (parseFloat(data.amount) <= 0) {
      errors.amount = 'Amount must be greater than 0';
    }

    if (!data.date) {
      errors.date = 'Date is required';
    }

    return errors;
  },

  /**
   * Display transactions list
   */
  displayTransactions() {
    const transactions = Storage.getTransactions().sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
    const transactionsContainer = document.getElementById('recentTransactions');

    if (!transactionsContainer) return;

    if (transactions.length === 0) {
      transactionsContainer.innerHTML = '<p class="no-data">No transactions yet. Add one to get started!</p>';
      return;
    }

    transactionsContainer.innerHTML = transactions.map(transaction => {
      const account = Storage.getAccounts().find(acc => acc.id === transaction.accountId);
      const accountName = account ? account.bankName : 'Unknown';

      return `
        <div class="transaction-item ${transaction.type}">
          <div class="transaction-info">
            <div class="transaction-main">
              <span class="category-badge">${transaction.category}</span>
              <span class="account-name">${accountName}</span>
              ${transaction.paymentMethod ? `<span class="payment-method">${transaction.paymentMethod}</span>` : ''}
            </div>
            <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
          </div>
          <div class="transaction-amount-group">
            <div class="transaction-amount ${transaction.type}">
              ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
            </div>
            <div class="transaction-actions">
              <button type="button" class="btn-icon edit-btn" onclick="Dashboard.editTransaction(${transaction.id})" title="Edit">✎</button>
              <button type="button" class="btn-icon delete-btn" onclick="Dashboard.deleteTransaction(${transaction.id})" title="Delete">✕</button>
            </div>
          </div>
        </div>
      `;
    }).join('');
  },

  /**
   * Update financial insights
   */
  updateFinancialInsights() {
    const analytics = Storage.getSpendingAnalytics();
    const highest = Storage.getHighestSpendingCategory();
    const insightsContainer = document.getElementById('financialInsights');

    if (!insightsContainer) return;

    let insights = [];

    // Highest spending category
    if (highest.category !== 'N/A') {
      insights.push({
        type: 'info',
        icon: '📊',
        text: `Highest spending in <strong>${highest.category}</strong> (₹${highest.amount.toFixed(2)})`
      });
    }

    // Warning if debit > credit
    if (analytics.totalDebit > analytics.totalCredit && analytics.totalCredit > 0) {
      insights.push({
        type: 'warning',
        icon: '⚠️',
        text: 'Your expenses exceed your income. Consider reducing expenses.'
      });
    }

    // Savings percentage
    if (analytics.totalCredit > 0) {
      insights.push({
        type: 'info',
        icon: '💰',
        text: `Savings rate: <strong>${analytics.savingsPercentage}%</strong> of income`
      });
    }

    // Suggestions
    const categoryData = Storage.getCategoryWiseSpending();
    if (categoryData['Food'] && categoryData['Food'] > (analytics.totalDebit * 0.3)) {
      insights.push({
        type: 'suggestion',
        icon: '🍽️',
        text: 'Consider reducing food expenses to optimize budget.'
      });
    }

    if (analytics.savingsPercentage < 20 && analytics.totalCredit > 0) {
      insights.push({
        type: 'suggestion',
        icon: '📈',
        text: `Try to increase savings by at least 10% to reach 30% savings rate.`
      });
    }

    if (insights.length === 0) {
      insightsContainer.innerHTML = '<p class="no-data">Add transactions to see personalized insights.</p>';
      return;
    }

    insightsContainer.innerHTML = insights.map(insight => `
      <div class="insight-item insight-${insight.type}">
        <span class="insight-icon">${insight.icon}</span>
        <span class="insight-text">${insight.text}</span>
      </div>
    `).join('');
  },

  /**
   * Populate account select fields
   */
  populateAccountSelects() {
    const accounts = Storage.getAccounts();
    const accountSelects = document.querySelectorAll('#transactionAccount');

    accountSelects.forEach(select => {
      select.innerHTML = '<option value="0">Select Account</option>' + 
        accounts.map(acc => `<option value="${acc.id}">${acc.bankName} (${acc.accountType})</option>`).join('');
    });
  },

  /**
   * Populate category select
   */
  populateCategorySelect() {
    const categorySelect = document.getElementById('transactionCategory');
    if (!categorySelect) return;

    categorySelect.innerHTML = this.categories.map(cat => 
      `<option value="${cat}">${cat}</option>`
    ).join('');
  },

  /**
   * Display form errors
   */
  displayFormErrors(errors, formId) {
    const form = document.getElementById(formId);
    if (!form) return;

    // Clear previous errors
    form.querySelectorAll('.error-message').forEach(el => el.remove());
    form.querySelectorAll('.error').forEach(el => el.classList.remove('error'));

    Object.entries(errors).forEach(([fieldId, message]) => {
      const input = form.querySelector(`#${fieldId}`);
      if (input) {
        input.classList.add('error');
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        input.after(errorDiv);
      }
    });
  },

  /**
   * Populate payment method select
   */
  populatePaymentMethodSelect() {
    const paymentSelects = document.querySelectorAll('#transactionPaymentMethod, #editPaymentMethod');
    paymentSelects.forEach(select => {
      select.innerHTML = this.paymentMethods.map(method => 
        `<option value="${method}">${method}</option>`
      ).join('');
    });
  },

  /**
   * Edit account - show modal
   */
  editAccount(accountId) {
    const accounts = Storage.getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (!account) {
      alert('Account not found');
      return;
    }

    const newBankName = prompt('Enter new bank name:', account.bankName);
    if (newBankName === null) return;

    const result = Storage.updateAccount(accountId, { bankName: newBankName });
    if (result.success) {
      alert('Account updated successfully!');
      this.updateDashboard();
      this.populateAccountSelects();
    } else {
      alert(result.message);
    }
  },

  /**
   * Delete account
   */
  deleteAccount(accountId) {
    const accounts = Storage.getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (!account) {
      alert('Account not found');
      return;
    }

    if (confirm(`Are you sure you want to delete the account "${account.bankName}"? This action cannot be undone.`)) {
      const result = Storage.deleteAccount(accountId);
      if (result.success) {
        alert('Account deleted successfully!');
        this.updateDashboard();
        this.populateAccountSelects();
      } else {
        alert(result.message);
      }
    }
  },

  /**
   * Edit transaction - show modal
   */
  editTransaction(transactionId) {
    const transactions = Storage.getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      alert('Transaction not found');
      return;
    }

    const account = Storage.getAccounts().find(acc => acc.id === transaction.accountId);
    if (!account) {
      alert('Account not found');
      return;
    }

    const newAmount = prompt('Enter new amount:', transaction.amount);
    if (newAmount === null) return;

    if (isNaN(parseFloat(newAmount)) || parseFloat(newAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const result = Storage.updateTransaction(transactionId, {
      amount: newAmount
    });

    if (result.success) {
      alert('Transaction updated successfully!');
      this.updateDashboard();
    } else {
      alert(result.message);
    }
  },

  /**
   * Delete transaction
   */
  deleteTransaction(transactionId) {
    const transactions = Storage.getTransactions();
    const transaction = transactions.find(t => t.id === transactionId);
    
    if (!transaction) {
      alert('Transaction not found');
      return;
    }

    if (confirm(`Are you sure you want to delete this transaction (${transaction.category} - ₹${transaction.amount})? This action cannot be undone.`)) {
      const result = Storage.deleteTransaction(transactionId);
      if (result.success) {
        alert('Transaction deleted successfully!');
        this.updateDashboard();
      } else {
        alert(result.message);
      }
    }
  },

  /**
   * Display spending breakdown with category and payment method
   */
  displaySpendingBreakdown() {
    const breakdown = Storage.getSpendingBreakdown();
    const breakdownTable = document.getElementById('spendingBreakdownTable');

    if (!breakdownTable) return;

    if (!breakdown || breakdown.length === 0) {
      breakdownTable.innerHTML = `
        <tr>
          <td colspan="4" style="padding: 2rem; text-align: center; color: var(--text-light);">
            No data available. Add transactions to see breakdown.
          </td>
        </tr>
      `;
      return;
    }

    // Group and display breakdown data
    const tableRows = breakdown.map(item => `
      <tr style="border-bottom: 1px solid rgba(37, 99, 235, 0.1); transition: var(--transition);" onmouseover="this.style.backgroundColor='rgba(37, 99, 235, 0.05)'" onmouseout="this.style.backgroundColor='transparent'">
        <td style="padding: 0.75rem; color: var(--text-color);">${item.category}</td>
        <td style="padding: 0.75rem; color: var(--text-color);">${item.method}</td>
        <td style="padding: 0.75rem; text-align: right; font-weight: 600; color: var(--danger-color);">₹${parseFloat(item.amount).toFixed(2)}</td>
        <td style="padding: 0.75rem; text-align: center; color: var(--text-light);">${item.count}</td>
      </tr>
    `).join('');

    breakdownTable.innerHTML = tableRows;

    // Create spending by category chart
    this.createSpendingByCategoryChart(breakdown);

    // Create spending by payment method chart
    this.createSpendingByPaymentMethodChart(breakdown);
  },

  /**
   * Create spending by category chart
   */
  createSpendingByCategoryChart(breakdown) {
    const categoryData = {};
    
    breakdown.forEach(item => {
      if (!categoryData[item.category]) {
        categoryData[item.category] = 0;
      }
      categoryData[item.category] += parseFloat(item.amount);
    });

    const labels = Object.keys(categoryData);
    const data = Object.values(categoryData);

    const colors = [
      '#2563eb', '#059669', '#dc2626', '#f59e0b', '#8b5cf6',
      '#ec4899', '#14b8a6', '#3b82f6', '#a16207', '#1e40af'
    ];

    const canvas = document.getElementById('spendingByCategoryChart');
    if (!canvas) return;

    // Destroy previous chart if exists
    const existingChart = this.categoryChart;
    if (existingChart) {
      existingChart.destroy();
    }

    this.categoryChart = new Chart(canvas, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: 'var(--light-bg)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--text-color)',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                return `₹${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  },

  /**
   * Create spending by payment method chart
   */
  createSpendingByPaymentMethodChart(breakdown) {
    const methodData = {};
    
    breakdown.forEach(item => {
      if (!methodData[item.method]) {
        methodData[item.method] = 0;
      }
      methodData[item.method] += parseFloat(item.amount);
    });

    const labels = Object.keys(methodData);
    const data = Object.values(methodData);

    const colors = [
      '#059669', '#2563eb', '#dc2626', '#f59e0b', '#8b5cf6',
      '#ec4899', '#14b8a6', '#3b82f6'
    ];

    const canvas = document.getElementById('spendingByMethodChart');
    if (!canvas) return;

    // Destroy previous chart if exists
    const existingChart = this.methodChart;
    if (existingChart) {
      existingChart.destroy();
    }

    this.methodChart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: colors.slice(0, labels.length),
          borderColor: 'var(--light-bg)',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: 'var(--text-color)',
              padding: 15,
              font: { size: 12 }
            }
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const value = context.parsed || 0;
                return `₹${value.toFixed(2)}`;
              }
            }
          }
        }
      }
    });
  }
};

// ==================== SECTION MANAGEMENT ====================

/**
 * Setup smooth section navigation with smooth scroll
 */
function setupSectionNavigation() {
  const navLinks = document.querySelectorAll('.sidebar-nav-link');
  
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        
        // Remove active class from all links
        navLinks.forEach(l => l.classList.remove('active'));
        
        // Add active class to clicked link
        this.classList.add('active');
        
        // Smooth scroll to section
        const sectionId = href.substring(1);
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });
}

// Initialize dashboard when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
    Dashboard.applyDarkModePreference();
    setupSectionNavigation();
  });
} else {
  Dashboard.init();
  Dashboard.applyDarkModePreference();
  setupSectionNavigation();
}
