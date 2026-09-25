import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";


const AuthContext = createContext(null);


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const token = localStorage.getItem("access_token");

    if (!token) {
      setLoading(false);
      return;
    }

    api
      .get("/auth/me")
      .then((response) => {
        setUser(response.data);
      })
      .catch(() => {
        localStorage.removeItem("access_token");
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);


  const login = async (email, password) => {
    const response = await api.post("/auth/login", {
      email,
      password,
    });

    const { access_token } = response.data;

    localStorage.setItem(
      "access_token",
      access_token
    );

    const userResponse = await api.get("/auth/me");

    setUser(userResponse.data);

    return userResponse.data;
  };


  const register = async (
    name,
    email,
    password,
    role = "candidate"
  ) => {
    const response = await api.post("/auth/register", {
      name,
      email,
      password,
      role,
    });

    return response.data;
  };


  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
  };


  const isAuthenticated = Boolean(user);


  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}


export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used inside an AuthProvider"
    );
  }

  return context;
}