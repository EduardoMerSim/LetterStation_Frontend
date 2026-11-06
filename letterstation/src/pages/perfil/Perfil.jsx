import './Perfil.css'

function Perfil() {
  return (
    <div className="perfil-page">
      <aside className="perfil-sidebar" aria-label="Navegação">
        <a className="perfil-nav-link" href="/" aria-label="Voltar para o início">
          <span aria-hidden="true">←</span>
        </a>
        <a className="perfil-nav-link" href="/" aria-label="Buscar jogos">
          <span aria-hidden="true">⌕</span>
        </a>
        <div className="perfil-sidebar-avatar" aria-hidden="true">L</div>
      </aside>

      <main className="perfil-main">
        <span className="perfil-configuracoes" aria-hidden="true">⚙</span>

        <div className="perfil-conteudo">
          <section className="perfil-resumo" aria-label="Informações do perfil">
            <div className="perfil-avatar" aria-label="Foto do perfil">L</div>
            <div className="perfil-detalhes">
              <h1 className="perfil-username">username</h1>
              <p className="perfil-bio">Sua bio aparece aqui.</p>
            </div>
            <button className="perfil-seguidores" type="button">
              0 seguidores
            </button>
          </section>

          <section className="perfil-resenhas" aria-labelledby="perfil-resenhas-titulo">
            <h2 id="perfil-resenhas-titulo">Minhas resenhas</h2>
            <article className="perfil-resenha">
              <h3>Resenha 1</h3>
              <p>Uma resenha de jogo aparecerá aqui.</p>
            </article>
          </section>
        </div>
      </main>
    </div>
  )
}

export default Perfil