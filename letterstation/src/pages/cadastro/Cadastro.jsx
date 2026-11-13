import { useState } from 'react'
import './Cadastro.css'

const TAMANHO_MINIMO = 8

function Cadastro({ onAlternarTela }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [confirmarSenha, setConfirmarSenha] = useState('')
  const [mensagem, setMensagem] = useState('')
  const [carregando, setCarregando] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)

  // Regras de senha
  const regras = {
    tamanhoMinimo: senha.length >= TAMANHO_MINIMO,
    temMaiuscula: /[A-Z]/.test(senha),
    temMinuscula: /[a-z]/.test(senha),
    temNumero: /[0-9]/.test(senha),
    temEspecial: /[^A-Za-z0-9]/.test(senha),
  }

  const senhaValida =
    regras.tamanhoMinimo && regras.temMaiuscula && regras.temEspecial && regras.temMinuscula && regras.temNumero

  const senhasCoincidem = senha === confirmarSenha

  function irParaLogin(event) {
    event?.preventDefault()
    onAlternarTela?.('login')
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!senhaValida) {
      setMensagem('Sua senha não atende a todos os requisitos de segurança.')
      return
    }

    if (!senhasCoincidem) {
      setMensagem('As senhas não coincidem.')
      return
    }
    setCarregando(true)
    setMensagem('')

    try {
      const resposta = await fetch(`${import.meta.env.VITE_API_URL}/usuarios`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          email: email.trim(),
          senha,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        const detalhe = Array.isArray(dados.detail)
          ? dados.detail.map((erro) => erro.msg).join(', ')
          : dados.detail

        throw new Error(detalhe || 'Não foi possível criar a conta.')
      }

      setMensagem('Conta criada com sucesso! Redirecionando para o login...')

      setTimeout(() => {
        onAlternarTela?.('login')
      }, 1500)

    } catch (error) {
      setMensagem(error.message || 'Erro ao realizar cadastro.')
    } finally {
      setCarregando(false)
    }
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
            <label htmlFor="cadastro-username">Username</label>
            <input
              id="cadastro-username"
              name="username"
              type="text"
              autoComplete="username"
              placeholder="Seu username"
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
            <div className="login-senha-container">
              <input
                id="cadastro-senha"
                name="senha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Crie uma senha forte"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                required
              />
              <button
                  type="button"
                  className="login-olho"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>
          <div className="cadastro-campo">
            <label htmlFor="cadastro-confirmar-senha">Confirmar senha</label>
            <div className="login-senha-container">
              <input
                id="cadastro-confirmar-senha"
                name="confirmarSenha"
                type={mostrarSenha ? 'text' : 'password'}
                autoComplete="new-password"
                placeholder="Digite a senha novamente"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                required
              />
              <button
                  type="button"
                  className="login-olho"
                  onClick={() => setMostrarSenha(!mostrarSenha)}
                  aria-label={mostrarSenha ? 'Ocultar senha' : 'Mostrar senha'}
                >
                  {mostrarSenha ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Checklist dinâmico de validação */}
          <div className="cadastro-checklist" aria-live="polite">
            <div className='bloco'>
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
            <div className='bloco'>
              <div className={`cadastro-checklist-item ${regras.temMinuscula ? 'valid' : ''}`}>
                {regras.temMinuscula ? '✓' : '✗'} Pelo menos 1 letra minúscula
              </div>
              <div className={`cadastro-checklist-item ${regras.temNumero ? 'valid' : ''}`}>
                {regras.temNumero ? '✓' : '✗'} Pelo menos 1 número
              </div>
              <div className={`cadastro-checklist-item ${senhasCoincidem ? 'valid' : ''}`}>
                {senhasCoincidem ? '✓' : '✗'} Senhas coincidem
              </div>
            </div>
          </div>

          <button
            className="cadastro-botao"
            type="submit"
            disabled={!senhaValida || !senhasCoincidem || !confirmarSenha || carregando}
            >
              {carregando ? 'Cadastrando...' : 'Cadastrar'}
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