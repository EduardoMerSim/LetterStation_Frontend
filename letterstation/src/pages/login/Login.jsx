import { useState } from 'react'
import './Login.css'
import API_URL from '../../services/api'

export default function Login({ onAlternarTela, onEntrar }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [erro, setErro] = useState('')
  const [mostrarSenha, setMostrarSenha] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setErro('')

    try {
      const resposta = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          senha: password,
        }),
      })

      const dados = await resposta.json()

      if (!resposta.ok) {
        throw new Error(dados.detail || 'Não foi possível realizar o login.')
      }

      onEntrar(dados.token)
    } catch (error) {
      setErro(error.message || 'Erro ao conectar com o servidor.')
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-titulo">
        <div className="login-marca" aria-hidden="true">
          <span className="login-marca-icone">L</span>
          <span>
            Letter<span className="login-marca-destaque">Station</span>
          </span>
        </div>

        <header className="login-header">
          <h1 id="login-titulo">Bem-vindo de volta</h1>
          <p>Entre para descobrir e compartilhar reviews de jogos.</p>
        </header>

        <form className="login-form" onSubmit={handleSubmit}>
          <label className="login-campo">
            <span>E-mail</span>
            <input
              type="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@email.com"
              required
            />
          </label>

          <label className="login-campo">
            <span>Senha</span>

            <div className="login-senha-container">
              <input
                type={mostrarSenha ? 'text' : 'password'}
                name="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Digite sua senha"
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
          </label>
          {erro && <p className="login-erro">{erro}</p>}
          <button type="submit" className="login-btn">Entrar</button>
        </form>

        <p className="login-footer">
          Não tem uma conta?{' '}
          <a
            href="#cadastro"
            onClick={(event) => {
              event.preventDefault()
              onAlternarTela('cadastro')
            }}
          >
            Cadastre-se
          </a>
        </p>
      </section>
    </main>
  )
}
