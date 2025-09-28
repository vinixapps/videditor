// backend/utils/db.js

// Simulasi database user sederhana (pakai object di-memory)
const userStore = {};

// Create or get user by id (misal email, fingerprint, dsb)
function getUser(userId) {
  if (!userStore[userId]) {
    userStore[userId] = {
      userId,
      email: null,
      name: null,
      avatar: null,
      credit: 0,
      createdAt: new Date(),
    };
  }
  return userStore[userId];
}

// Update user data
function updateUser(userId, data = {}) {
  if (!userStore[userId]) getUser(userId);
  Object.assign(userStore[userId], data);
  return userStore[userId];
}

// Get all users (for admin/debug)
function getAllUsers() {
  return Object.values(userStore);
}

// Delete user
function deleteUser(userId) {
  delete userStore[userId];
}

module.exports = {
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  _store: userStore, // for debug/testing only
};

