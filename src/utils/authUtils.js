export const USER_ROLES = {
  DB_ADMIN: "Database Admin",
  ADMIN_STAFF: "Admin Staff",
  LECTURER: "Lecturer",
};

export const DEFAULT_USERS = [
  {
    id: "USR001",
    fullName: "System Database Admin",
    username: "dbadmin",
    email: "dbadmin@spteco.ac.bw",
    role: USER_ROLES.DB_ADMIN,
    password: "dbadmin123",
    status: "Active",
    lastLogin: "",
  },
  {
    id: "USR002",
    fullName: "Admin Staff User",
    username: "admin",
    email: "admin@spteco.ac.bw",
    role: USER_ROLES.ADMIN_STAFF,
    password: "admin123",
    status: "Active",
    lastLogin: "",
  },
  {
    id: "USR003",
    fullName: "Lecturer User",
    username: "lecturer",
    email: "lecturer@spteco.ac.bw",
    role: USER_ROLES.LECTURER,
    password: "lecturer123",
    status: "Active",
    lastLogin: "",
  },
];

export function seedDefaultUsers() {
  const users = JSON.parse(localStorage.getItem("users"));

  if (!users || users.length === 0) {
    localStorage.setItem("users", JSON.stringify(DEFAULT_USERS));
  }
}

export function getUsers() {
  seedDefaultUsers();
  return JSON.parse(localStorage.getItem("users")) || [];
}

export function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

export function getLoggedInUser() {
  return JSON.parse(localStorage.getItem("loggedInUser"));
}

export function logoutUser() {
  localStorage.removeItem("loggedInUser");
}

export function loginUser(username, password) {
  const users = getUsers();

  const user = users.find(
    (u) =>
      u.username === username.trim() &&
      u.password === password &&
      u.status === "Active"
  );

  if (!user) {
    return null;
  }

  const updatedUser = {
    ...user,
    lastLogin: new Date().toLocaleString(),
  };

  const updatedUsers = users.map((u) =>
    u.id === user.id ? updatedUser : u
  );

  saveUsers(updatedUsers);
  localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));

  return updatedUser;
}

export function registerUser(newUser) {
  const users = getUsers();

  const usernameExists = users.some(
    (u) => u.username.toLowerCase() === newUser.username.toLowerCase()
  );

  if (usernameExists) {
    return {
      success: false,
      message: "Username already exists",
    };
  }

  const user = {
    id: `USR${String(users.length + 1).padStart(3, "0")}`,
    fullName: newUser.fullName,
    username: newUser.username,
    email: newUser.email,
    role: newUser.role,
    password: newUser.password,
    status: "Active",
    lastLogin: "",
  };

  saveUsers([...users, user]);

  return {
    success: true,
    message: "Account created successfully",
  };
}

export function hasRole(allowedRoles) {
  const user = getLoggedInUser();

  if (!user) return false;

  return allowedRoles.includes(user.role);
}