import React, { useState, useEffect } from 'react';

// A constante ENDERECO_SERVIDOR foi removida para usar rotas relativas (/api).
// Se precisar testar localmente, reative temporariamente:
// const ENDERECO_SERVIDOR = 'http://localhost:8000'; 
const ENDERECO_SERVIDOR = ''; 

// Componente principal
function App() {
  const [view, setView] = useState('list'); // 'list' ou 'form'
  const [produtos, setProdutos] = useState([]);
  const [produtoEditando, setProdutoEditando] = useState(null);

  // (Retrieve) Função para buscar os produtos da API
  const fetchProdutos = async () => {
    try {
      // Chama a API usando o prefixo /api (que será roteado pelo Vercel)
      const response = await fetch(`${ENDERECO_SERVIDOR}/api/produtos`);
      if (!response.ok) throw new Error('Erro ao buscar produtos');
      const data = await response.json();
      setProdutos(data);
    } catch (error) {
      console.error(error);
      alert('Erro ao carregar lista: ' + error.message);
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
      let method;
      
      let url = `${ENDERECO_SERVIDOR}/api/produto`;

      if (produto.produtoId) {
        // Update (PUT)
        method = 'PUT';
        url += `/${produto.produtoId}`;
      } else {
        // Create (POST)
        method = 'POST';
      }

      response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(produto),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar produto');
      }
      
      const result = await response.json();
      alert(result.message || 'Operação realizada com sucesso!');
      
      await fetchProdutos(); // Re-busca a lista
      setView('list'); // Volta para a lista
      setProdutoEditando(null); // Limpa o formulário

    } catch (error) {
      console.error(error);
      alert('Erro ao salvar produto: ' + error.message);
    }
  };

  // (Delete) Função para deletar
  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este produto?')) {
      return;
    }

    try {
      const response = await fetch(`${ENDERECO_SERVIDOR}/api/produto/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Erro ao excluir produto');
      
      const result = await response.json();
      alert(result.message || 'Produto excluído com sucesso!');

      await fetchProdutos();

    } catch (error) {
      console.error(error);
      alert('Erro ao excluir produto: ' + error.message);
    }
  };

  const startEdit = (produto) => {
    setProdutoEditando(produto);
    setView('form');
  };

  const cancelEdit = () => {
    setProdutoEditando(null);
    setView('list');
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Cadastro de Produtos</h1>
        <p>CRUD com React (Front) e Node.js (Back)</p>
      </div>

      <div className="card">
        {view === 'list' && (
          <ListaProdutos 
            produtos={produtos}
            onEdit={startEdit}
            onDelete={handleDelete}
            onCreate={() => {
              setProdutoEditando(null);
              setView('form');
            }}
          />
        )}
        {view === 'form' && (
          <FormularioProduto 
            produto={produtoEditando} 
            onSave={handleSave} 
            onCancel={cancelEdit} 
          />
        )}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------
// Componente: ListaProdutos (Mantido o código original)
// -------------------------------------------------------------------
function ListaProdutos({ produtos, onEdit, onDelete, onCreate }) {
  return (
    <div className="list-container">
      <div className="card-header">
        <h2>Lista de Produtos</h2>
        <button 
          className="btn btn-primary" 
          onClick={onCreate}
        >
          Novo Produto
        </button>
      </div>
      
      {produtos.length === 0 ? (
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
              <tr>
                <td colSpan="6" className="text-center">
                  Nenhum produto cadastrado.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
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
              {produtos.map(produto => (
                <tr key={produto.produtoId}>
                  <td>{produto.produtoId}</td>
                  <td>{produto.nome}</td>
                  <td>{produto.descricao}</td>
                  <td>R$ {parseFloat(produto.preco).toFixed(2)}</td>
                  <td>{produto.estoque} un.</td>
                  <td className="actions">
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => onEdit(produto)}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => onDelete(produto.produtoId)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// -------------------------------------------------------------------
// Componente: FormularioProduto (Com correção do useEffect)
// -------------------------------------------------------------------
function FormularioProduto({ onSave, produtoInicial, onCancel }) {
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
  });

  // CORREÇÃO DO ERRO DE COMPILAÇÃO
  // Este useEffect agora tem a lógica correta para evitar a falha 'missing dependency'.
  useEffect(() => {
    if (produtoInicial) {
      setFormData({
        nome: produtoInicial.nome,
        descricao: produtoInicial.descricao || '',
        preco: produtoInicial.preco,
        estoque: produtoInicial.estoque,
      });
    } else {
      // Limpa o formulário quando não há produtoInicial (modo de criação)
      setFormData({
        nome: '',
        descricao: '',
        preco: '',
        estoque: '',
      });
    }
  }, [produtoInicial]); // Só depende de produtoInicial, resolvendo o erro do linter.

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
    <div className="form-container">
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