"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, AlertCircle, CheckCircle2, LogOut } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  
  // Variável para evitar que a tela pisque antes de verificarmos o token
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    // Busca o crachá de acesso no navegador
    const token = localStorage.getItem("token");
    
    // Se não tiver token, manda de volta para o login
    if (!token) {
      router.push("/login");
    } else {
      // Se tiver, libera o acesso à tela
      setAutorizado(true);
    }
  }, [router]);

  // Função para fazer o Log Out (sair do sistema)
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  // Retorna nulo enquanto verifica a segurança, para não mostrar a tela sem permissão
  if (!autorizado) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      {/* Menu Lateral (Sidebar) */}
      <aside className="w-full md:w-64 bg-indigo-700 text-white p-6 flex flex-col">
        <div className="flex items-center gap-3 mb-10">
          <BookOpen size={28} className="text-indigo-200" />
          <h1 className="text-xl font-bold">Gerenciador</h1>
        </div>
        
        <nav className="flex-1 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-800 rounded-lg text-left transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          <Link href="/disciplinas" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <BookOpen size={20} />
            <span className="font-medium">Disciplinas</span>
          </Link>
        </nav>

        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors"
        >
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500">Acompanhe seu desempenho e risco acadêmico.</p>
        </header>

        {/* Cards de Resumo (Hardcoded por enquanto, depois ligaremos ao Java) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Próximos 7 Dias</p>
              <p className="text-2xl font-bold text-slate-900">0</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-200 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Risco Acadêmico (Atrasadas)</p>
              <p className="text-2xl font-bold text-rose-600">0</p>
            </div>
          </div>
          
        </div>

        {/* Área Central Temporária */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <BookOpen size={32} />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma tarefa encontrada</h3>
          <p className="text-slate-500 max-w-md mx-auto">
            Você ainda não cadastrou nenhuma disciplina ou tarefa. Em breve construiremos as listagens para você começar a preencher o seu semestre!
          </p>
        </div>
      </main>
      
    </div>
  );
}
