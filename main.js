let users = [
  { username: 'user1', password: 'pass1', balance: { BTC: 10000, USD: 0 }, subscribed: true, plan: 'VIP3', lastActivity: new Date('2014-01-01') },
  { username: 'user2', password: 'pass2', balance: { BTC: 0, USD: 0 }, subscribed: false, plan: null, lastActivity: new Date('2024-01-01') }
];

let currentUser = null;

function login() {
  let username = document.getElementById('username').value;
  let password = document.getElementById('password').value;

  let user = users.find(user => user.username === username && user.password === password);
  if (user) {
    currentUser = user;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    window.location.href = 'index.html';
  } else {
    alert('Invalid username or password');
  }
}

function signUp() {
  let username = prompt("Enter your username:");
  let password = prompt("Enter your password:");

  let existingUser = users.find(user => user.username === username);
  if (existingUser) {
    alert('Username already exists. Please choose a different username.');
  } else {
    let newUser = { username: username, password: password, balance: { BTC: 0, USD: 0 } };
    users.push(newUser);
    currentUser = newUser;
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    alert(`Account created successfully. Username: ${username}`);
    window.location.href = 'index.html';
  }
}

function deposit() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please log in first');
    return;
  }

  if (!currentUser.subscribed) {
    alert('Please subscribe to access this feature.');
    return;
  }

  const currentDate = new Date();
  const lastActivityDate = new Date(currentUser.lastActivity);
  const tenYearsInMilliseconds = 10 * 365 * 24 * 60 * 60 * 1000;

  if (currentDate - lastActivityDate >= tenYearsInMilliseconds) {
    alert('Your account has been unused for about 10 years. Deposits are locked. You can only transfer funds.');
    return;
  }

  let currency = prompt("Enter currency (BTC/USD):");
  let amount = parseFloat(prompt("Enter amount:"));

  if (currentUser.balance[currency] !== undefined) {
    currentUser.balance[currency] += amount;
    updateUsers(currentUser);
    updateBalance();
  } else {
    alert("Invalid currency.");
  }
}

function withdraw() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please log in first');
    return;
  }

  if (!currentUser.subscribed) {
    alert('Please subscribe to access this feature.');
    return;
  }

  const currentDate = new Date();
  const lastActivityDate = new Date(currentUser.lastActivity);
  const tenYearsInMilliseconds = 10 * 365 * 24 * 60 * 60 * 1000;

  if (currentDate - lastActivityDate >= tenYearsInMilliseconds) {
    alert('Your account has been unused for about 10 years. Withdrawals are locked. You can only transfer funds.');
    return;
  }

  let currency = prompt("Enter currency (BTC/USD):");
  let amount = parseFloat(prompt("Enter amount:"));

  if (currentUser.balance[currency] !== undefined && currentUser.balance[currency] >= amount) {
    currentUser.balance[currency] -= amount;
    updateUsers(currentUser);
    updateBalance();
  } else {
    alert("Insufficient funds or invalid currency.");
  }
}

function transfer() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please log in first');
    return;
  }

  if (!currentUser.subscribed) {
    alert('Please subscribe to access this feature.');
    return;
  }

  let recipientUsername = prompt("Enter recipient's username:");
  let currency = prompt("Enter currency (BTC/USD):");
  let amount = parseFloat(prompt("Enter amount:"));

  let recipient = users.find(user => user.username === recipientUsername);
  if (recipient) {
    if (!recipient.subscribed) {
      alert("Recipient must be a subscribed user to receive BTC.");
      return;
    }

    if (currentUser.balance[currency] >= amount) {
      currentUser.balance[currency] -= amount;
      recipient.balance[currency] += amount;
      updateUsers(currentUser);
      updateUsers(recipient);
      sessionStorage.setItem('currentUser', JSON.stringify(currentUser)); // Ensure currentUser is updated in sessionStorage
      alert('Transfer successful');
    } else {
      alert("Insufficient funds.");
    }
  } else {
    alert("Invalid recipient.");
  }
}

function showRates() {
  // Fetch BTC and USD rates from an API or use hardcoded values
  let btcRate = 50000; // Example rate
  let usdRate = 1; // Example rate

  alert(`Current Rates:\nBTC: $${btcRate}\nUSD: $${usdRate}`);
}

function updateBalance() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    let display = `BTC: ${currentUser.balance.BTC.toFixed(2)} | USD: ${currentUser.balance.USD.toFixed(2)}`;
    document.getElementById('balance-display').innerText = display;
  }
}

