import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-indigo-600 mb-4">
          Gerenciador Acadêmico
        </h1>
        <p className="text-lg text-slate-600 mb-8">
          Assuma o controle dos seus prazos e reduza o seu risco acadêmico.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/login" 
            className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 transition-colors"
          >
            Fazer Login
          </Link>
          <Link 
            href="/cadastro" 
            className="px-6 py-2 bg-white text-indigo-600 font-medium border border-indigo-600 rounded-md hover:bg-indigo-50 transition-colors"
          >
            Criar Conta
          </Link>
        </div>
      </div>
    </main>
  );
}
