import { useEffect, useState } from 'react'
import './Home.css'
import { apiFetch } from '../services/api'

// Cartão de uma resenha, usado tanto no feed quanto nos resultados da pesquisa.
function CartaoResenha({ resenha }) {
  console.log('Dados da review:', resenha)
  return (
    <article className="home-resenha">
      <div className="home-resenha-conteudo">
        <div className="home-resenha-topo">
          <span className="home-jogo">{resenha.jogo}</span>

          <time dateTime={resenha.criadaEm}>
            {new Intl.DateTimeFormat('pt-BR', {
              dateStyle: 'medium',
            }).format(new Date(resenha.criadaEm))}
          </time>
        </div>

        <h3 className="home-resenha-titulo">
          {resenha.titulo || `Review de ${resenha.autor} - ${resenha.jogo}`}
        </h3>

        {resenha.avaliacao > 0 && (
          <div className="home-resenha-nota"
            aria-label={`Avaliação: ${resenha.avaliacao} de 5 estrelas`}>
            <span aria-hidden="true">
              {'★'.repeat(resenha.avaliacao)}
              {'☆'.repeat(5 - resenha.avaliacao)}
            </span>
            <span>{resenha.avaliacao}/5</span>
          </div>
        )}

        <p className="home-resenha-texto">{resenha.texto}</p>

        <a className="home-autor" href={`/usuario/${resenha.id_usuario}`}>
          <span className="home-avatar home-avatar-pequeno" aria-hidden="true">
            {resenha.autor.charAt(0).toUpperCase()}
          </span>
          <span>{resenha.autor}</span>
        </a>
      </div>

      {resenha.capa_url && (
        <img
          className="home-resenha-capa"
          src={resenha.capa_url}
          alt={`Capa de ${resenha.jogo}`}
        />
      )}
    </article>
  )
}

