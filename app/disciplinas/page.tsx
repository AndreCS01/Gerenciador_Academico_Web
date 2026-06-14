"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
// IMPORTAMOS O ÍCONE TRASH2 AQUI TAMBÉM:
import { LayoutDashboard, BookOpen, LogOut, Plus, CheckSquare, Loader2, Trash2 } from "lucide-react";
import { api } from "../../services/api";
import toast, { Toaster } from "react-hot-toast";

interface Disciplina {
  id: number;
  nome: string;
  professor: string;
}

export default function DisciplinasPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  
  const [nome, setNome] = useState("");
  const [professor, setProfessor] = useState("");
  
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAutorizado(true);
      buscarDisciplinas();
    }
  }, [router]);

  const buscarDisciplinas = async () => {
    try {
      const res = await api.get("/disciplinas");
      setDisciplinas(res.data);
    } catch (error) {
      toast.error("Erro ao carregar as disciplinas.");
    }
  };

  const cadastrarDisciplina = async (e: React.FormEvent) => {
    e.preventDefault();
    setSalvando(true);

    try {
      await api.post("/disciplinas", {
        nome: nome,
        professor: professor
      });

      setNome("");
      setProfessor("");
      buscarDisciplinas();
      
      toast.success("Disciplina cadastrada com sucesso! 📚");
      
    } catch (error) {
      toast.error("Erro ao cadastrar a disciplina. Tente novamente.");
    } finally {
      setSalvando(false);
    }
  };

  // NOVO: Função para deletar a disciplina chamando o Java
  const deletarDisciplina = async (id: number) => {
    if (!confirm("ATENÇÃO: Excluir esta disciplina também apagará as tarefas vinculadas a ela no banco de dados. Deseja continuar?")) return;

    try {
      await api.delete(`/disciplinas/${id}`);
      toast.success("Disciplina removida com sucesso!");
      buscarDisciplinas(); // Recarrega a listagem
    } catch (error) {
      toast.error("Erro ao tentar excluir a disciplina.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  if (!autorizado) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      
      <Toaster position="top-right" reverseOrder={false} />

      {/* Menu Lateral */}
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

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Suas Disciplinas</h2>
          <p className="text-slate-500">Cadastre e gerencie as matérias do seu semestre.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" />
            Adicionar Nova Disciplina
          </h3>

          <form onSubmit={cadastrarDisciplina} className="flex flex-col md:flex-row gap-4">
            <input 
              type="text" 
              placeholder="Nome da matéria (ex: Inteligência Artificial)" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
              disabled={salvando}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />
            
            <input 
              type="text" 
              placeholder="Nome do Professor(a)" 
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              required
              disabled={salvando}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            />

            <button 
              type="submit" 
              disabled={salvando}
              className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center justify-center min-w-[120px] disabled:bg-indigo-400"
            >
              {salvando ? <Loader2 size={20} className="animate-spin" /> : "Salvar"}
            </button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {disciplinas.length === 0 ? (
            <div className="col-span-full p-12 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
              Nenhuma disciplina cadastrada ainda. Comece preenchendo o formulário acima! 📑
            </div>
          ) : (
            disciplinas.map((disc) => (
              <div key={disc.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col gap-4 hover:shadow-md transition-shadow relative group">
                
                {/* NOVO: Botão de Lixeira posicionado no topo direito do card */}
                <button 
                  onClick={() => deletarDisciplina(disc.id)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-rose-600 p-1.5 rounded-md hover:bg-rose-50 transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Excluir disciplina"
                >
                  <Trash2 size={16} />
                </button>

                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-lg flex items-center justify-center">
                  <BookOpen size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900 pr-6">{disc.nome}</h4>
                  <p className="text-sm text-slate-500 mt-1">Prof. {disc.professor}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
      
    </div>
  );
}
