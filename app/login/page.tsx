"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock } from "lucide-react";
import { api } from "../../services/api";

export default function LoginPage() {
  // Estados para guardar o que o usuário digita e possíveis mensagens de erro
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  
  // Ferramenta do Next.js para fazer o redirecionamento de páginas
  const router = useRouter();

  // Função que é disparada quando o usuário clica no botão "Entrar"
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o comportamento padrão de recarregar a página
    setErro(""); // Limpa qualquer erro anterior da tela

    try {
      // Faz o POST para o nosso AutenticacaoController do Java
      const response = await api.post("/login", {
        login: email,
        senha: senha
      });

      // Se o backend retornar o 200 OK, pegamos o token de dentro do JSON
      const token = response.data.token;
      
      // Salva o token no navegador (localStorage) para usarmos depois nas outras telas
      localStorage.setItem("token", token);

      // Leva o usuário para a tela principal do sistema
      router.push("/dashboard");
      
    } catch (error) {
      // Se o Java retornar erro (ex: 403 Forbidden para senha errada), mostramos o aviso
      setErro("E-mail ou senha incorretos. Tente novamente.");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        
        {/* Cabeçalho */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <LogIn size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Bem-vindo de volta</h1>
          <p className="text-slate-500 text-sm mt-2">Faça login para gerenciar suas tarefas</p>
        </div>

        {/* Formulário: agora ele chama o handleLogin quando é enviado */}
        <form onSubmit={handleLogin} className="space-y-4">
          
          {/* Caixa de Erro Visível: Só aparece se a variável 'erro' tiver algum texto */}
          {erro && (
            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-md border border-rose-200 text-center">
              {erro}
            </div>
          )}

          {/* Campo de E-mail */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">E-mail</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Mail size={18} />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" 
                placeholder="seu@email.com"
              />
            </div>
          </div>

          {/* Campo de Senha */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" 
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Botão de Entrar */}
          <button 
            type="submit" 
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors mt-4"
          >
            Entrar
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Ainda não tem uma conta?{" "}
          <Link href="/cadastro" className="text-indigo-600 hover:underline font-medium">
            Cadastre-se aqui
          </Link>
        </p>
      </div>
    </main>
  );
}
