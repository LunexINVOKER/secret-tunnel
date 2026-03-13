import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState();
  const [location, setLocation] = useState("GATE");

  async function signup(name) {
    const res = await fetch(API + "/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: name }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    setToken(json.token);
    setLocation("TABLET");
  }

  async function authenticate() {
    if (!token) throw new Error("No token found.");
    const res = await fetch(API + "/authenticate", {
      headers: { Authorization: "Bearer " + token },
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.message);
    setLocation("TUNNEL");
  }

  const value = { location, signup, authenticate };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}