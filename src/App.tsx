import React, { useState, useEffect, useRef } from "react";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Receipt,
  Settings,
  Search,
  Bell,
  Plus,
  MoreVertical,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Calendar,
  Download,
  Upload,
  Activity,
  Briefcase,
  Clock,
  X,
  Moon,
  Sun,
  Pencil,
} from "lucide-react";

const formatCurrency = (value, currency = "BRL") => {
  return new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(
    Number(value) || 0
  );
};

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const options = { day: "2-digit", month: "2-digit", year: "numeric" };
  return new Date(dateString).toLocaleDateString("pt-BR", options);
};

const generateId = () => Math.random().toString(36).substr(2, 9);

const initialSettings = {
  studioName: "Studio Design",
  monthlyGoal: 20000,
  taxRate: 6,
  taxType: "Simples Nacional",
  currency: "BRL",
  theme: "light",
};

const initialClients = [
  {
    id: "c1",
    name: "Acme Corp",
    company: "Acme LTDA",
    email: "contato@acme.com",
    phone: "11999999999",
    document: "00.000.000/0001-00",
    status: "active",
  },
  {
    id: "c2",
    name: "Tech Solutions",
    company: "Tech Sol",
    email: "hello@tech.com",
    phone: "11888888888",
    document: "11.111.111/0001-11",
    status: "active",
  },
];

const initialProjects = [
  {
    id: "p1",
    clientId: "c1",
    name: "Redesign App Mobile",
    totalValue: 15000,
    startDate: "2026-07-01",
    endDate: "2026-08-15",
    status: "Criando/Ajuste",
    progress: 45,
    owner: "Admin",
    category: "UI/UX",
    note: "Cliente solicitou paleta dark mode opcional.",
  },
  {
    id: "p2",
    clientId: "c2",
    name: "Branding Completo",
    totalValue: 8000,
    startDate: "2026-06-10",
    endDate: "2026-07-20",
    status: "Aprovação",
    progress: 90,
    owner: "Admin",
    category: "Branding",
    note: "",
  },
];

const initialTransactions = [
  {
    id: "t1",
    type: "revenue",
    description: "Sinal - Redesign App",
    value: 5000,
    date: "2026-07-02",
    status: "pago",
    projectId: "p1",
    category: "Serviço",
    note: "",
  },
  {
    id: "t2",
    type: "expense",
    expenseType: "fixed",
    description: "Adobe CC",
    value: 250,
    date: "2026-07-05",
    status: "pago",
    category: "Software",
    note: "",
  },
  {
    id: "t3",
    type: "expense",
    expenseType: "variable",
    description: "Freelancer Ilustração",
    value: 1200,
    date: "2026-07-10",
    status: "pendente",
    projectId: "p2",
    category: "Terceiros",
    note: "Aguardando envio da NF",
  },
  {
    id: "t4",
    type: "revenue",
    description: "Parcela 2 - Branding",
    value: 4000,
    date: "2026-07-15",
    status: "pendente",
    projectId: "p2",
    category: "Serviço",
    note: "",
  },
];

