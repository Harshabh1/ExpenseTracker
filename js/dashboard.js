/**
 * Dashboard Module - Handles all dashboard interactions and updates
 */

const Dashboard = {
  categories: ['Food', 'Rent', 'Travel', 'EMI', 'Shopping', 'Bills', 'Investment', 'Entertainment', 'Healthcare', 'Education', 'Utilities', 'Other'],

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
      menuToggle.addEventListener('click', () => this.toggleMobileMenu());
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
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  },

  /**
   * Apply saved dark mode preference
   */
  applyDarkModePreference() {
    if (localStorage.getItem('darkMode') === 'true') {
      document.body.classList.add('dark-mode');
    }
  },

  /**
   * Toggle mobile menu
   */
  toggleMobileMenu() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
      sidebar.classList.toggle('mobile-open');
    }
  },

  /**
   * Update entire dashboard
   */
  updateDashboard() {
    this.updateSummaryCards();
    this.displayAccounts();
    this.displayTransactions();
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
          <h3>${account.bankName}</h3>
          <span class="account-type">${account.accountType}</span>
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
            </div>
            <div class="transaction-date">${new Date(transaction.date).toLocaleDateString()}</div>
          </div>
          <div class="transaction-amount ${transaction.type}">
            ${transaction.type === 'credit' ? '+' : '-'}₹${transaction.amount.toFixed(2)}
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
  }
};

// Initialize dashboard when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
    Dashboard.applyDarkModePreference();
  });
} else {
  Dashboard.init();
  Dashboard.applyDarkModePreference();
}
