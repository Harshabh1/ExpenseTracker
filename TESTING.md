## 🧪 Testing Guide for Expense Tracker

This guide will help you test all features of the Expense Tracker application.

### 📋 Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Open DevTools (F12) to view LocalStorage and console for debugging

### 🚀 Quick Start

1. **Open the Application**
   - Open `index.html` in your browser
   - You should see the login page

2. **Test Registration**
   - Click "Register here"
   - Try submitting with empty fields - see validation errors
   - Fill in:
     - Name: John Doe
     - Email: john@test.com
     - Password: test123
     - Confirm Password: test123
   - Click "Register"
   - Should redirect to login page

3. **Test Login**
   - Enter: john@test.com / test123
   - Click "Login"
   - Should see dashboard

### 📊 Testing Dashboard Features

#### 1. Summary Cards
- Before adding data: All should show ₹0.00
- After transactions: Values should update automatically

#### 2. Bank Accounts
- Click "🏦 Accounts" section
- Add first account:
  - Bank Name: HDFC Bank
  - Account Type: Savings
  - Initial Balance: 50000
  - Click "Add Account"
- Repeat with different accounts:
  - ICICI Bank (Current, 30000)
  - Axis Bank Credit Card (Credit Card, 0)
- Verify accounts display with correct details

#### 3. Transactions
- Click "📝 Transactions" section
- Add Income transaction:
  - Account: HDFC Bank
  - Type: Income (Credit)
  - Category: Investment
  - Amount: 5000
  - Date: Today
  - Notes: Salary deposit
  - Click "Add Transaction"
- Verify:
  - Account balance increases by 5000
  - Transaction appears in Recent Transactions
  - Summary cards update

- Add Expense transaction:
  - Account: HDFC Bank
  - Type: Expense (Debit)
  - Category: Food
  - Amount: 500
  - Date: Today (or previous date)
  - Notes: Lunch at restaurant
  - Click "Add Transaction"
- Verify:
  - Account balance decreases by 500
  - Transaction appears in list
  - Total Balance, Debit, and Savings cards update

#### 4. Multiple Transactions (for Analytics)
Add several transactions to populate charts:

**Income:**
- 60000 (Salary - Investment)
- 10000 (Bonus - Investment)

**Expenses:**
- 500 (Food) - Date 1
- 200 (Transport - Travel) - Date 1
- 2000 (Rent) - Date 2
- 300 (Shopping) - Date 3
- 1000 (EMI) - Date 4
- 100 (Bills) - Date 5
- 400 (Entertainment) - Date 6
- 150 (Utilities) - Date 7

#### 5. Analytics Section
- Click "📈 Analytics" section
- Verify all 5 charts display:
  - **Monthly Spending Chart**: Bar chart with spending amounts
  - **Spending Trend**: Line chart showing trend over days
  - **Category Distribution**: Doughnut chart showing categories
  - **Income vs Expenses**: Bar chart comparison
  - **Quarterly Spending**: Line chart (if multiple quarters)

#### 6. Financial Insights
- Click "💡 Insights" section
- Verify insights display:
  - Highest spending category (should be Food or Rent)
  - Savings percentage (Income - Expenses / Income)
  - Warnings if expenses > income
  - Suggestions for reducing expenses

#### 7. Dark Mode
- Click moon icon (🌙) in top-right
- Theme should toggle between light and dark
- Reload page - theme should persist

#### 8. Mobile Responsiveness
- Resize browser to 768px width:
  - Sidebar should collapse to hamburger menu
  - Cards should reflow to single column
  - Forms should be readable
- Test at 480px:
  - All elements should remain accessible
  - No horizontal scrolling

### 🧪 Form Validation Tests

1. **Registration Form**
   - Submit with empty fields - see error for each
   - Email without @ - see email format error
   - Password less than 6 chars - see strength error
   - Mismatched passwords - see mismatch error

2. **Login Form**
   - Wrong email/password combo - see error message
   - Valid credentials - should login

3. **Transaction Form**
   - No account selected - see error
   - Amount 0 or negative - see error
   - No date - see error

### 💾 LocalStorage Tests

Open DevTools (F12) → Application → LocalStorage → file://

Verify these keys exist:
- `users`: Should contain registered users
- `accounts`: Should contain bank accounts
- `transactions`: Should contain all transactions
- `currentUser`: Should contain logged-in user
- `darkMode`: Should contain true/false

### 🔄 Session Tests

1. **Logout & Relogin**
   - Logout using button in sidebar
   - Click "Register here" if on login
   - Create new account
   - Login - should see new account
   - Logout again

2. **Session Persistence**
   - Add account and transactions
   - Refresh page (F5)
   - All data should remain
   - Summary should show same values

3. **Account Navigation**
   - Click different sections in sidebar
   - Click moon icon for dark mode
   - All interactions should work

### 📊 Chart Interactivity

1. **Hover Effects**
   - Hover over chart bars - show tooltip with amount
   - Hover over pie slices - highlight category

2. **Chart Updates**
   - Add new transaction
   - Charts should update with new data
   - Change category - pie chart should update

### ⚠️ Edge Cases

1. **No Data**
   - Start fresh (clear localStorage)
   - Dashboard should show ₹0 values
   - Charts should be empty or minimal
   - Insights should show placeholder text

2. **Multiple Accounts**
   - Total Balance = Sum of all account balances
   - Transactions update correct account

3. **Different Dates**
   - Add transactions from different dates
   - Charts should group by date/week/month
   - Spending trends should show variation

### 🐛 Browser Console Checks

Open console (F12) → Console tab:
- No errors (red messages)
- No warnings unless expected
- Successful messages when adding data

### ✅ Success Criteria

All tests passed when:
- ✅ Registration and login work
- ✅ Accounts can be added and displayed
- ✅ Transactions update balances correctly
- ✅ Charts display and update
- ✅ Insights show accurate information
- ✅ Dark mode toggles
- ✅ Data persists on reload
- ✅ Mobile responsive at all breakpoints
- ✅ No console errors
- ✅ Form validation works

### 💡 Tips

- Use DevTools Network tab to ensure no failed requests (pure frontend, so should be all 200s)
- Use LocalStorage inspection to debug data issues
- Check console for any JavaScript errors
- Test with browser zoom at 100%, 125%, 150%
- Test different account types (Savings, Current, Credit)

### 🎯 Performance Notes

- Page load should be instant (no network calls)
- Chart rendering < 1 second
- LocalStorage operations < 100ms
- Memory usage stable (no leaks)

Enjoy testing! 🎉