const Card = ({ children, className = "" }) => (
  <div
    className={`bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const Badge = ({ children, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300",
    success:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    warning:
      "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    danger: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    info: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    orange:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  };
  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "primary",
  className = "",
  icon: Icon,
  onClick,
  type = "button",
}) => {
  const baseStyle =
    "inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variants = {
    primary:
      "bg-zinc-900 text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-zinc-200 focus:ring-zinc-900",
    secondary:
      "bg-white text-zinc-700 border border-zinc-300 hover:bg-zinc-50 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700 dark:hover:bg-zinc-700 focus:ring-zinc-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-600",
    ghost:
      "text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
  };
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variants[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex justify-between items-center p-4 border-b border-zinc-200 dark:border-zinc-800">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};

const Dashboard = ({ data, onOpenTransactionModal }) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthTransactions = data.transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });

  const received = monthTransactions
    .filter((t) => t.type === "revenue" && t.status === "pago")
    .reduce((acc, t) => acc + Number(t.value), 0);
  const receivables = monthTransactions
    .filter((t) => t.type === "revenue" && t.status !== "pago")
    .reduce((acc, t) => acc + Number(t.value), 0);
  const expenses = monthTransactions
    .filter((t) => t.type === "expense")
    .reduce((acc, t) => acc + Number(t.value), 0);

  const estimatedTaxes = received * (data.settings.taxRate / 100);
  const netProfit = received - expenses - estimatedTaxes;
  const progressPercent = Math.min(
    (received / data.settings.monthlyGoal) * 100,
    100
  );

  const activeProjects = data.projects.filter(
    (p) =>
      p.status === "Criando/Ajuste" ||
      p.status === "Briefing" ||
      p.status === "Aprovação"
  );
  const activeProjectsValue = activeProjects.reduce(
    (acc, p) => acc + Number(p.totalValue),
    0
  );

  const exportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "Data,Descricao,Tipo,Valor,Status\n" +
      monthTransactions
        .map(
          (t) => `${t.date},${t.description},${t.type},${t.value},${t.status}`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `relatorio_${currentMonth + 1}_${currentYear}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white tracking-tight">
            Visão Geral
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Resumo financeiro e operacional do mês atual.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download} onClick={exportReport}>
            Exportar Relatório
          </Button>
          <Button
            variant="primary"
            icon={Plus}
            onClick={() => onOpenTransactionModal("revenue")}
          >
            Nova Transação
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Valor Líquido (Mês)
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {formatCurrency(netProfit)}
              </h3>
            </div>
            <div className="p-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
              <DollarSign
                size={20}
                className="text-zinc-700 dark:text-zinc-300"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <TrendingUp size={16} className="text-emerald-500 mr-1" />
            <span className="text-emerald-500 font-medium">Lucro real</span>
            <span className="text-zinc-400 ml-2">após impostos</span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total Recebido
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {formatCurrency(received)}
              </h3>
            </div>
            <div className="p-2 bg-emerald-50 dark:bg-emerald-900/20 rounded-lg">
              <TrendingUp
                size={20}
                className="text-emerald-600 dark:text-emerald-400"
              />
            </div>
          </div>
          <div className="mt-4 w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
            <div
              className="bg-emerald-500 h-1.5 rounded-full"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            {progressPercent.toFixed(1)}% da meta de{" "}
            {formatCurrency(data.settings.monthlyGoal)}
          </p>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Total de Despesas
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {formatCurrency(expenses)}
              </h3>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <TrendingDown
                size={20}
                className="text-red-600 dark:text-red-400"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between text-sm">
            <span className="text-zinc-500">Impostos est.:</span>
            <span className="font-medium text-zinc-700 dark:text-zinc-300">
              {formatCurrency(estimatedTaxes)}
            </span>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
                Contas a Receber
              </p>
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mt-1">
                {formatCurrency(receivables)}
              </h3>
            </div>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Activity
                size={20}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <Clock size={16} className="text-amber-500 mr-1" />
            <span className="text-zinc-500">Previsto para este mês</span>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
              Projetos em Andamento ({activeProjects.length})
            </h3>
            <span className="text-sm font-medium text-zinc-500">
              Vol. Total: {formatCurrency(activeProjectsValue)}
            </span>
          </div>
          <div className="space-y-4">
            {activeProjects.map((project) => (
              <div
                key={project.id}
                className="group flex items-center justify-between p-3 hover:bg-zinc-50 dark:hover:bg-zinc-800/50 rounded-lg border border-transparent hover:border-zinc-200 dark:hover:border-zinc-800 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-500">
                    <Briefcase size={18} />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {project.name}
                    </h4>
                    <p className="text-xs text-zinc-500">
                      {
                        data.clients.find((c) => c.id === project.clientId)
                          ?.name
                      }{" "}
                      • Entrega: {formatDate(project.endDate)}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                    {formatCurrency(project.totalValue)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-zinc-500 w-8 text-right">
                      {project.progress}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {activeProjects.length === 0 && (
              <div className="text-center py-8 text-zinc-500 text-sm">
                Nenhum projeto ativo no momento.
              </div>
            )}
          </div>
        </Card>

        <Card className="p-6 flex flex-col">
          <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
            Próximos 7 Dias
          </h3>
          <div className="flex-1 space-y-4">
            {data.transactions
              .filter((t) => t.status === "pendente")
              .sort((a, b) => new Date(a.date) - new Date(b.date))
              .slice(0, 5)
              .map((t) => (
                <div
                  key={t.id}
                  className="flex items-start justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 line-clamp-1">
                      {t.description}
                    </p>
                    <p className="text-xs text-zinc-500 flex items-center gap-1 mt-0.5">
                      <Calendar size={12} /> {formatDate(t.date)}
                    </p>
                  </div>
                  <Badge variant={t.type === "revenue" ? "success" : "danger"}>
                    {t.type === "revenue" ? "+" : "-"}
                    {formatCurrency(t.value)}
                  </Badge>
                </div>
              ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

const ClientsView = ({ data, onAddClient, globalSearch }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [localSearch, setLocalSearch] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    company: "",
    email: "",
    phone: "",
    document: "",
    status: "active",
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddClient(formData);
    setModalOpen(false);
    setFormData({
      name: "",
      company: "",
      email: "",
      phone: "",
      document: "",
      status: "active",
    });
  };

  const searchTerm = globalSearch || localSearch;
  const filteredClients = data.clients.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Clientes
          </h1>
          <p className="text-sm text-zinc-500">
            Gerencie sua carteira de clientes.
          </p>
        </div>
        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setModalOpen(true)}
        >
          Novo Cliente
        </Button>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-4 items-center">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Buscar por nome, empresa ou documento..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Cliente / Empresa
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Contato
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Projetos
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredClients.map((client) => {
                const clientProjects = data.projects.filter(
                  (p) => p.clientId === client.id
                ).length;
                return (
                  <tr
                    key={client.id}
                    className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                  >
                    <td className="p-4">
                      <p className="text-sm font-medium text-zinc-900 dark:text-white">
                        {client.name}
                      </p>
                      <p className="text-xs text-zinc-500">{client.company}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-sm text-zinc-700 dark:text-zinc-300">
                        {client.email}
                      </p>
                      <p className="text-xs text-zinc-500">{client.phone}</p>
                    </td>
                    <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
                      {clientProjects} ativos
                    </td>
                    <td className="p-4">
                      <Badge variant="success">Ativo</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredClients.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Nenhum cliente encontrado.
            </div>
          )}
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Adicionar Novo Cliente"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nome do Contato *
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Empresa
            </label>
            <input
              type="text"
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              CPF/CNPJ
            </label>
            <input
              type="text"
              name="document"
              value={formData.document}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
            <Button variant="ghost" onClick={() => setModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              Salvar Cliente
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const ProjectsView = ({ data, onAddProject, onEditProject, globalSearch }) => {
  const defaultFormData = {
    name: "",
    clientId: "",
    totalValue: "",
    startDate: "",
    endDate: "",
    status: "Briefing",
    progress: 0,
    owner: "Admin",
    category: "",
    note: "",
  };

  const [modalMode, setModalMode] = useState(null); // 'add' | 'edit' | null
  const [formData, setFormData] = useState(defaultFormData);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleOpenAdd = () => {
    setFormData(defaultFormData);
    setModalMode("add");
  };

  const handleOpenEdit = (project) => {
    setFormData({
      ...defaultFormData,
      ...project,
    });
    setModalMode("edit");
  };

  const handleCloseModal = () => {
    setModalMode(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      totalValue: Number(formData.totalValue),
      progress: Number(formData.progress),
    };

    if (modalMode === "add") {
      onAddProject(payload);
    } else if (modalMode === "edit") {
      onEditProject(payload);
    }

    setModalMode(null);
  };

  const filteredProjects = data.projects.filter((p) =>
    p.name.toLowerCase().includes(globalSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Projetos
          </h1>
          <p className="text-sm text-zinc-500">
            Acompanhamento e controle financeiro por projeto.
          </p>
        </div>
        <Button variant="primary" icon={Plus} onClick={handleOpenAdd}>
          Novo Projeto
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProjects.map((project) => {
          const client = data.clients.find((c) => c.id === project.clientId);
          const projectTx = data.transactions.filter(
            (t) => t.projectId === project.id
          );
          const received = projectTx
            .filter((t) => t.type === "revenue" && t.status === "pago")
            .reduce((a, b) => a + Number(b.value), 0);
          const costs = projectTx
            .filter((t) => t.type === "expense")
            .reduce((a, b) => a + Number(b.value), 0);
          const profit = received - costs;
          const margin =
            received > 0 ? ((profit / received) * 100).toFixed(0) : 0;

          let statusVariant = "default";
          if (project.status === "Briefing") statusVariant = "warning";
          else if (project.status === "Criando/Ajuste")
            statusVariant = "orange";
          else if (project.status === "Aprovação") statusVariant = "success";
          else if (project.status === "Concluído") statusVariant = "info";

          return (
            <Card
              key={project.id}
              className="p-5 flex flex-col relative group transition-colors hover:border-zinc-300 dark:hover:border-zinc-700"
            >
              <button
                onClick={() => handleOpenEdit(project)}
                className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                title="Editar Projeto"
              >
                <Pencil size={16} />
              </button>

              <div className="flex justify-between items-start mb-4 pr-6">
                <div>
                  <Badge variant={statusVariant} className="mb-2 inline-block">
                    {project.status}
                  </Badge>
                  <h3 className="text-lg font-semibold text-zinc-900 dark:text-white leading-tight">
                    {project.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {client?.name || "Cliente Removido"}
                  </p>
                </div>
              </div>

              <div className="space-y-3 flex-1">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-zinc-500">Progresso</span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {project.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-zinc-100 dark:bg-zinc-800 rounded-full h-1.5">
                    <div
                      className="bg-zinc-900 dark:bg-zinc-100 h-1.5 rounded-full"
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <div>
                    <p className="text-xs text-zinc-500">Valor Total</p>
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {formatCurrency(project.totalValue)}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500">Margem</p>
                    <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400">
                      {margin}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-xs text-zinc-500">
                <span className="flex items-center gap-1">
                  <Calendar size={14} /> {formatDate(project.endDate)}
                </span>
                <span
                  className="flex items-center gap-1 truncate max-w-[120px]"
                  title={project.note}
                >
                  <Users size={14} /> {project.owner}
                </span>
              </div>
            </Card>
          );
        })}
        {filteredProjects.length === 0 && (
          <div className="col-span-3 text-center py-8 text-zinc-500 text-sm">
            Nenhum projeto encontrado.
          </div>
        )}
      </div>

      <Modal
        isOpen={modalMode !== null}
        onClose={handleCloseModal}
        title={modalMode === "add" ? "Novo Projeto" : "Editar Projeto"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nome do Projeto *
            </label>
            <input
              required
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Cliente *
            </label>
            <select
              required
              name="clientId"
              value={formData.clientId}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            >
              <option value="">Selecione um cliente...</option>
              {data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Valor Total (R$) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                name="totalValue"
                value={formData.totalValue}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Status
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="Briefing">Briefing</option>
                <option value="Criando/Ajuste">Criando/Ajuste</option>
                <option value="Aprovação">Aprovação</option>
                <option value="Concluído">Concluído</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Data de Início
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Data de Entrega
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Progresso (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                name="progress"
                value={formData.progress}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Categoria
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nota / Observações
            </label>
            <textarea
              name="note"
              value={formData.note || ""}
              onChange={handleChange}
              rows="3"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
              placeholder="Ex: Detalhes do escopo, links importantes..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
            <Button variant="ghost" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {modalMode === "add" ? "Salvar Projeto" : "Atualizar Projeto"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

const FinancialView = ({
  data,
  onOpenTransactionModal,
  onEditTx,
  globalSearch,
}) => {
  const [activeTab, setActiveTab] = useState("all");

  const filteredTx = data.transactions.filter((t) => {
    const matchesTab =
      activeTab === "all" ||
      (activeTab === "revenues" && t.type === "revenue") ||
      (activeTab === "expenses" && t.type === "expense");
    const matchesSearch = t.description
      .toLowerCase()
      .includes(globalSearch.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
            Financeiro
          </h1>
          <p className="text-sm text-zinc-500">
            Gestão de receitas, despesas e fluxo de caixa.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            icon={TrendingDown}
            onClick={() => onOpenTransactionModal("expense")}
          >
            Nova Despesa
          </Button>
          <Button
            variant="primary"
            icon={TrendingUp}
            onClick={() => onOpenTransactionModal("revenue")}
          >
            Nova Receita
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 flex gap-4 items-center justify-between">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "all"
                  ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setActiveTab("revenues")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "revenues"
                  ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Receitas
            </button>
            <button
              onClick={() => setActiveTab("expenses")}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                activeTab === "expenses"
                  ? "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : "text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              }`}
            >
              Despesas
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-zinc-50 dark:bg-zinc-800/50 border-b border-zinc-200 dark:border-zinc-800">
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Descrição
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Data
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="p-4 text-xs font-medium text-zinc-500 uppercase tracking-wider text-right">
                  Valor
                </th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {filteredTx.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-800/30 transition-colors"
                >
                  <td className="p-4">
                    <p className="text-sm font-medium text-zinc-900 dark:text-white">
                      {tx.description}
                    </p>
                    {tx.projectId && (
                      <p className="text-xs text-zinc-500">
                        Proj:{" "}
                        {data.projects.find((p) => p.id === tx.projectId)?.name}
                      </p>
                    )}
                  </td>
                  <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {tx.category}
                  </td>
                  <td className="p-4 text-sm text-zinc-700 dark:text-zinc-300">
                    {formatDate(tx.date)}
                  </td>
                  <td className="p-4">
                    <Badge
                      variant={tx.status === "pago" ? "success" : "warning"}
                    >
                      {tx.status}
                    </Badge>
                  </td>
                  <td
                    className={`p-4 text-sm font-medium text-right ${
                      tx.type === "revenue"
                        ? "text-emerald-600 dark:text-emerald-400"
                        : "text-zinc-900 dark:text-white"
                    }`}
                  >
                    {tx.type === "revenue" ? "+" : "-"}
                    {formatCurrency(tx.value)}
                  </td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => onEditTx(tx)}
                      className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors p-1 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800"
                      title="Editar Transação"
                    >
                      <Pencil size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTx.length === 0 && (
            <div className="text-center py-8 text-zinc-500 text-sm">
              Nenhuma transação encontrada.
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const SettingsView = ({ data, updateSettings, onRestoreData }) => {
  const [formData, setFormData] = useState(data.settings);
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    updateSettings(formData);
    alert("Configurações salvas.");
  };

  const handleExport = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(data));
    const link = document.createElement("a");
    link.setAttribute("href", dataStr);
    link.setAttribute("download", "backup_studio_design.json");
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleImport = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target.result);
        if (json.settings && json.clients) {
          onRestoreData(json);
          alert("Backup restaurado com sucesso.");
        } else {
          alert("Arquivo JSON inválido para este sistema.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo.");
      }
    };
    reader.readAsText(file);
    e.target.value = null; // reset
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-white">
          Configurações
        </h1>
        <p className="text-sm text-zinc-500">
          Ajuste os parâmetros globais do sistema.
        </p>
      </div>

      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Nome do Estúdio
            </label>
            <input
              type="text"
              name="studioName"
              value={formData.studioName}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Meta Financeira Mensal
            </label>
            <input
              type="number"
              name="monthlyGoal"
              value={formData.monthlyGoal}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Percentual de Imposto Estimado (%)
            </label>
            <input
              type="number"
              name="taxRate"
              value={formData.taxRate}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Tipo de Tributação
            </label>
            <select
              name="taxType"
              value={formData.taxType}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            >
              <option value="Simples Nacional">Simples Nacional</option>
              <option value="Lucro Presumido">Lucro Presumido</option>
              <option value="MEI">MEI</option>
              <option value="Pessoa Física">Pessoa Física</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 flex justify-end">
          <Button variant="primary" onClick={handleSave}>
            Salvar Alterações
          </Button>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
          Exportação de Dados
        </h3>
        <p className="text-sm text-zinc-500 mb-4">
          Gere um arquivo JSON contendo todos os registros locais do sistema
          para backup.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" icon={Download} onClick={handleExport}>
            Baixar Backup (JSON)
          </Button>
          <input
            type="file"
            accept=".json"
            ref={fileInputRef}
            className="hidden"
            onChange={handleImport}
          />
          <Button
            variant="secondary"
            icon={Upload}
            onClick={() => fileInputRef.current?.click()}
          >
            Restaurar Backup
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default function App() {
  const [activeView, setActiveView] = useState("dashboard");
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [globalSearch, setGlobalSearch] = useState("");

  const [appData, setAppData] = useState({
    settings: initialSettings,
    clients: initialClients,
    projects: initialProjects,
    transactions: initialTransactions,
  });

  const [txModal, setTxModal] = useState({
    isOpen: false,
    defaultType: "revenue",
    mode: "add",
  });
  const [txFormData, setTxFormData] = useState({
    id: null,
    type: "revenue",
    description: "",
    value: "",
    date: "",
    status: "pendente",
    projectId: "",
    category: "",
    note: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("creative_finance_data");
    if (saved) {
      try {
        setAppData(JSON.parse(saved));
      } catch (e) {
        console.error("Erro ao carregar dados locais.");
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("creative_finance_data", JSON.stringify(appData));
  }, [appData]);

  const updateSettings = (newSettings) =>
    setAppData((prev) => ({ ...prev, settings: newSettings }));

  const handleRestoreData = (data) => setAppData(data);

  const handleAddClient = (client) =>
    setAppData((prev) => ({
      ...prev,
      clients: [...prev.clients, { ...client, id: generateId() }],
    }));

  const handleAddProject = (project) =>
    setAppData((prev) => ({
      ...prev,
      projects: [...prev.projects, { ...project, id: generateId() }],
    }));

  const handleEditProject = (updatedProject) => {
    setAppData((prev) => ({
      ...prev,
      projects: prev.projects.map((p) =>
        p.id === updatedProject.id ? updatedProject : p
      ),
    }));
  };

  const openTxModal = (type = "revenue") => {
    setTxFormData({
      id: null,
      type,
      description: "",
      value: "",
      date: new Date().toISOString().split("T")[0],
      status: "pendente",
      projectId: "",
      category: "",
      note: "",
    });
    setTxModal({ isOpen: true, defaultType: type, mode: "add" });
  };

  const handleEditTx = (tx) => {
    setTxFormData({
      ...tx,
    });
    setTxModal({ isOpen: true, defaultType: tx.type, mode: "edit" });
  };

  const handleTxSubmit = (e) => {
    e.preventDefault();
    if (txModal.mode === "edit") {
      const updatedTx = {
        ...txFormData,
        value: Number(txFormData.value),
      };
      setAppData((prev) => ({
        ...prev,
        transactions: prev.transactions.map((t) =>
          t.id === updatedTx.id ? updatedTx : t
        ),
      }));
    } else {
      const newTx = {
        ...txFormData,
        value: Number(txFormData.value),
        id: generateId(),
      };
      setAppData((prev) => ({
        ...prev,
        transactions: [...prev.transactions, newTx],
      }));
    }
    setTxModal({ isOpen: false, defaultType: "revenue", mode: "add" });
  };

  const toggleTheme = () => {
    const newTheme = appData.settings.theme === "dark" ? "light" : "dark";
    updateSettings({ ...appData.settings, theme: newTheme });
  };

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "clients", label: "Clientes", icon: Users },
    { id: "projects", label: "Projetos", icon: FolderKanban },
    { id: "financial", label: "Financeiro", icon: Receipt },
    { id: "settings", label: "Configurações", icon: Settings },
  ];

  const renderView = () => {
    switch (activeView) {
      case "dashboard":
        return (
          <Dashboard data={appData} onOpenTransactionModal={openTxModal} />
        );
      case "clients":
        return (
          <ClientsView
            data={appData}
            onAddClient={handleAddClient}
            globalSearch={globalSearch}
          />
        );
      case "projects":
        return (
          <ProjectsView
            data={appData}
            onAddProject={handleAddProject}
            onEditProject={handleEditProject}
            globalSearch={globalSearch}
          />
        );
      case "financial":
        return (
          <FinancialView
            data={appData}
            onOpenTransactionModal={openTxModal}
            onEditTx={handleEditTx}
            globalSearch={globalSearch}
          />
        );
      case "settings":
        return (
          <SettingsView
            data={appData}
            updateSettings={updateSettings}
            onRestoreData={handleRestoreData}
          />
        );
      default:
        return (
          <div className="p-8 text-center text-zinc-500">
            Módulo em desenvolvimento.
          </div>
        );
    }
  };

  return (
    <div
      className={`min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 font-sans ${
        appData.settings.theme === "dark" ? "dark" : ""
      }`}
    >
      <aside
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800`}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          <div className="flex items-center gap-3 px-2 mb-8">
            <div className="w-8 h-8 bg-zinc-900 dark:bg-white rounded-lg flex items-center justify-center">
              <Target size={18} className="text-white dark:text-zinc-900" />
            </div>
            <span className="text-sm font-bold tracking-tight uppercase">
              {appData.settings.studioName}
            </span>
          </div>

          <div className="space-y-1 flex-1">
            <p className="px-2 text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Menu Principal
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-white"
                      : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800/50 dark:hover:text-white"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      isActive
                        ? "text-zinc-900 dark:text-white"
                        : "text-zinc-500"
                    }
                  />
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-8 h-8 rounded-full bg-zinc-200 dark:bg-zinc-700 flex items-center justify-center text-sm font-medium">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-zinc-900 dark:text-white truncate">
                  Admin
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  admin@estudio.com
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className={`p-4 sm:ml-64 transition-all duration-300`}>
        <header className="flex items-center justify-between h-14 mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!isSidebarOpen)}
              className="sm:hidden text-zinc-500 hover:text-zinc-900"
            >
              <MoreVertical size={20} />
            </button>
            <div className="relative hidden sm:block w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
                size={16}
              />
              <input
                type="text"
                placeholder="Buscar em projetos e finanças..."
                value={globalSearch}
                onChange={(e) => setGlobalSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 placeholder:text-zinc-400"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              {appData.settings.theme === "dark" ? (
                <Sun size={20} />
              ) : (
                <Moon size={20} />
              )}
            </button>
            <button className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white dark:border-zinc-950"></span>
            </button>
          </div>
        </header>

        <main className="max-w-7xl mx-auto pb-12">{renderView()}</main>
      </div>

      <Modal
        isOpen={txModal.isOpen}
        onClose={() => setTxModal({ ...txModal, isOpen: false })}
        title={txModal.mode === "add" ? "Nova Transação" : "Editar Transação"}
      >
        <form onSubmit={handleTxSubmit} className="space-y-4">
          <div className="flex gap-4 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
            <button
              type="button"
              onClick={() => setTxFormData({ ...txFormData, type: "revenue" })}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md ${
                txFormData.type === "revenue"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-500"
              }`}
            >
              Receita
            </button>
            <button
              type="button"
              onClick={() => setTxFormData({ ...txFormData, type: "expense" })}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md ${
                txFormData.type === "expense"
                  ? "bg-white dark:bg-zinc-900 shadow-sm text-zinc-900 dark:text-white"
                  : "text-zinc-500"
              }`}
            >
              Despesa
            </button>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Descrição *
            </label>
            <input
              required
              type="text"
              value={txFormData.description}
              onChange={(e) =>
                setTxFormData({ ...txFormData, description: e.target.value })
              }
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Valor (R$) *
              </label>
              <input
                required
                type="number"
                step="0.01"
                value={txFormData.value}
                onChange={(e) =>
                  setTxFormData({ ...txFormData, value: e.target.value })
                }
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Data *
              </label>
              <input
                required
                type="date"
                value={txFormData.date}
                onChange={(e) =>
                  setTxFormData({ ...txFormData, date: e.target.value })
                }
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Status
              </label>
              <select
                value={txFormData.status}
                onChange={(e) =>
                  setTxFormData({ ...txFormData, status: e.target.value })
                }
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="pago">Pago / Recebido</option>
                <option value="pendente">Pendente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                Vincular Projeto
              </label>
              <select
                value={txFormData.projectId}
                onChange={(e) =>
                  setTxFormData({ ...txFormData, projectId: e.target.value })
                }
                className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100"
              >
                <option value="">Nenhum</option>
                {appData.projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Nota / Observações
            </label>
            <textarea
              value={txFormData.note || ""}
              onChange={(e) =>
                setTxFormData({ ...txFormData, note: e.target.value })
              }
              rows="3"
              className="w-full px-3 py-2 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-900 dark:focus:ring-zinc-100 resize-none"
              placeholder="Observações sobre esta transação..."
            ></textarea>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800 mt-6">
            <Button
              variant="ghost"
              onClick={() => setTxModal({ ...txModal, isOpen: false })}
            >
              Cancelar
            </Button>
            <Button variant="primary" type="submit">
              {txModal.mode === "add"
                ? "Salvar Transação"
                : "Atualizar Transação"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
