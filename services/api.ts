import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  }
});

// "Intercepta" a requisição antes de ela sair do frontend
api.interceptors.request.use((config) => {
  // Busca o token que guardamos no localStorage no momento do login
  const token = localStorage.getItem("token");
  
  // Se o token existir, cola ele no cabeçalho (Header) no formato "Bearer <token>"
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});
