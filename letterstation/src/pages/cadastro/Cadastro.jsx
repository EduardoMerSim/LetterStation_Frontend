import { useState } from 'react'
import './Cadastro.css'

const TAMANHO_MINIMO = 6

function Cadastro({ onAlternarTela }) {
  const [nome, setNome] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [mensagem, setMensagem] = useState('')

  // Regras de senha
  const regras = {
    tamanhoMinimo: senha.length >= TAMANHO_MINIMO,
    temMaiuscula: /[A-Z]/.test(senha),
    temEspecial: /[^A-Za-z0-9]/.test(senha),
  }

  const senhaValida =
    regras.tamanhoMinimo && regras.temMaiuscula && regras.temEspecial

  function irParaLogin(event) {
    event?.preventDefault()
    onAlternarTela?.('login')
  }

  function handleSubmit(event) {
    event.preventDefault()

    if (!senhaValida) {
      setMensagem('Sua senha não atende a todos os requisitos de segurança.')
      return
    }

    // Aqui entra a chamada à API de cadastro
    console.log('Cadastro realizado:', { nome, username, email })

    setMensagem(`Conta criada com sucesso para: ${nome}`)
    setTimeout(() => onAlternarTela?.('login'), 1500)
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card" aria-labelledby="cadastro-titulo">
        <div className="cadastro-marca" aria-hidden="true">
          <span className="cadastro-marca-icone">L</span>
          <span>
            Letter<span className="cadastro-marca-destaque">Station</span>
          </span>
        </div>

        <header className="cadastro-header">
          <h1 id="cadastro-titulo">Crie sua conta</h1>
          <p>Entre para descobrir e compartilhar reviews de jogos.</p>
        </header>

        <form className="cadastro-form" onSubmit={handleSubmit}>
          <div className="cadastro-campo">
            <label htmlFor="cadastro-nome">Nome</label>
            <input
              id="cadastro-nome"
              name="nome"
              type="text"
              autoComplete="name"
              placeholder="Seu nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-campo">
            <label htmlFor="cadastro-username">Username</label>
            <input
              id="cadastro-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Como você será chamado"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-campo">
            <label htmlFor="cadastro-email">E-mail</label>
            <input
              id="cadastro-email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="voce@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="cadastro-campo">
            <label htmlFor="cadastro-senha">Senha</label>
            <input
              id="cadastro-senha"
              name="senha"
              type="password"
              autoComplete="new-password"
              placeholder="Crie uma senha forte"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          {/* Checklist dinâmico de validação */}
          <div className="cadastro-checklist" aria-live="polite">
            <div className={`cadastro-checklist-item ${regras.tamanhoMinimo ? 'valid' : ''}`}>
              {regras.tamanhoMinimo ? '✓' : '✗'} Mínimo de {TAMANHO_MINIMO} caracteres
            </div>
            <div className={`cadastro-checklist-item ${regras.temMaiuscula ? 'valid' : ''}`}>
              {regras.temMaiuscula ? '✓' : '✗'} Pelo menos 1 letra maiúscula
            </div>
            <div className={`cadastro-checklist-item ${regras.temEspecial ? 'valid' : ''}`}>
              {regras.temEspecial ? '✓' : '✗'} Pelo menos 1 caractere especial
            </div>
          </div>

          <button
            className="cadastro-botao"
            type="submit"
            disabled={!senhaValida}
          >
            Cadastrar
          </button>

          <p className="cadastro-mensagem" role="status" aria-live="polite">
            {mensagem}
          </p>
        </form>

        <p className="cadastro-rodape">
          Já tem uma conta?{' '}
          <a href="#login" onClick={irParaLogin}>
            Faça login
          </a>
        </p>
      </section>
    </main>
  )
}

export default Cadastro