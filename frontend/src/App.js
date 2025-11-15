import React, { useState, useEffect } from 'react';

// --- CONFIGURAÇÃO ---
// ATENÇÃO: Mude esta URL para a URL do seu deploy da Vercel (Parte 3 do Guia)
// const ENDERECO_SERVIDOR = 'https://seu-backend-deploy.vercel.app';
// Para testar localmente, use:
const ENDERECO_SERVIDOR = 'http://localhost:8000';
// --- FIM DA CONFIGURAÇÃO ---

// Componente principal
function App() {
  const [view, setView] = useState('list'); // 'list' ou 'form'
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);

  // (Retrieve) Função para buscar os produtos da API
  const fetchProdutos = async () => {
    try {
      const response = await fetch(`${ENDERECO_SERVIDOR}/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Efeito que carrega os produtos quando o app inicia
  useEffect(() => {
    fetchProdutos();
  }, []);

  // (Create ou Update) Função para salvar
  const handleSave = async (produto) => {
    try {
      let response;
      let url = `${ENDERECO_SERVIDOR}/produto`;

      if (produto.produtoId) {
        // Update (PUT)
        url += `/${produto.produtoId}`;
        response = await fetch(url, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
        });
      } else {
        // Create (POST)
        response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto),
        });
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar produto');
      }
      
      const data = await response.json();
      alert(data.message); // Exibe "Produto inserido..."
      
      fetchProdutos(); // Re-busca a lista
      setView('list'); // Volta para a lista
      setProdutoEditando(null); // Limpa o formulário

    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // (Delete) Função para deletar
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }
    try {
      const response = await fetch(`${ENDERECO_SERVIDOR}/produto/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Erro ao excluir produto');
      
      const data = await response.json();
      alert(data.message); // Exibe "Produto excluído..."

      fetchProdutos(); // Re-busca a lista
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  // Funções de Navegação
  const showForm = (produto) => {
    setProdutoEditando(produto || null); // Se 'produto' for nulo, é um formulário de criação
    setView('form');
  };

  const showList = () => {
    setView('list');
    setProdutoEditando(null);
  };

  // Renderização principal
  return (
    <div className="container">
      <Header />
      {view === 'list' && (
        <TabelaProdutos
          produtos={produtos}
          onEdit={showForm}
          onDelete={handleDelete}
          onNew={() => showForm(null)}
        />
      )}
      {view === 'form' && (
        <FormularioProduto
          onSave={handleSave}
          produtoInicial={produtoEditando}
          onCancel={showList}
        />
      )}
    </div>
  );
}

// --- Componentes ---

function Header() {
  return (
    <header className="header">
      <h1>Cadastro de Produtos</h1>
      <p>CRUD com React (Front) e Node.js (Back)</p>
    </header>
  );
}

// Tabela que lista os produtos
function TabelaProdutos({ produtos, onEdit, onDelete, onNew }) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>Lista de Produtos</h2>
        <button onClick={onNew} className="btn btn-primary">
          Novo Produto
        </button>
      </div>
      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Estoque</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {produtos.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            ) : (
              produtos.map((produto) => (
                <tr key={produto.produtoId}>
                  <td>{produto.produtoId}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td>{produto.estoque}</td>
                  <td className="actions">
                    <button
                      onClick={() => onEdit(produto)}
                      className="btn btn-secondary"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => onDelete(produto.produtoId)}
                      className="btn btn-danger"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Formulário para criar ou editar um produto
function FormularioProduto({ onSave, produtoInicial, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
  });

  // Verifica se é um formulário de edição e preenche os dados
  useEffect(() => {
    if (produtoInicial) {
      setFormData({
        nome: produtoInicial.nome,
        descricao: produtoInicial.descricao || '',
        preco: produtoInicial.preco,
        estoque: produtoInicial.estoque,
      });
    }
  }, [produtoInicial]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validação simples
    if (!formData.nome || !formData.preco || !formData.estoque) {
      alert('Nome, Preço e Estoque são campos obrigatórios.');
      return;
    }

    const produtoParaSalvar = {
      ...formData,
      preco: parseFloat(formData.preco),
      estoque: parseInt(formData.estoque, 10),
    };
    
    if (produtoInicial) {
      produtoParaSalvar.produtoId = produtoInicial.produtoId;
    }

    onSave(produtoParaSalvar);
  };

  return (
    <div className="card">
      <h2 className="card-header">
        {produtoInicial ? 'Editar Produto' : 'Novo Produto'}
      </h2>
      <form onSubmit={handleSubmit} className="form-container">
        <div className="form-group">
          <label htmlFor="nome">Nome *</label>
          <input
            type="text"
            name="nome"
            id="nome"
            value={formData.nome}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="descricao">Descrição</label>
          <input
            type="text"
            name="descricao"
            id="descricao"
            value={formData.descricao}
            onChange={handleChange}
          />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="preco">Preço (R$) *</label>
            <input
              type="number"
              name="preco"
              id="preco"
              value={formData.preco}
              onChange={handleChange}
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="estoque">Estoque (Unid.) *</label>
            <input
              type="number"
              name="estoque"
              id="estoque"
              value={formData.estoque}
              onChange={handleChange}
              min="0"
              step="1"
              required
            />
          </div>
        </div>
        <div className="form-actions">
          <button
            type="submit"
            className="btn btn-success"
          >
            Salvar
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="btn btn-secondary"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

export default App;