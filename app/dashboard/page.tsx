"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, AlertCircle, CheckCircle2, LogOut, CheckSquare, Calendar, Clock } from "lucide-react";
import { api } from "../../services/api";

interface Disciplina {
  id: number;
  nome: string;
}

interface Tarefa {
  id: number;
  titulo: string;
  dataLimite: string;
  status: string;
  disciplina?: Disciplina;
}

export default function DashboardPage() {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);
  const [temTarefas, setTemTarefas] = useState(false);
  
  const [pendencias, setPendencias] = useState<Tarefa[]>([]);
  // NOVO: Estado para guardar a lista de tarefas atrasadas
  const [atrasadas, setAtrasadas] = useState<Tarefa[]>([]);

  const [metricas, setMetricas] = useState({
    concluidas: 0,
    proximos7Dias: 0,
    atrasadas: 0
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAutorizado(true);
      carregarDadosDoDashboard();
    }
  }, [router]);

  const carregarDadosDoDashboard = async () => {
    try {
      await api.post("/tarefas/verificar-atrasos");

      const [resTarefas, resPendencias] = await Promise.all([
        api.get("/tarefas"),
        api.get("/tarefas/pendencias")
      ]);

      const listaTarefas: Tarefa[] = resTarefas.data;
      
      const apenasPendenciasReais = resPendencias.data.filter(
        (tarefa: Tarefa) => tarefa.status !== 'CONCLUIDO'
      );
      
      setPendencias(apenasPendenciasReais);
      setTemTarefas(listaTarefas.length > 0);

      let countConcluidas = 0;
      let count7Dias = 0;
      let countAtrasadas = 0;
      
      // NOVO: Array temporário para guardarmos as tarefas atrasadas
      const listaAtrasadas: Tarefa[] = [];

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const daquiA7Dias = new Date(hoje);
      daquiA7Dias.setDate(hoje.getDate() + 7);
      daquiA7Dias.setHours(23, 59, 59, 999);

      listaTarefas.forEach((tarefa) => {
        if (tarefa.status === 'CONCLUIDO') {
          countConcluidas++;
        } else {
          let dataDaTarefa = null;
          
          if (Array.isArray(tarefa.dataLimite)) {
            const [ano, mes, dia] = tarefa.dataLimite;
            dataDaTarefa = new Date(ano, mes - 1, dia);
          } else if (tarefa.dataLimite) {
            dataDaTarefa = new Date(tarefa.dataLimite);
            dataDaTarefa.setMinutes(dataDaTarefa.getMinutes() + dataDaTarefa.getTimezoneOffset());
          }

          if (dataDaTarefa) {
            dataDaTarefa.setHours(0, 0, 0, 0);
            
            if (dataDaTarefa < hoje) {
              countAtrasadas++;
              listaAtrasadas.push(tarefa); // Adiciona a tarefa na lista de atrasadas
            } else if (dataDaTarefa <= daquiA7Dias) {
              count7Dias++;
            }
          }
        }
      });

      // Atualiza o estado visual com a lista de atrasadas
      setAtrasadas(listaAtrasadas);

      setMetricas({
        concluidas: countConcluidas,
        proximos7Dias: count7Dias,
        atrasadas: countAtrasadas
      });

    } catch (error) {
      console.error("Erro ao carregar os dados do dashboard:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatarData = (data: any) => {
    if (!data) return "Sem data";
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
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-800 rounded-lg text-left transition-colors">
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <Link href="/disciplinas" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <BookOpen size={20} />
            <span className="font-medium">Disciplinas</span>
          </Link>
          
          <Link href="/tarefas" className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:text-white hover:bg-indigo-600 rounded-lg transition-colors">
            <CheckSquare size={20} />
            <span className="font-medium">Tarefas</span>
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

      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Visão Geral</h2>
          <p className="text-slate-500">Acompanhe seu desempenho e risco acadêmico.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Tarefas Concluídas</p>
              <p className="text-2xl font-bold text-slate-900">{metricas.concluidas}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex items-start gap-4">
            <div className="p-3 bg-amber-100 text-amber-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Próximos 7 Dias</p>
              <p className="text-2xl font-bold text-slate-900">{metricas.proximos7Dias}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-rose-200 flex items-start gap-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-rose-500"></div>
            <div className="p-3 bg-rose-100 text-rose-600 rounded-lg">
              <AlertCircle size={24} />
            </div>
            <div>
              <p className="text-slate-500 text-sm font-medium">Risco Acadêmico (Atrasadas)</p>
              <p className="text-2xl font-bold text-rose-600">{metricas.atrasadas}</p>
            </div>
          </div>
        </div>

        {!temTarefas ? (
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <BookOpen size={32} />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhuma tarefa encontrada</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-6">
              Você ainda não cadastrou nenhuma tarefa. Adicione suas entregas do semestre para começar a acompanhar os seus prazos!
            </p>
            <Link href="/tarefas" className="inline-block bg-indigo-600 text-white font-medium py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors">
              Ir para Tarefas
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* Tabela de Risco Acadêmico (Só aparece se tiver atrasos) */}
            {atrasadas.length > 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-rose-200 p-6">
                <h3 className="text-lg font-bold text-rose-700 mb-4 flex items-center gap-2">
                  <AlertCircle size={20} className="text-rose-600" />
                  Risco Acadêmico (Atrasadas)
                </h3>
                
                <div className="overflow-hidden rounded-lg border border-rose-100">
                  <table className="min-w-full divide-y divide-rose-100 bg-white text-left text-sm">
                    <thead className="bg-rose-50 text-xs font-semibold uppercase text-rose-700">
                      <tr>
                        <th className="px-6 py-3 font-bold">Tarefa</th>
                        <th className="px-6 py-3 font-bold">Disciplina</th>
                        <th className="px-6 py-3 font-bold">Vencimento</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {atrasadas.map((tarefa) => (
                        <tr key={tarefa.id} className="hover:bg-rose-50/50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{tarefa.titulo}</td>
                          <td className="px-6 py-4 text-slate-600">
                            <span className="inline-flex items-center gap-1 rounded bg-rose-100 px-2 py-1 text-xs font-medium text-rose-700">
                              {tarefa.disciplina?.nome || "Geral"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-rose-600 font-medium flex items-center gap-1">
                            <Calendar size={14} />
                            {formatarData(tarefa.dataLimite)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tabela de Pendências da Semana */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-amber-500" />
                Entregas Urgentes da Semana
              </h3>
              
              {pendencias.length === 0 ? (
                <div className="p-8 text-center text-slate-500 bg-slate-50 rounded-lg border border-dashed border-slate-200">
                  Nenhuma entrega pendente para os próximos 7 dias. Tudo sob controle! 😎
                </div>
              ) : (
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 bg-white text-left text-sm">
                    <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-700">
                      <tr>
                        <th className="px-6 py-3 font-bold">Tarefa</th>
                        <th className="px-6 py-3 font-bold">Disciplina</th>
                        <th className="px-6 py-3 font-bold">Data Limite</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {pendencias.map((tarefa) => (
                        <tr key={tarefa.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 font-medium text-slate-900">{tarefa.titulo}</td>
                          <td className="px-6 py-4 text-slate-600">
                            <span className="inline-flex items-center gap-1 rounded bg-indigo-50 px-2 py-1 text-xs font-medium text-indigo-700">
                              {tarefa.disciplina?.nome || "Geral"}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-amber-600 font-medium flex items-center gap-1">
                            <Calendar size={14} />
                            {formatarData(tarefa.dataLimite)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

          </div>
        )}
      </main>
      
    </div>
  );
}
