import { useState } from "react";

/**
 * useAuth
 * Manages authentication state and role-based routing.
 *
 * Returns:
 *  user       – null when logged out, { name, email, role } when logged in
 *  page       – current top-level page: "landing" | "login" | "signup" | "app"
 *  navigate   – change page manually (e.g. navigate("login"))
 *  login      – call with userData to log in and jump to "app"
 *  logout     – clears user and returns to "landing"
 *  isPatient  – convenience boolean
 *  isLab      – convenience boolean
 */
export function useAuth() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);

  const login = (userData) => {
    // userData.role is set explicitly by the login form tab — no email guessing needed
    setUser(userData);
    setPage("app");
  };

  const logout = () => {
    setUser(null);
    setPage("landing");
  };

  return {
    user,
    page,
    navigate: setPage,
    login,
    logout,
    isPatient: user?.role === "patient",
    isLab:     user?.role === "laboratory",
    isAdmin:   user?.role === "admin",
  };
}
