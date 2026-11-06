import { useState } from 'react'
import './Cadastro.css'

function Cadastro() {
  const [mensagem, setMensagem] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    setMensagem('A tela está pronta, mas o cadastro ainda não está conectado ao servidor.')
  }

  return (
    <main className="cadastro-page">
      <section className="cadastro-card" aria-labelledby="cadastro-titulo">
        <div className="cadastro-marca" aria-hidden="true">
          <span className="cadastro-marca-icone">L</span>
          <span>Letter<span className="cadastro-marca-destaque">Station</span></span>
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
              placeholder="Pelo menos 8 caracteres"
              minLength={8}
              required
            />
          </div>

          <button className="cadastro-botao" type="submit">
            Cadastrar
          </button>
          <p className="cadastro-mensagem" role="status" aria-live="polite">
            {mensagem}
          </p>
        </form>

        <p className="cadastro-rodape">Sua próxima review começa aqui.</p>
      </section>
    </main>
  )
}

export default Cadastro