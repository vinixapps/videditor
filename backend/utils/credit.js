// backend/utils/credit.js

// Simulasi penyimpanan credit (ganti dengan DB di production)
const userStore = {};

function getCredit(userId) {
  if (!userStore[userId]) userStore[userId] = { credit: 0 };
  return userStore[userId].credit;
}

function addCredit(userId, amount) {
  if (!userStore[userId]) userStore[userId] = { credit: 0 };
  userStore[userId].credit += amount;
  return userStore[userId].credit;
}

function deductCredit(userId, amount) {
  if (!userStore[userId]) userStore[userId] = { credit: 0 };
  if (userStore[userId].credit < amount) {
    throw new Error('Insufficient credit');
  }
  userStore[userId].credit -= amount;
  return userStore[userId].credit;
}

function setCredit(userId, amount) {
  if (!userStore[userId]) userStore[userId] = { credit: 0 };
  userStore[userId].credit = amount;
  return userStore[userId].credit;
}

module.exports = {
  getCredit,
  addCredit,
  deductCredit,
  setCredit,
  _store: userStore, // buat debug/testing (bisa dihapus di production)
};

