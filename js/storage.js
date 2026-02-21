/**
 * Storage Module - Handles all LocalStorage operations
 * Manages Users, Accounts, and Transactions
 */

const Storage = {
  /**
   * Initialize default data in LocalStorage
   */
  init() {
    if (!localStorage.getItem('users')) {
      localStorage.setItem('users', JSON.stringify([]));
    }
    if (!localStorage.getItem('accounts')) {
      localStorage.setItem('accounts', JSON.stringify([]));
    }
    if (!localStorage.getItem('transactions')) {
      localStorage.setItem('transactions', JSON.stringify([]));
    }
    if (!localStorage.getItem('currentUser')) {
      localStorage.setItem('currentUser', JSON.stringify(null));
    }
  },

  // ==================== USER MANAGEMENT ====================
  /**
   * Register a new user
   */
  registerUser(userData) {
    const users = this.getUsers();
    const userExists = users.some(user => user.email === userData.email);
    
    if (userExists) {
      return { success: false, message: 'Email already registered' };
    }

    const newUser = {
      id: Date.now(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return { success: true, message: 'Registration successful' };
  },

  /**
   * Validate user login
   */
  loginUser(email, password) {
    const users = this.getUsers();
    const user = users.find(u => u.email === email && u.password === password);
    
    if (!user) {
      return { success: false, message: 'Invalid email or password' };
    }

    localStorage.setItem('currentUser', JSON.stringify({
      id: user.id,
      name: user.name,
      email: user.email
    }));

    return { success: true, user, message: 'Login successful' };
  },

  /**
   * Get current logged-in user
   */
  getCurrentUser() {
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },

  /**
   * Logout current user
   */
  logoutUser() {
    localStorage.setItem('currentUser', JSON.stringify(null));
  },

  /**
   * Get all users
   */
  getUsers() {
    const users = localStorage.getItem('users');
    return users ? JSON.parse(users) : [];
  },

  // ==================== ACCOUNT MANAGEMENT ====================
  /**
   * Add a new bank account
   */
  addAccount(accountData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    const accounts = this.getAccounts();
    const newAccount = {
      id: Date.now(),
      userId: currentUser.id,
      bankName: accountData.bankName,
      accountType: accountData.accountType,
      balance: parseFloat(accountData.balance),
      initialBalance: parseFloat(accountData.balance),
      createdAt: new Date().toISOString()
    };

    accounts.push(newAccount);
    localStorage.setItem('accounts', JSON.stringify(accounts));
    return { success: true, account: newAccount, message: 'Account added successfully' };
  },

  /**
   * Get all accounts for current user
   */
  getAccounts() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];

    const accounts = localStorage.getItem('accounts');
    const allAccounts = accounts ? JSON.parse(accounts) : [];
    return allAccounts.filter(acc => acc.userId === currentUser.id);
  },

  /**
   * Update account balance
   */
  updateAccountBalance(accountId, newBalance) {
    const accounts = this.getAccounts();
    const account = accounts.find(acc => acc.id === accountId);
    
    if (!account) return { success: false, message: 'Account not found' };

    account.balance = newBalance;
    
    const allAccounts = localStorage.getItem('accounts');
    const allAccountsData = JSON.parse(allAccounts);
    const index = allAccountsData.findIndex(acc => acc.id === accountId);
    allAccountsData[index] = account;
    localStorage.setItem('accounts', JSON.stringify(allAccountsData));
    
    return { success: true, account };
  },

  /**
   * Get total balance across all accounts
   */
  getTotalBalance() {
    const accounts = this.getAccounts();
    return accounts.reduce((total, acc) => total + acc.balance, 0);
  },

  // ==================== TRANSACTION MANAGEMENT ====================
  /**
   * Add a new transaction
   */
  addTransaction(transactionData) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    const transactions = this.getTransactions();
    const newTransaction = {
      id: Date.now(),
      userId: currentUser.id,
      accountId: transactionData.accountId,
      type: transactionData.type, // 'credit' or 'debit'
      category: transactionData.category,
      amount: parseFloat(transactionData.amount),
      date: transactionData.date,
      notes: transactionData.notes,
      createdAt: new Date().toISOString()
    };

    transactions.push(newTransaction);
    localStorage.setItem('transactions', JSON.stringify(transactions));

    // Update account balance
    const account = this.getAccounts().find(acc => acc.id === transactionData.accountId);
    if (account) {
      const newBalance = transactionData.type === 'credit' 
        ? account.balance + parseFloat(transactionData.amount)
        : account.balance - parseFloat(transactionData.amount);
      this.updateAccountBalance(transactionData.accountId, newBalance);
    }

    return { success: true, transaction: newTransaction, message: 'Transaction added successfully' };
  },

  /**
   * Get all transactions for current user
   */
  getTransactions() {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return [];

    const transactions = localStorage.getItem('transactions');
    const allTransactions = transactions ? JSON.parse(transactions) : [];
    return allTransactions.filter(t => t.userId === currentUser.id);
  },

  /**
   * Get transactions by date range
   */
  getTransactionsByDateRange(startDate, endDate) {
    const transactions = this.getTransactions();
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();

    return transactions.filter(t => {
      const tDate = new Date(t.date).getTime();
      return tDate >= start && tDate <= end;
    });
  },

  /**
   * Get spending analytics
   */
  getSpendingAnalytics() {
    const transactions = this.getTransactions();
    const debits = transactions.filter(t => t.type === 'debit');
    const credits = transactions.filter(t => t.type === 'credit');

    const totalDebit = debits.reduce((sum, t) => sum + t.amount, 0);
    const totalCredit = credits.reduce((sum, t) => sum + t.amount, 0);

    return {
      totalCredit,
      totalDebit,
      netSavings: totalCredit - totalDebit,
      savingsPercentage: totalCredit > 0 ? ((totalCredit - totalDebit) / totalCredit * 100).toFixed(2) : 0
    };
  },

  /**
   * Get category-wise spending
   */
  getCategoryWiseSpending() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const categorySpending = {};

    transactions.forEach(t => {
      if (!categorySpending[t.category]) {
        categorySpending[t.category] = 0;
      }
      categorySpending[t.category] += t.amount;
    });

    return categorySpending;
  },

  /**
   * Get highest spending category
   */
  getHighestSpendingCategory() {
    const categorySpending = this.getCategoryWiseSpending();
    let highest = { category: 'N/A', amount: 0 };

    Object.entries(categorySpending).forEach(([category, amount]) => {
      if (amount > highest.amount) {
        highest = { category, amount };
      }
    });

    return highest;
  },

  /**
   * Get daily spending
   */
  getDailySpending() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const dailySpending = {};

    transactions.forEach(t => {
      const date = t.date;
      if (!dailySpending[date]) {
        dailySpending[date] = 0;
      }
      dailySpending[date] += t.amount;
    });

    return dailySpending;
  },

  /**
   * Get weekly spending
   */
  getWeeklySpending() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const weeklySpending = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const weekStart = new Date(date.setDate(date.getDate() - date.getDay()));
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!weeklySpending[weekKey]) {
        weeklySpending[weekKey] = 0;
      }
      weeklySpending[weekKey] += t.amount;
    });

    return weeklySpending;
  },

  /**
   * Get monthly spending
   */
  getMonthlySpending() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const monthlySpending = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!monthlySpending[monthKey]) {
        monthlySpending[monthKey] = 0;
      }
      monthlySpending[monthKey] += t.amount;
    });

    return monthlySpending;
  },

  /**
   * Get quarterly spending
   */
  getQuarterlySpending() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const quarterlySpending = {};

    transactions.forEach(t => {
      const date = new Date(t.date);
      const quarter = Math.floor(date.getMonth() / 3) + 1;
      const quarterKey = `${date.getFullYear()}-Q${quarter}`;

      if (!quarterlySpending[quarterKey]) {
        quarterlySpending[quarterKey] = 0;
      }
      quarterlySpending[quarterKey] += t.amount;
    });

    return quarterlySpending;
  },

  // ==================== ACCOUNT EDIT/DELETE ====================
  /**
   * Delete an account
   */
  deleteAccount(accountId) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    let allAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const account = allAccounts.find(acc => acc.id === accountId && acc.userId === currentUser.id);
    
    if (!account) return { success: false, message: 'Account not found' };

    allAccounts = allAccounts.filter(acc => acc.id !== accountId);
    localStorage.setItem('accounts', JSON.stringify(allAccounts));
    
    return { success: true, message: 'Account deleted successfully' };
  },

  /**
   * Update account details
   */
  updateAccount(accountId, updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    let allAccounts = JSON.parse(localStorage.getItem('accounts') || '[]');
    const account = allAccounts.find(acc => acc.id === accountId && acc.userId === currentUser.id);
    
    if (!account) return { success: false, message: 'Account not found' };

    if (updates.bankName) account.bankName = updates.bankName;
    if (updates.accountType) account.accountType = updates.accountType;
    
    localStorage.setItem('accounts', JSON.stringify(allAccounts));
    return { success: true, account, message: 'Account updated successfully' };
  },

  // ==================== TRANSACTION EDIT/DELETE ====================
  /**
   * Delete a transaction and revert balance
   */
  deleteTransaction(transactionId) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    let allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = allTransactions.find(t => t.id === transactionId && t.userId === currentUser.id);
    
    if (!transaction) return { success: false, message: 'Transaction not found' };

    // Revert balance change
    const account = this.getAccounts().find(acc => acc.id === transaction.accountId);
    if (account) {
      const balanceChange = transaction.type === 'credit' 
        ? -transaction.amount 
        : transaction.amount;
      this.updateAccountBalance(transaction.accountId, account.balance + balanceChange);
    }

    allTransactions = allTransactions.filter(t => t.id !== transactionId);
    localStorage.setItem('transactions', JSON.stringify(allTransactions));
    
    return { success: true, message: 'Transaction deleted successfully' };
  },

  /**
   * Update transaction details
   */
  updateTransaction(transactionId, updates) {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { success: false, message: 'User not logged in' };

    let allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const transaction = allTransactions.find(t => t.id === transactionId && t.userId === currentUser.id);
    
    if (!transaction) return { success: false, message: 'Transaction not found' };

    const oldAmount = transaction.amount;
    const oldType = transaction.type;

    // Get old account and revert balance
    const oldAccount = this.getAccounts().find(acc => acc.id === transaction.accountId);
    if (oldAccount) {
      const oldBalanceChange = oldType === 'credit' 
        ? -oldAmount 
        : oldAmount;
      this.updateAccountBalance(transaction.accountId, oldAccount.balance + oldBalanceChange);
    }

    // Update transaction
    if (updates.type) transaction.type = updates.type;
    if (updates.category) transaction.category = updates.category;
    if (updates.amount) transaction.amount = parseFloat(updates.amount);
    if (updates.date) transaction.date = updates.date;
    if (updates.paymentMethod) transaction.paymentMethod = updates.paymentMethod;
    if (updates.notes !== undefined) transaction.notes = updates.notes;

    // Apply new balance change
    const newAccount = this.getAccounts().find(acc => acc.id === transaction.accountId);
    if (newAccount) {
      const newBalanceChange = transaction.type === 'credit' 
        ? transaction.amount 
        : -transaction.amount;
      this.updateAccountBalance(transaction.accountId, newAccount.balance + newBalanceChange);
    }

    localStorage.setItem('transactions', JSON.stringify(allTransactions));
    return { success: true, transaction, message: 'Transaction updated successfully' };
  },

  // ==================== SPENDING BREAKDOWN ====================
  /**
   * Get spending by category and payment method
   */
  getSpendingBreakdown() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const breakdown = {};

    transactions.forEach(t => {
      const category = t.category || 'Other';
      const method = t.paymentMethod || 'Unknown';
      const key = `${category}|${method}`;

      if (!breakdown[key]) {
        breakdown[key] = {
          category,
          method,
          amount: 0,
          count: 0
        };
      }
      breakdown[key].amount += t.amount;
      breakdown[key].count += 1;
    });

    return Object.values(breakdown);
  },

  /**
   * Get spending by payment method only
   */
  getSpendingByPaymentMethod() {
    const transactions = this.getTransactions().filter(t => t.type === 'debit');
    const methodSpending = {};

    transactions.forEach(t => {
      const method = t.paymentMethod || 'Unknown';
      if (!methodSpending[method]) {
        methodSpending[method] = 0;
      }
      methodSpending[method] += t.amount;
    });

    return methodSpending;
  }
};

// Initialize storage on page load
Storage.init();
