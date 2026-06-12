"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserPlus, Mail, Lock } from "lucide-react";
import { api } from "../../services/api";

export default function CadastroPage() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState(false);
  
  const router = useRouter();

  const handleCadastro = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    // Validação simples no frontend antes de bater na API
    if (senha !== confirmarSenha) {
      setErro("As senhas digitadas não coincidem.");
      return;
    }

    try {
      // Faz a requisição para o nosso UsuarioController
      await api.post("/usuarios", {
        login: email,
        senha: senha
      });

      // Exibe a mensagem de sucesso
      setSucesso(true);
      
      // Aguarda 2 segundos e manda o usuário automaticamente para a tela de login
      setTimeout(() => {
        router.push("/login");
      }, 2000);
      
    } catch (error: any) {
      // Trata o erro caso o e-mail já exista no banco (o retorno 400 Bad Request que configuramos)
      if (error.response && error.response.status === 400) {
        setErro("Erro: Este login já está cadastrado no sistema.");
      } else {
        setErro("Ocorreu um erro de comunicação com o servidor.");
      }
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center mb-4">
            <UserPlus size={24} />
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Criar Nova Conta</h1>
          <p className="text-slate-500 text-sm mt-2">Junte-se ao Gerenciador Acadêmico</p>
        </div>

        <form onSubmit={handleCadastro} className="space-y-4">
          
          {erro && (
            <div className="p-3 bg-rose-50 text-rose-600 text-sm rounded-md border border-rose-200 text-center">
              {erro}
            </div>
          )}

          {sucesso && (
            <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-md border border-emerald-200 text-center">
              Conta criada com sucesso! Redirecionando para o login...
            </div>
          )}

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

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Confirmar Senha</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Lock size={18} />
              </div>
              <input 
                type="password" 
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors" 
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={sucesso}
            className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cadastrar
          </button>
        </form>

        <p className="text-center text-sm text-slate-600 mt-6">
          Já possui uma conta?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline font-medium">
            Faça login aqui
          </Link>
        </p>
      </div>
    </main>
  );
}
