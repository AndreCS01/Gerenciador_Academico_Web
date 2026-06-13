"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, LogOut, Plus, CheckCircle2, Circle, Calendar, CheckSquare } from "lucide-react";
import { api } from "../../services/api";

interface Disciplina {
  id: number;
  nome: string;
}

interface Tarefa {
  id: number;
  titulo: string;
  dataLimite: string; // Ajustado para bater com o Java
  status: string;     // Ajustado para bater com o Java
  disciplina: Disciplina;
}

export default function TarefasPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  
  const [tarefas, setTarefas] = useState<Tarefa[]>([]);
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  
  const [titulo, setTitulo] = useState("");
  const [dataEntrega, setDataEntrega] = useState("");
  const [disciplinaId, setDisciplinaId] = useState("");
  const [erro, setErro] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAutorizado(true);
      buscarDadosIniciais();
    }
  }, [router]);

  const buscarDadosIniciais = async () => {
    try {
      const [resTarefas, resDisciplinas] = await Promise.all([
        api.get("/tarefas"),
        api.get("/disciplinas")
      ]);
      setTarefas(resTarefas.data);
      setDisciplinas(resDisciplinas.data);
    } catch (error) {
      console.error("Erro ao buscar dados:", error);
    }
  };

  const cadastrarTarefa = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro("");

    if (!disciplinaId) {
      setErro("Por favor, selecione uma disciplina.");
      return;
    }

    try {
      await api.post("/tarefas", { 
        titulo: titulo, 
        dataLimite: dataEntrega, // Enviamos com o nome que o Java exige
        status: "A_FAZER",
        disciplina: { 
            id: Number(disciplinaId) 
        }
      });
      
      setTitulo("");
      setDataEntrega("");
      setDisciplinaId("");
      buscarDadosIniciais();
    } catch (error) {
      setErro("Erro ao cadastrar a tarefa. Verifique se os dados estão corretos.");
    }
  };

  const alternarStatusTarefa = async (id: number, statusAtual: string) => {
    try {
      // Descobre qual é o status contrário para enviar
      const novoStatus = statusAtual === 'CONCLUIDO' ? 'A_FAZER' : 'CONCLUIDO';
      
      // Ajustamos a rota para adicionar o "/status" no final
      // E enviamos o dado como Parâmetro de URL (?status=...) exatamente como o Java pediu!
      await api.put(`/tarefas/${id}/status?status=${novoStatus}`);
      
      // Recarrega a lista para mostrar a alteração na tela
      buscarDadosIniciais();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatarData = (data: any) => {
    if (!data) return "";
    try {
      if (Array.isArray(data)) {
        const [ano, mes, dia] = data;
        return new Date(ano, mes - 1, dia).toLocaleDateString('pt-BR');
      }
      const dataObj = new Date(data);
      dataObj.setMinutes(dataObj.getMinutes() + dataObj.getTimezoneOffset());
      return dataObj.toLocaleDateString('pt-BR');
    } catch (e) {
      return "Data inválida";
    }
  };

  if (!autorizado) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
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
          <Link href="/disciplinas" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <BookOpen size={20} />
            <span className="font-medium">Disciplinas</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-800 rounded-lg text-left transition-colors">
            <CheckSquare size={20} />
            <span className="font-medium">Tarefas</span>
          </button>
        </nav>

        <button onClick={handleLogout} className="mt-auto flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
          <LogOut size={20} />
          <span className="font-medium">Sair</span>
        </button>
      </aside>

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Suas Tarefas</h2>
          <p className="text-slate-500">Acompanhe seus trabalhos e prazos.</p>
        </header>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
          <h3 className="text-lg font-medium text-slate-900 mb-4 flex items-center gap-2">
            <Plus size={20} className="text-indigo-600" />
            Nova Tarefa
          </h3>
          
          {erro && <div className="mb-4 p-3 bg-rose-50 text-rose-600 text-sm rounded-md border border-rose-200">{erro}</div>}

          <form onSubmit={cadastrarTarefa} className="flex flex-col lg:flex-row gap-4">
            <input 
              type="text" 
              placeholder="O que precisa ser feito?" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            
            <input 
              type="date" 
              value={dataEntrega}
              onChange={(e) => setDataEntrega(e.target.value)}
              required
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            />

            <select 
              value={disciplinaId}
              onChange={(e) => setDisciplinaId(e.target.value)}
              required
              className="px-4 py-2 bg-slate-50 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-700"
            >
              <option value="" disabled>Selecione a disciplina</option>
              {disciplinas.map(disc => (
                <option key={disc.id} value={disc.id}>{disc.nome}</option>
              ))}
            </select>

            <button type="submit" className="bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
              Salvar
            </button>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {tarefas.length === 0 ? (
            <div className="p-12 text-center text-slate-500">Nenhuma tarefa encontrada. Oba! 🎉</div>
          ) : (
            <ul className="divide-y divide-slate-200">
              {tarefas.map((tarefa) => {
                const isConcluida = tarefa.status === 'CONCLUIDO';
                
                return (
                  <li key={tarefa.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center gap-4">
                    <button onClick={() => alternarStatusTarefa(tarefa.id, tarefa.status)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      {isConcluida ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                    </button>
                    
                    <div className="flex-1">
                      <h4 className={`text-lg font-medium ${isConcluida ? 'text-slate-400 line-through' : 'text-slate-900'}`}>
                        {tarefa.titulo}
                      </h4>
                      <div className="flex gap-4 mt-1">
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <BookOpen size={14} /> {tarefa.disciplina?.nome || "Sem disciplina"}
                        </span>
                        <span className="text-sm text-slate-500 flex items-center gap-1">
                          <Calendar size={14} /> {formatarData(tarefa.dataLimite)}
                        </span>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </main>
      
    </div>
  );
}
