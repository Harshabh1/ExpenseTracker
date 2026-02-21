# 💰 Expense Tracker - Frontend Application

A fully responsive expense tracking web application built with HTML5, CSS3, and Vanilla JavaScript (ES6+). Track your finances, manage multiple bank accounts, and visualize your spending patterns with interactive charts.

## 🚀 Features

### Authentication
- **Registration**: Create a new account with email and password validation
- **Login**: Secure login system with form validation
- **Session Management**: User sessions stored in LocalStorage

### Dashboard
- **Financial Summary Cards**: Quick overview of total balance, income, expenses, and savings
- **Dark Mode Toggle**: Switch between light and dark themes
- **Responsive Sidebar Navigation**: Easy access to all sections

### Bank Accounts Management
- **Multiple Accounts**: Add and manage multiple bank accounts
- **Account Types**: Support for Savings, Current, and Credit Card accounts
- **Balance Tracking**: Real-time balance updates across all accounts
- **Account Display**: Modern card-based UI with account details

### Transaction Management
- **Add Transactions**: Record credit (income) and debit (expense) transactions
- **Category Selection**: 12+ predefined expense categories
- **Date & Notes**: Track transaction date and add custom notes
- **Transaction History**: View recent transactions with filtering
- **Instant Balance Update**: Account balances update automatically

### Analytics & Visualization
- **Monthly Spending Chart**: Bar chart comparing spending across months
- **Spending Trend**: Line chart showing daily spending patterns
- **Category-wise Distribution**: Doughnut chart for category-based spending
- **Income vs Expenses**: Bar chart comparing total income and expenses
- **Quarterly Spending**: Line chart for quarterly spending trends
- **Real-time Updates**: Charts refresh automatically when new transactions are added

### Financial Insights
- **Highest Spending Category**: Identifies your top spending category
- **Savings Percentage**: Calculate savings as percentage of income
- **Warning Alerts**: Alert when expenses exceed income
- **Smart Suggestions**: Personalized recommendations to optimize spending

## 📁 Folder Structure

```
ExpenseTracker/
├── index.html              # Login page
├── register.html           # Registration page
├── dashboard.html          # Main dashboard
├── css/
│   └── style.css          # All styles (light & dark modes)
├── js/
│   ├── storage.js         # LocalStorage operations
│   ├── auth.js            # Authentication logic
│   ├── dashboard.js       # Dashboard functionality
│   └── charts.js          # Chart.js visualizations
├── assets/                # Images and icons
└── README.md
```

## 🎨 Design Features

### Responsive Design
- **Mobile-First Approach**: Works seamlessly on all devices
- **Breakpoints**: Optimized for mobile, tablet, and desktop
- **Flexible Layouts**: Uses CSS Flexbox and Grid
- **Mobile Menu**: Hamburger menu for mobile navigation

### UI/UX
- **Modern Card Design**: Clean, organized layout
- **Smooth Animations**: Subtle transitions and hover effects
- **Professional Color Scheme**: Gradient backgrounds
- **Form Validation**: Real-time error messages
- **Accessibility**: Semantic HTML and keyboard navigation

### Themes
- **Light Mode**: Clean white background with dark text
- **Dark Mode**: Easy on the eyes with dark background
- **Theme Persistence**: Selected theme saved in browser

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No backend server required
- No build process needed

### Installation & Usage

1. **Open the Application**
   - Open `index.html` in your web browser
   - Or serve using a local server

2. **Using Local Server** (Recommended)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Node.js
   http-server
   ```
   Then navigate to `http://localhost:8000`

3. **Create Account**
   - Go to register page
   - Fill in details
   - Click Register

4. **Login & Start**
   - Add bank account with initial balance
   - Add transactions
   - View analytics

## 📊 Categories

- 🍽️ Food
- 🏠 Rent
- ✈️ Travel
- 🏦 EMI
- 🛍️ Shopping
- 📄 Bills
- 💼 Investment
- 🎬 Entertainment
- 🏥 Healthcare
- 📚 Education
- 🔌 Utilities
- 📌 Other

## 💾 Data Storage

All data stored in browser LocalStorage:
- **users**: Registered user accounts
- **accounts**: Bank accounts
- **transactions**: All transactions
- **currentUser**: Current session

## 🔒 Security Notes

⚠️ **For Learning Only**: This is a frontend-only application

- Passwords stored in plain text (not production-ready)
- No encryption implemented
- Data stored locally in browser

For production:
- Implement backend with secure hashing
- Use JWT tokens
- Enable HTTPS encryption
- Server-side validation
- Use proper database

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
- Mobile browsers

## 🛠️ Technologies

- **HTML5**: Semantic markup
- **CSS3**: Flexbox, Grid, Variables
- **JavaScript ES6+**: Modern JS features
- **Chart.js 4.x**: Data visualization
- **LocalStorage API**: Data persistence

## 📈 Charts Used

- Bar Chart: Monthly spending
- Line Chart: Spending trends & quarterly
- Doughnut Chart: Category distribution
- Bar Chart: Income vs Expenses

## 👨‍💻 Code Quality

- Modular architecture with separate files
- Reusable functions and components
- Comprehensive comments
- Input validation and error handling
- Clean, readable code

## 📝 Future Enhancements

- CSV import/export
- Budget tracking
- Recurring transactions
- Transaction filters
- Multi-currency support
- Cloud backup
- Mobile app
- Backend API

## 📞 Support

Check browser console (F12) for debugging
- LocalStorage inspection
- Error messages
- Application logs

---

**Version**: 1.0.0 | **Status**: Production Ready (Frontend Only)

Enjoy tracking your expenses! 💰