function Home({ resenhas, perfil, onCriarResenha, onSair }) {
  // Estado da tela: abertura do formulário, busca no feed e nota selecionada.
  const [composerAberto, setComposerAberto] = useState(false)
  const [busca, setBusca] = useState('')
  const [avaliacao, setAvaliacao] = useState(0)

  // Estado da pesquisa global: pop-up, texto digitado e tela de resultados.
  const [pesquisaAberta, setPesquisaAberta] = useState(false)
  const [rascunhoPesquisa, setRascunhoPesquisa] = useState('')
  const [termoPesquisa, setTermoPesquisa] = useState('')
  const [mostrandoResultados, setMostrandoResultados] = useState(false)
  const [jogosPesquisa, setJogosPesquisa] = useState([])
  const [usuariosPesquisa, setUsuariosPesquisa] = useState([])
  const [carregandoPesquisa, setCarregandoPesquisa] = useState(false)
  const [erroPesquisa, setErroPesquisa] = useState('')

  // Estado da tela de resenhas de um jogo específico.
  const [jogoAberto, setJogoAberto] = useState(null)
  const [resenhasDoJogo, setResenhasDoJogo] = useState([])
  const [carregandoResenhasJogo, setCarregandoResenhasJogo] = useState(false)
  const [erroResenhasJogo, setErroResenhasJogo] = useState('')

  //busca e exibição do feed
  const [buscaJogo, setBuscaJogo] = useState('')
  const [jogosEncontrados, setJogosEncontrados] = useState([])
  const [jogoSelecionado, setJogoSelecionado] = useState(null)
  const [carregandoJogos, setCarregandoJogos] = useState(false)
  const [erroBuscaJogo, setErroBuscaJogo] = useState('')
  const [erroPublicacao, setErroPublicacao] = useState('')
  const [publicando, setPublicando] = useState(false)

  // Fecha o pop-up de pesquisa com a tecla Esc.
  useEffect(() => {
    if (!pesquisaAberta) return
    function handleKeyDown(event) {
      if (event.key === 'Escape') setPesquisaAberta(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [pesquisaAberta])

  function abrirPesquisa() {
    setRascunhoPesquisa(termoPesquisa)
    setPesquisaAberta(true)
  }

  // Envia a pesquisa do pop-up e abre a tela de resultados.
  async function handlePesquisar(event) {
    event.preventDefault()

    const termo = rascunhoPesquisa.trim()
    if (!termo) return

    setTermoPesquisa(termo)
    setMostrandoResultados(true)
    setPesquisaAberta(false)

    setCarregandoPesquisa(true)
    setErroPesquisa('')
    setJogosPesquisa([])
    setUsuariosPesquisa([])

    try {
      const [respostaJogos, respostaUsuarios] = await Promise.all([
        apiFetch(`/jogos?busca=${encodeURIComponent(termo)}`),
        apiFetch(`/usuarios?busca=${encodeURIComponent(termo)}`),
      ])

      if (!respostaJogos.ok || !respostaUsuarios.ok) {
        throw new Error('Não foi possível carregar os resultados da pesquisa.')
      }

      const [jogos, usuarios] = await Promise.all([
        respostaJogos.json(),
        respostaUsuarios.json(),
      ])

      setJogosPesquisa(jogos)
      setUsuariosPesquisa(usuarios)
    } catch (erro) {
      setErroPesquisa(erro.message)
    } finally {
      setCarregandoPesquisa(false)
    }
  }

  function voltarParaInicio() {
    setMostrandoResultados(false)
    setTermoPesquisa('')
    setRascunhoPesquisa('')
  }
  async function abrirJogo(jogo) {
    setJogoAberto(jogo)
    setResenhasDoJogo([])
    setErroResenhasJogo('')
    setCarregandoResenhasJogo(true)

    try {
      const resposta = await apiFetch(
        `/jogos/${jogo.id_jogo}/reviews`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as resenhas deste jogo.')
      }

      const dados = await resposta.json()
      setResenhasDoJogo(dados)
    } catch (erro) {
      setErroResenhasJogo(erro.message)
    } finally {
      setCarregandoResenhasJogo(false)
    }
  }
  async function pesquisarJogos(termo) {
    if (!termo.trim()) {
      setJogosEncontrados([])
      setErroBuscaJogo('')
      return
    }

    try {
      setCarregandoJogos(true)
      setErroBuscaJogo('')
      setJogoSelecionado(null)

      const resposta = await apiFetch(
        `/jogos?busca=${encodeURIComponent(termo)}`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível pesquisar os jogos.')
      }

      const dados = await resposta.json()

      setJogosEncontrados(dados)

      if (dados.length === 0) {
        setErroBuscaJogo('Jogo não encontrado no catálogo.')
      }
    } catch (erro) {
      setErroBuscaJogo(erro.message)
    } finally {
      setCarregandoJogos(false)
    }
  }
  // Valida e envia a resenha para o componente principal, que cuida de salvá-la.
  async function handleSubmit(event) {
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

    if (!jogoSelecionado) {
      setErroBuscaJogo('Selecione um jogo da lista antes de publicar.')
      return
    }
   setErroPublicacao('')
  setPublicando(true)

  try {
    await onCriarResenha({
      id_jogo: jogoSelecionado.id_jogo,
      jogo: jogoSelecionado.nome,
      titulo: `Review de ${perfil.username} - ${jogoSelecionado.nome}`,
      capa_url: jogoSelecionado.capa_url,
      texto: valores[1],
      avaliacao,
      autor: perfil.username,
      criadaEm: new Date().toISOString(),
    })

    form.reset()
    setAvaliacao(0)
    setJogoSelecionado(null)
    setBuscaJogo('')
    setComposerAberto(false)
  } catch (erro) {
    setErroPublicacao(erro.message)
  } finally {
    setPublicando(false)
  }
  }

  // Filtra as resenhas por jogo, texto e autor, mantendo as mais novas primeiro.
  function filtrarResenhas(termo) {
    const termoNormalizado = termo.trim().toLocaleLowerCase('pt-BR')
    return [...resenhas]
      .filter((resenha) =>
        [resenha.jogo, resenha.titulo, resenha.texto, resenha.autor]
          .join(' ')
          .toLocaleLowerCase('pt-BR')
          .includes(termoNormalizado),
      )
  }

  const resenhasFiltradas = filtrarResenhas(busca)
  const resultadosPesquisa = filtrarResenhas(termoPesquisa)

  return (
    <div className="home-page">
      {/* Navegação lateral e acesso ao perfil do usuário atual. */}
      <nav className="home-sidebar" aria-label="Navegação principal">
        <a className="home-marca" href="/" aria-label="LetterStation - início">
          L
        </a>
        <button
          className={
            pesquisaAberta || mostrandoResultados
              ? 'home-nav-link home-nav-link-ativo'
              : 'home-nav-link'
          }
          type="button"
          aria-label="Pesquisar"
          aria-haspopup="dialog"
          onClick={abrirPesquisa}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <circle cx="10.8" cy="10.8" r="6.8" />
            <path d="m16 16 5 5" />
          </svg>
        </button>
        <button className="home-sair" type="button" onClick={onSair}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M10 17l5-5-5-5" />
            <path d="M15 12H3" />
            <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
          </svg>
          <span>Sair</span>
        </button>
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
          {jogoAberto ? (
            <section className="home-resultados" aria-labelledby="home-jogo-titulo">
              <button
                className="home-voltar"
                type="button"
                onClick={() => setJogoAberto(null)}
              >
                ← Voltar aos resultados
              </button>
              <div className="home-jogo-detalhe">
                <header className="home-header">
                  <p className="home-eyebrow">JOGO</p>
                  <h1 className="home-titulo" id="home-jogo-titulo">
                    {jogoAberto.nome}
                  </h1>
                  <p className="home-subtitulo">
                    {resenhasDoJogo.length} resenhas da comunidade
                  </p>
                </header>

                {jogoAberto.capa_url && (
                  <img
                    src={jogoAberto.capa_url}
                    alt={`Capa de ${jogoAberto.nome}`}
                  />
                )}
              </div>

              {carregandoResenhasJogo && (
                <div className="home-estado-vazio">
                  <p>Carregando resenhas...</p>
                </div>
              )}

              {erroResenhasJogo && (
                <div className="home-estado-vazio">
                  <h3>Não foi possível carregar as resenhas</h3>
                  <p>{erroResenhasJogo}</p>
                </div>
              )}

              {!carregandoResenhasJogo &&
                !erroResenhasJogo &&
                (resenhasDoJogo.length > 0 ? (
                  <div className="home-lista-resenhas">
                    {resenhasDoJogo.map((resenha) => (
                      <CartaoResenha
                        key={resenha.id_avaliacao}
                        resenha={{
                          ...resenha,
                          id: resenha.id_avaliacao,
                          jogo: resenha.jogo_nome,
                          criadaEm: resenha.data_criacao,
                          titulo: `Review de ${resenha.username} - ${resenha.jogo_nome}`,
                          avaliacao: Math.round(resenha.nota),
                          autor: resenha.username,
                        }}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="home-estado-vazio">
                    <h3>Ainda não há resenhas para este jogo</h3>
                    <p>Que tal ser a primeira pessoa a compartilhar sua opinião?</p>
                  </div>
                ))}
            </section>
          ) : mostrandoResultados ? (
            /* Tela de resultados da pesquisa. */
            <section className="home-resultados" aria-labelledby="home-resultados-titulo">
              <button className="home-voltar" type="button" onClick={voltarParaInicio}>
                ← Voltar
              </button>
              <header className="home-header">
                <p className="home-eyebrow">PESQUISA</p>
                <h1 className="home-titulo" id="home-resultados-titulo">
                  Resultados para “{termoPesquisa}”
                </h1>
                <p className="home-subtitulo">
                  {carregandoPesquisa
                    ? 'Buscando resultados...'
                    : `${jogosPesquisa.length} jogos · ${usuariosPesquisa.length} usuários · ${resultadosPesquisa.length} resenhas`}
                </p>
              </header>
              {carregandoPesquisa && (
                <div className="home-estado-vazio">
                  <p>Buscando jogos, usuários e resenhas...</p>
                </div>
              )}

              {erroPesquisa && (
                <div className="home-estado-vazio">
                  <h3>Não foi possível realizar a pesquisa</h3>
                  <p>{erroPesquisa}</p>
                </div>
              )}
              {!carregandoPesquisa && !erroPesquisa && jogosPesquisa.length > 0 && (
                <section className="home-secao-resultados">
                  <h2>Jogos</h2>

                  <div className="home-lista-jogos">
                    {jogosPesquisa.map((jogo) => (
                      <button
                        className="home-card-jogo"
                        type="button"
                        key={jogo.id_jogo}
                        onClick={() => abrirJogo(jogo)}
                      >
                        {jogo.capa_url && (
                          <img src={jogo.capa_url} alt={`Capa de ${jogo.nome}`} />
                        )}

                        <div>
                          <h3>{jogo.nome}</h3>
                          <p>
                            {jogo.nota_media != null
                              ? `Nota média: ${jogo.nota_media.toFixed(1)}`
                              : 'Ainda sem avaliações'}
                          </p>
                          <span>{jogo.total_reviews} resenhas</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </section>
              )}
              {!carregandoPesquisa && !erroPesquisa && usuariosPesquisa.length > 0 && (
                <section className="home-secao-resultados">
                  <h2>Usuários</h2>

                  <div className="home-lista-usuarios">
                    {usuariosPesquisa.map((usuario) => (
                        <button
                          className="home-card-usuario"
                          type="button"
                          key={usuario.id_usuario}
                          onClick={() => {
                            window.location.href = `/usuario/${usuario.id_usuario}`
                          }}
                        >
                        {usuario.avatar_url ? (
                          <img
                            src={usuario.avatar_url}
                            alt={`Foto de ${usuario.username}`}
                          />
                        ) : (
                          <div className="home-avatar-fallback">
                            {usuario.username.charAt(0).toUpperCase()}
                          </div>
                        )}

                        <h3>{usuario.username}</h3>
                      </button>
                    ))}
                  </div>
                </section>
              )}
             {!carregandoPesquisa && !erroPesquisa && resultadosPesquisa.length > 0 && (
                <section className="home-secao-resultados">
                  <h2>Resenhas</h2>

                  <div className="home-lista-resenhas">
                    {resultadosPesquisa.map((resenha) => (
                      <CartaoResenha resenha={resenha} key={resenha.id} />
                    ))}
                  </div>
                </section>
              )}

              {!carregandoPesquisa &&
                !erroPesquisa &&
                jogosPesquisa.length === 0 &&
                usuariosPesquisa.length === 0 &&
                resultadosPesquisa.length === 0 && (
                  <div className="home-estado-vazio">
                    <span className="home-estado-icone" aria-hidden="true">⌕</span>
                    <h3>Nenhum resultado encontrado</h3>
                    <p>Tente pesquisar por outro jogo, autor ou palavra.</p>
                    <button className="home-link-criar" type="button" onClick={abrirPesquisa}>
                      Nova pesquisa
                    </button>
                  </div>
                )}
            </section>
          ) : (
            <>
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
                          value={buscaJogo}
                          onChange={(e) => {
                            setBuscaJogo(e.target.value)
                            setJogoSelecionado(null)
                            setJogosEncontrados([])
                            setErroBuscaJogo('')
                          }}
                          required
                          maxLength={80}
                          aria-describedby="home-jogo-ajuda"
                        />
                      </span>
                      <button
                        type="button"
                        onClick={() => pesquisarJogos(buscaJogo)}
                        disabled={carregandoJogos || !buscaJogo.trim()}
                      >
                        {carregandoJogos ? 'Pesquisando...' : 'Buscar'}
                      </button>
                      {erroBuscaJogo && (
                        <p className="erro-busca-jogo">{erroBuscaJogo}</p>
                      )}

                      {carregandoJogos && <p>Pesquisando jogos...</p>}

                      {jogosEncontrados.length > 0 && (
                        <div className="resultados-jogos">
                          {jogosEncontrados.map((jogo) => (
                            <button
                              type="button"
                              key={jogo.id_jogo}
                              onClick={() => {
                                console.log(jogo)
                                setJogoSelecionado(jogo)
                                setBuscaJogo(jogo.nome)
                                setJogosEncontrados([])
                                setErroBuscaJogo('')
                              }}
                            >
                              {jogo.capa_url && (
                                <img src={jogo.capa_url} alt="" />
                              )}
                              <span>{jogo.nome}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      {jogoSelecionado && (
                        <p>Jogo selecionado: {jogoSelecionado.nome}</p>
                      )}
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
                      <button
                        className="home-botao-publicar"
                        type="submit"
                        disabled={publicando}
                      >
                        {publicando ? 'Publicando...' : 'Publicar'}
                      </button>
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
                  <div className="home-lista-resenhas">
                    {resenhasFiltradas.map((resenha) => (
                      <CartaoResenha resenha={resenha} key={resenha.id} />
                    ))}
                  </div>
                ) : (
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
            </>
          )}
        </div>
      </main>

      {/* Pop-up de pesquisa aberto pela lupa da lateral. */}
      {pesquisaAberta && (
        <div
          className="home-modal-fundo"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setPesquisaAberta(false)
          }}
        >
          <form
            className="home-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-modal-titulo"
            onSubmit={handlePesquisar}
          >
            <h2 className="home-modal-titulo" id="home-modal-titulo">Pesquisar</h2>
            <label className="home-modal-campo">
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <circle cx="10.8" cy="10.8" r="6.8" />
                <path d="m16 16 5 5" />
              </svg>
              <input
                type="search"
                autoFocus
                value={rascunhoPesquisa}
                onChange={(event) => setRascunhoPesquisa(event.target.value)}
                placeholder="Jogo, autor ou palavra da resenha"
                aria-label="Pesquisar resenhas"
                maxLength={80}
              />
            </label>
            <div className="home-formulario-acoes">
              <button
                className="home-botao-secundario"
                type="button"
                onClick={() => setPesquisaAberta(false)}
              >
                Cancelar
              </button>
              <button
                className="home-botao-publicar"
                type="submit"
                disabled={!rascunhoPesquisa.trim()}
              >
                Pesquisar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default Home