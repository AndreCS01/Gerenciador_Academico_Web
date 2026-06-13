"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, LogOut, Plus, GraduationCap, CheckSquare } from "lucide-react";
import { api } from "../../services/api";

// Define a estrutura (tipo) do que o Java vai nos devolver
interface Disciplina {
  id: number;
  nome: string;
  professor: string;
}

export default function DisciplinasPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  
  // Estados para gerenciar as disciplinas e o formulário
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  const [erro, setErro] = useState("");

  // Verifica o login e busca as disciplinas no backend logo que a tela abre
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAutorizado(true);
      buscarDisciplinas(); // Chama a função que busca no Java
    }
  }, [router]);

  // Função GET: Busca a lista no banco de dados
  const buscarDisciplinas = async () => {
    try {
      const response = await api.get("/disciplinas");
      setDisciplinas(response.data);
    } catch (error) {
      console.error("Erro ao buscar disciplinas:", error);
    }
  };

  // Função POST: Envia uma nova disciplina para o banco
  const cadastrarDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    try {
      await api.post("/disciplinas", { nome, professor });
      
      // Limpa os campos do formulário
      setNome("");
      setProfessor("");
      
      // Atualiza a lista na tela imediatamente
      buscarDisciplinas();
    } catch (error) {
      setErro("Erro ao cadastrar a disciplina. Verifique os dados e tente novamente.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

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
          <Link href="/dashboard" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-800 rounded-lg text-left transition-colors">
            <BookOpen size={20} />
            <span className="font-medium">Disciplinas</span>
          </button>
          <Link href="/tarefas" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <CheckSquare size={20} />
            <span className="font-medium">Tarefas</span>
          </Link>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      {/* Área Principal de Conteúdo */}
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Suas Disciplinas</h2>
          <p className="text-slate-500">Cadastre e gerencie as matérias do seu semestre.</p>
        </header>

        {/* Formulário de Cadastro */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" />
            Adicionar Nova Disciplina
          </h3>
          
          {erro && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-md border border-rose-200">{erro}</div>}

          <form onSubmit={cadastrarDisciplina} className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Nome da matéria (ex: Inteligência Artificial)" 
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Nome do Professor(a)" 
                value={professor}
                onChange={(e) => setProfessor(e.target.value)}
                required
                className="w-full px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
              />
            </div>
            <button type="submit" className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors whitespace-nowrap">
              Salvar
            </button>
          </form>
        </div>

        {/* Listagem em Cards */}
        {disciplinas.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma disciplina cadastrada</h3>
            <p className="text-slate-500">Utilize o formulário acima para adicionar sua primeira matéria do semestre.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {disciplinas.map((disciplina) => (
              <div key={disciplina.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col hover:border-indigo-300 transition-colors">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center mb-4">
                  <BookOpen size={20} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 line-clamp-1" title={disciplina.nome}>
                  {disciplina.nome}
                </h4>
                <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
                  <GraduationCap size={16} />
                  Prof. {disciplina.professor}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
      
    </div>
  );
}