function updateUsers(user) {
  let index = users.findIndex(u => u.username === user.username);
  if (index !== -1) {
    users[index] = user;
  }
}

function logout() {
  currentUser = null;
  sessionStorage.removeItem('currentUser');
  window.location.href = 'login.html';
}

document.addEventListener('DOMContentLoaded', (event) => {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    updateBalance();
  }
});

// Sample transaction data
const transactions = [
  { date: '2024-01-01', type: 'Deposit', amount: 100, status: 'Completed' },
  { date: '2024-01-02', type: 'Withdrawal', amount: 50, status: 'Pending' },
  { date: '2024-01-03', type: 'Transfer', amount: 200, status: 'Completed' },
  { date: '2024-01-03', type: 'Transfer', amount: 200, status: 'Completed' }
];

// Function to update the transaction history table
function updateTransactionHistory() {
  const transactionHistory = document.getElementById('transaction-history');
  if (!transactionHistory) {
    console.error('Transaction history element not found');
    return;
  }
  transactionHistory.innerHTML = ''; // Clear the existing rows

  transactions.forEach(transaction => {
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.innerText = transaction.date;
    row.appendChild(dateCell);

    const typeCell = document.createElement('td');
    typeCell.innerText = transaction.type;
    row.appendChild(typeCell);

    const amountCell = document.createElement('td');
    amountCell.innerText = transaction.amount;
    row.appendChild(amountCell);

    const statusCell = document.createElement('td');
    statusCell.innerText = transaction.status;
    row.appendChild(statusCell);

    transactionHistory.appendChild(row);
  });
}

// Initialize the transaction history on page load
document.addEventListener('DOMContentLoaded', () => {
  updateTransactionHistory();
});

// Function to handle VIP subscription
function subscribeToVIP() {
  // Check if the user is logged in
  const currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (currentUser) {
    // Redirect to the VIP subscription page
    window.location.href = '/subscription.html';
  } else {
    alert('You must be logged in to subscribe to VIP.');
  }
}

// Existing functions for deposit, withdraw, transfer, showRates, logout, etc.
document.addEventListener('DOMContentLoaded', () => {
  displayUsername();
  updateTransactionHistory();
});

document.addEventListener('DOMContentLoaded', () => {
  const subscriptionsContainer = document.querySelector('.subscriptions');
  const prices = [0.003, 0.006, 0.009, 0.012, 0.015, 0.018];
  const vipLevels = ['VIP1', 'VIP2', 'VIP3', 'VIP4', 'VIP5', 'VIP6'];

  // Generate subscription options
  vipLevels.forEach((vip, index) => {
    const option = document.createElement('div');
    option.className = 'subscription-option';
    option.setAttribute('data-price', prices[index]);
    option.innerText = `${vip} - ${prices[index]} BTC`;
    option.addEventListener('click', () => selectSubscription(option));
    subscriptionsContainer.appendChild(option);
  });
});

// Function to select a subscription option
function selectSubscription(option) {
  const previouslySelected = document.querySelector('.subscription-option.selected');
  if (previouslySelected) {
    previouslySelected.classList.remove('selected');
  }
  option.classList.add('selected');
}

// Function to confirm the subscription
function confirmSubscription() {
  const selectedOption = document.querySelector('.subscription-option.selected');
  if (selectedOption) {
    const price = selectedOption.getAttribute('data-price');
    // Redirect to the BTC payment page with price as a query parameter
    window.location.href = `btc-payment.html?price=${price}`;
  } else {
    alert('Please select a subscription level.');
  }
}
function subscribe() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  if (!currentUser) {
    alert('Please log in first');
    return;
  }

  if (currentUser.subscribed) {
    alert('You are already subscribed.');
    return;
  }

  currentUser.subscribed = true;
  currentUser.plan = 'VIP1'; // Set initial plan
  updateUsers(currentUser);
  sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
  alert('Subscription successful');
  checkSubscriptionStatus(); // Update button visibility
}
function checkSubscriptionStatus() {
  currentUser = JSON.parse(sessionStorage.getItem('currentUser'));
  console.log(currentUser); // Check the currentUser object
  if (currentUser && currentUser.subscribed) {
    document.getElementById('subscribe-btn').style.display = 'none';
    document.getElementById('upgrade-btn').style.display = 'block';
  } else {
    document.getElementById('subscribe-btn').style.display = 'block';
    document.getElementById('upgrade-btn').style.display = 'none';
  }
}
document.addEventListener('DOMContentLoaded', () => {
  checkSubscriptionStatus();
  displayUsername();
  updateTransactionHistory();
});