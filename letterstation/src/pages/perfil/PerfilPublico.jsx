import { useState } from 'react'
import './Perfil.css'
import './PerfilPublico.css'

function PerfilPublico({
  usuario,
  perfilAtual,
  resenhas,
  seguindoInicial = false,
  onAlternarSeguir,
}) {
  const [seguindo, setSeguindo] = useState(seguindoInicial)

  if (!usuario) {
    return (
      <div className="perfil-page">
        <main className="perfil-main">
          <div className="perfil-conteudo">
            <div className="perfil-sem-resenhas">
              <span aria-hidden="true">?</span>
              <h3>Usuário não encontrado</h3>
              <p>Esse perfil não existe ou foi removido.</p>
              <a href="/">Voltar para o início</a>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Resenhas do usuário visto, mais novas primeiro, e média das notas.
  const resenhasDoUsuario = [...resenhas]
    .filter((resenha) => resenha.autor === usuario.username)
    .reverse()
  const comNota = resenhasDoUsuario.filter((resenha) => resenha.avaliacao > 0)
  const media = comNota.length
    ? (comNota.reduce((soma, resenha) => soma + resenha.avaliacao, 0) / comNota.length)
        .toFixed(1)
        .replace('.', ',')
    : '—'

  const seguidoresBase = usuario.seguidores ?? 0
  const totalSeguidores = seguidoresBase + (seguindo ? 1 : 0)

  function alternarSeguir() {
    const proximo = !seguindo
    setSeguindo(proximo)
    onAlternarSeguir?.(usuario.username, proximo)
  }

  return (
    <div className="perfil-page">
      {/* Navegação: voltar, buscar e acesso ao seu próprio perfil. */}
      <nav className="perfil-sidebar" aria-label="Navegação principal">
        <a className="perfil-nav-link" href="/" aria-label="Voltar para o início">
          <span aria-hidden="true">←</span>
        </a>
        <a className="perfil-nav-link" href="/#buscar-resenhas" aria-label="Buscar resenhas">
          <span aria-hidden="true">⌕</span>
        </a>
        <a className="perfil-sidebar-avatar" href="/perfil" aria-label="Meu perfil">
          {perfilAtual?.foto ? (
            <img src={perfilAtual.foto} alt="" />
          ) : (
            (perfilAtual?.username ?? 'U').charAt(0).toUpperCase()
          )}
        </a>
      </nav>

      <main className="perfil-main">
        <div className="perfil-conteudo">
          {/* Cabeçalho com avatar, dados, botão de seguir e estatísticas. */}
          <section className="perfil-resumo" aria-label="Informações do perfil">
            {usuario.foto ? (
              <img className="perfil-avatar perfil-avatar-foto" src={usuario.foto} alt={`Foto de ${usuario.username}`} />
            ) : (
              <div className="perfil-avatar" role="img" aria-label={`Avatar de ${usuario.username}`}>
                {usuario.username.charAt(0).toUpperCase()}
              </div>
            )}

            <div className="perfil-detalhes">
              <p className="pp-etiqueta">PERFIL</p>
              <h1 className="perfil-username">{usuario.username}</h1>
              <p className="perfil-bio">{usuario.bio || 'Nenhuma biografia adicionada.'}</p>
            </div>

            <div className="pp-acoes">
              <button
                className={seguindo ? 'pp-seguir pp-seguir-ativo' : 'pp-seguir'}
                type="button"
                aria-pressed={seguindo}
                onClick={alternarSeguir}
              >
                {seguindo ? 'Seguindo' : 'Seguir'}
              </button>

              <dl className="pp-estatisticas">
                <div>
                  <dt>Resenhas</dt>
                  <dd>{resenhasDoUsuario.length}</dd>
                </div>
                <div>
                  <dt>Seguidores</dt>
                  <dd>{totalSeguidores}</dd>
                </div>
                <div>
                  <dt>Nota média</dt>
                  <dd>{media}</dd>
                </div>
              </dl>
            </div>
          </section>

          {/* Resenhas do usuário, sem menu de editar/excluir. */}
          <section className="perfil-resenhas" aria-labelledby="pp-resenhas-titulo">
            <h2 id="pp-resenhas-titulo">Resenhas de {usuario.username}</h2>
            {resenhasDoUsuario.length > 0 ? (
              <div className="perfil-lista-resenhas">
                {resenhasDoUsuario.map((resenha) => (
                  <article className="perfil-resenha" key={resenha.id}>
                    <div className="perfil-resenha-topo">
                      <span className="perfil-jogo">{resenha.jogo}</span>
                      <time dateTime={resenha.criadaEm}>
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(resenha.criadaEm))}
                      </time>
                    </div>
                    {resenha.avaliacao > 0 && (
                      <div className="perfil-nota" aria-label={`Avaliação: ${resenha.avaliacao} de 5 estrelas`}>
                        <span aria-hidden="true">{'★'.repeat(resenha.avaliacao)}{'☆'.repeat(5 - resenha.avaliacao)}</span>
                        <span>{resenha.avaliacao}/5</span>
                      </div>
                    )}
                    {resenha.titulo && <h3>{resenha.titulo}</h3>}
                    <p>{resenha.texto}</p>
                  </article>
                ))}
              </div>
            ) : (
              <div className="perfil-sem-resenhas">
                <span aria-hidden="true">✎</span>
                <h3>{usuario.username} ainda não publicou resenhas</h3>
                <p>Quando houver novas resenhas, elas aparecerão aqui.</p>
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default PerfilPublico