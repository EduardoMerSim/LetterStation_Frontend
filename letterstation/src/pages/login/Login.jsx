import { useState } from 'react'
import './Login.css'

export default function Login({ onAlternarTela, onEntrar }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onEntrar()
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
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </label>

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
