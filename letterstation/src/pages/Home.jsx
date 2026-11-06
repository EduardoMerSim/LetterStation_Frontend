import { useState } from 'react'
import './Home.css'

function Home({ resenhas, perfil, onCriarResenha }) {
  // Estado da tela: abertura do formulário, busca no feed e nota selecionada.
  const [composerAberto, setComposerAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [avaliacao, setAvaliacao] = useState(0)

  // Valida e envia a resenha para o componente principal, que cuida de salvá-la.
  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const formData = new FormData(form)
    const valores = ['jogo', 'texto'].map((campo) =>
      String(formData.get(campo) ?? '').trim(),
    )
    const campoVazio = ['jogo', 'texto'].findIndex((_, index) => !valores[index])

    if (campoVazio !== -1) {
      const campo = form.elements.namedItem(['jogo', 'texto'][campoVazio])
      campo.setCustomValidity('Preencha este campo com pelo menos um caractere.')
      campo.reportValidity()
      return
    }

    if (!avaliacao) {
      form.querySelector('input[name="avaliacao"]').reportValidity()
      return
    }

    onCriarResenha({
      jogo: valores[0],
      titulo: '',
      texto: valores[1],
      avaliacao,
      autor: perfil.username,
      criadaEm: new Date().toISOString(),
    })

    form.reset()
    setAvaliacao(0)
    setComposerAberto(false)
  }

  // Filtra as resenhas por jogo, texto e nome do autor, mantendo as mais novas primeiro.
  const termoBusca = busca.trim().toLocaleLowerCase('pt-BR')
  const resenhasFiltradas = [...resenhas]
    .reverse()
    .filter((resenha) =>
      [resenha.jogo, resenha.titulo, resenha.texto, resenha.autor]
        .join(' ')
        .toLocaleLowerCase('pt-BR')
        .includes(termoBusca),
    )

  return (
    <div className="home-page">
      {/* Navegação lateral e acesso ao perfil do usuário atual. */}
      <nav className="home-sidebar" aria-label="Navegação principal">
        <a className="home-marca" href="/" aria-label="LetterStation - início">
          L
        </a>
        <a className="home-nav-link home-nav-link-ativo" href="#buscar-resenhas" aria-label="Buscar resenhas">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
        </a>
        <a className="home-sidebar-avatar" href="/perfil" aria-label="Abrir meu perfil">
          {perfil.foto ? (
            <img src={perfil.foto} alt="" />
          ) : (
            perfil.username.charAt(0).toUpperCase()
          )}
        </a>
      </nav>

      <main className="home-main">
        <div className="home-conteudo">
          {/* Apresentação da página inicial. */}
          <header className="home-header">
            <p className="home-eyebrow">LETTERSTATION</p>
            <h1 className="home-titulo">Reviews da comunidade</h1>
            <p className="home-subtitulo">Descubra o que outros jogadores estão jogando e compartilhando.</p>
          </header>

          {/* Área para começar uma resenha; o botão abre o formulário logo abaixo. */}
          <section className="home-composer" aria-label="Criar resenha">
            {!composerAberto ? (
              <button
                className="home-composer-abrir"
                type="button"
                onClick={() => setComposerAberto(true)}
              >
                <span className="home-avatar" aria-hidden="true">
                  {perfil.foto ? (
                    <img src={perfil.foto} alt="" />
                  ) : (
                    perfil.username.charAt(0).toUpperCase()
                  )}
                </span>
                <span>Escreva sua resenha</span>
                <span className="home-composer-mais" aria-hidden="true">+</span>
              </button>
            ) : (
              <form
                className="home-formulario"
                onSubmit={handleSubmit}
                onInput={(event) => event.target.setCustomValidity('')}
                onReset={() => setAvaliacao(0)}
              >
                {/* Busca do jogo e texto da resenha. */}
                <h2 className="home-formulario-titulo">Nova resenha</h2>
                <label className="home-campo">
                  <span className="home-campo-label">Jogo</span>
                  <span className="home-jogo-busca">
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <circle cx="10.8" cy="10.8" r="6.8" />
                      <path d="m16 16 5 5" />
                    </svg>
                    <input
                      name="jogo"
                      type="search"
                      placeholder="Pesquise o nome do jogo"
                      required
                      maxLength={80}
                      aria-describedby="home-jogo-ajuda"
                    />
                  </span>
                  <span className="home-campo-ajuda" id="home-jogo-ajuda">
                    Busque um jogo para associar à sua resenha.
                  </span>
                </label>
                <label className="home-campo">
                  <span className="home-campo-label">Sua resenha</span>
                  <textarea
                    name="texto"
                    placeholder="O que você achou da experiência?"
                    required
                    rows={5}
                    maxLength={2000}
                  />
                </label>

                {/* Nota obrigatória de uma a cinco estrelas. */}
                <fieldset className="home-avaliacao">
                  <legend>Sua nota</legend>
                  <div className="home-estrelas" role="radiogroup" aria-label="Avaliação do jogo">
                    {[1, 2, 3, 4, 5].map((nota) => (
                      <label
                        className={avaliacao >= nota ? 'home-estrela home-estrela-ativa' : 'home-estrela'}
                        key={nota}
                        title={`${nota} ${nota === 1 ? 'estrela' : 'estrelas'}`}
                      >
                        <input
                          type="radio"
                          name="avaliacao"
                          value={nota}
                          checked={avaliacao === nota}
                          onChange={() => setAvaliacao(nota)}
                          required
                          aria-label={`${nota} ${nota === 1 ? 'estrela' : 'estrelas'}`}
                        />
                        <span aria-hidden="true">★</span>
                      </label>
                    ))}
                  </div>
                  <span className="home-avaliacao-ajuda" aria-live="polite">
                    {avaliacao ? `${avaliacao} de 5 estrelas` : 'Selecione de 1 a 5 estrelas'}
                  </span>
                </fieldset>

                {/* Ações para descartar ou publicar o formulário. */}
                <div className="home-formulario-acoes">
                  <button
                    className="home-botao-secundario"
                    type="button"
                    onClick={() => {
                      setAvaliacao(0)
                      setComposerAberto(false)
                    }}
                  >
                    Cancelar
                  </button>
                  <button className="home-botao-publicar" type="submit">Publicar</button>
                </div>
              </form>
            )}
          </section>

          {/* Feed público: inclui busca, lista de resenhas e estado vazio. */}
          <section className="home-feed" aria-labelledby="home-feed-titulo">
            <div className="home-feed-cabecalho">
              <div>
                <h2 id="home-feed-titulo">Últimas resenhas</h2>
                <p>Opiniões de quem joga.</p>
              </div>
              <label className="home-busca">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <circle cx="10.8" cy="10.8" r="6.8" />
                  <path d="m16 16 5 5" />
                </svg>
                <input
                  id="buscar-resenhas"
                  type="search"
                  value={busca}
                  onChange={(event) => setBusca(event.target.value)}
                  placeholder="Buscar resenhas"
                  aria-label="Buscar resenhas"
                />
              </label>
            </div>

            {resenhasFiltradas.length > 0 ? (
              // Cada cartão mostra o jogo, a nota, o texto e o autor da resenha.
              <div className="home-lista-resenhas">
                {resenhasFiltradas.map((resenha) => (
                  <article className="home-resenha" key={resenha.id}>
                    <div className="home-resenha-topo">
                      <span className="home-jogo">{resenha.jogo}</span>
                      <time dateTime={resenha.criadaEm}>
                        {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(resenha.criadaEm))}
                      </time>
                    </div>
                    {resenha.avaliacao > 0 && (
                      <div className="home-resenha-nota" aria-label={`Avaliação: ${resenha.avaliacao} de 5 estrelas`}>
                        <span aria-hidden="true">{'★'.repeat(resenha.avaliacao)}{'☆'.repeat(5 - resenha.avaliacao)}</span>
                        <span>{resenha.avaliacao}/5</span>
                      </div>
                    )}
                    {resenha.titulo && <h3>{resenha.titulo}</h3>}
                    <p className="home-resenha-texto">{resenha.texto}</p>
                    <a className="home-autor" href="/perfil">
                      <span className="home-avatar home-avatar-pequeno" aria-hidden="true">
                        {resenha.autor.charAt(0).toUpperCase()}
                      </span>
                      <span>{resenha.autor}</span>
                    </a>
                  </article>
                ))}
              </div>
            ) : (
              // Mensagem diferente quando não há resenhas ou quando a busca não encontra resultados.
              <div className="home-estado-vazio">
                <span className="home-estado-icone" aria-hidden="true">✎</span>
                <h3>{busca ? 'Nenhuma resenha encontrada' : 'A comunidade começa com você'}</h3>
                <p>
                  {busca
                    ? 'Tente buscar por outro jogo ou palavra.'
                    : 'Ainda não há resenhas por aqui. Compartilhe a primeira com a comunidade.'}
                </p>
                {!busca && (
                  <button
                    className="home-link-criar"
                    type="button"
                    onClick={() => setComposerAberto(true)}
                  >
                    Escrever uma resenha
                  </button>
                )}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}

export default Home
