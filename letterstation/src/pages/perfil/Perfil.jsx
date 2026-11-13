import { useState } from 'react'
import './Perfil.css'

// Formulário de edição dos dados pessoais e da foto do perfil.
function EditarPerfil({ perfil, onSalvar, onCancelar }) {
  const [username, setUsername] = useState(perfil.username)
  const [bio, setBio] = useState(perfil.bio)
  const [foto, setFoto] = useState(perfil.foto)
  const [erro, setErro] = useState('')
  // Envia as alterações para o componente pai, que cuida de persistir os dados.
  async function handleSubmit(event) {
    event.preventDefault()
    const usernameLimpo = username.trim()

    if (!usernameLimpo) {
      const campo = event.currentTarget.elements.namedItem('username')
      campo.setCustomValidity('Informe um username.')
      campo.reportValidity()
      return
    }

    try {
      await onSalvar({ username: usernameLimpo, bio: bio.trim(), foto })
    } catch (error) {
      setErro(error.message)
    }
  }

  return (
    <div className="perfil-dialog-fundo">
      <section
        className="perfil-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfil-editar-dados-titulo"
      >
        <form
          className="perfil-formulario-edicao"
          onSubmit={handleSubmit}
          onInput={(event) => {
            event.target.setCustomValidity('')
            setErro('')
          }}
        >
          {/* Título do diálogo e botão para fechá-lo sem salvar. */}
          <header className="perfil-dialog-cabecalho">
            <div>
              <h2 id="perfil-editar-dados-titulo">Editar perfil</h2>
              <p>Atualize sua foto, username e biografia.</p>
            </div>
            <button
              className="perfil-dialog-fechar"
              type="button"
              onClick={onCancelar}
              aria-label="Fechar edição do perfil"
            >
              ×
            </button>
          </header>

          {/* Prévia da foto, seletor de arquivo e opção de removê-la. */}
          <div className="perfil-foto-editor">
            {foto ? (
              <img
                className="perfil-foto-preview"
                src={foto}
                alt="Prévia da foto de perfil"
                onError={() => setErro('Não foi possível carregar essa imagem. Verifique o link.')}
              />
            ) : (
              <span className="perfil-foto-preview perfil-foto-inicial">
                {username.trim().charAt(0).toUpperCase() || 'U'}
              </span>
            )}

            <div className="perfil-foto-acoes">
              <label className="perfil-campo">
                <span>Link da foto</span>
                <input
                  type="url"
                  value={foto}
                  onChange={(event) => {
                    setFoto(event.target.value)
                    setErro('')
                  }}
                  placeholder="https://exemplo.com/imagem.jpg"
                />
              </label>

              {foto && (
                <button
                  className="perfil-foto-remover"
                  type="button"
                  onClick={() => {
                    setFoto('')
                    setErro('')
                  }}
                >
                  Remover foto
                </button>
              )}

              <span>Cole o link direto de uma imagem.</span>
            </div>
          </div>

          {/* Campos editáveis do perfil. */}
          <label className="perfil-campo">
            <span>Username</span>
            <input
              name="username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              maxLength={30}
              required
            />
          </label>

          <label className="perfil-campo">
            <span>Biografia</span>
            <textarea
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="Conte um pouco sobre você"
              rows={3}
              maxLength={160}
            />
          </label>

          {/* Caso o navegador não consiga guardar os dados, a falha é exibida no formulário. */}
          {erro && <p className="perfil-formulario-erro" role="alert">{erro}</p>}

          {/* Ações para descartar ou salvar as mudanças do perfil. */}
          <div className="perfil-dialog-acoes">
            <button className="perfil-botao-cancelar" type="button" onClick={onCancelar}>
              Cancelar
            </button>
            <button className="perfil-botao-salvar" type="submit">
              Salvar alterações
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

// Formulário de edição de uma resenha, com jogo, texto e nota.
function EditarResenha({ resenha, onSalvar, onCancelar }) {
  const [jogo, setJogo] = useState(resenha.jogo)
  const [texto, setTexto] = useState(resenha.texto)
  const [avaliacao, setAvaliacao] = useState(resenha.avaliacao)
  const [erro, setErro] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    const jogoLimpo = jogo.trim()
    const textoLimpo = texto.trim()

    if (!jogoLimpo || !textoLimpo) {
      const campoInvalido = event.currentTarget.elements.namedItem(!jogoLimpo ? 'jogo' : 'texto')
      campoInvalido.setCustomValidity('Preencha este campo com pelo menos um caractere.')
      campoInvalido.reportValidity()
      return
    }

    onSalvar({
      jogo: jogoLimpo,
      texto: textoLimpo,
      avaliacao,
    })
  }

  return (
    <div className="perfil-dialog-fundo">
      <section
        className="perfil-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="perfil-editar-titulo"
      >
        <form
          className="perfil-formulario-edicao"
          onSubmit={handleSubmit}
          onInput={(event) => event.target.setCustomValidity('')}
        >
          {/* Cabeçalho do diálogo de edição. */}
          <header className="perfil-dialog-cabecalho">
            <div>
              <h2 id="perfil-editar-titulo">Editar resenha</h2>
              <p>Atualize sua opinião sobre o jogo.</p>
            </div>
            <button
              className="perfil-dialog-fechar"
              type="button"
              onClick={onCancelar}
              aria-label="Fechar edição"
            >
              ×
            </button>
          </header>

          {/* Dados da resenha que podem ser atualizados. */}
          <label className="perfil-campo">
            <span>Jogo</span>
            <input
              type="search"
              value={jogo}
              onChange={(event) => setJogo(event.target.value)}
              placeholder="Pesquise o nome do jogo"
              maxLength={80}
              required
            />
          </label>

          <label className="perfil-campo">
            <span>Sua resenha</span>
            <textarea
              value={texto}
              onChange={(event) => setTexto(event.target.value)}
              placeholder="O que você achou da experiência?"
              rows={5}
              maxLength={2000}
              required
            />
          </label>

          {/* Nota de uma a cinco estrelas. */}
          <fieldset className="perfil-avaliacao">
            <legend>Sua nota</legend>
            <div className="perfil-estrelas" role="radiogroup" aria-label="Avaliação do jogo">
              {[1, 2, 3, 4, 5].map((nota) => (
                <label
                  className={avaliacao >= nota ? 'perfil-estrela perfil-estrela-ativa' : 'perfil-estrela'}
                  key={nota}
                  title={`${nota} ${nota === 1 ? 'estrela' : 'estrelas'}`}
                >
                  <input
                    type="radio"
                    name="avaliacao-edicao"
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
            <span className="perfil-avaliacao-ajuda" aria-live="polite">
              {avaliacao ? `${avaliacao} de 5 estrelas` : 'Selecione de 1 a 5 estrelas'}
            </span>
          </fieldset>
              {erro && (
                <p className="perfil-formulario-erro" role="alert">
                  {erro}
                </p>
              )}
          {/* Descarta a edição ou envia os novos dados ao componente pai. */}
          <div className="perfil-dialog-acoes">
            <button className="perfil-botao-cancelar" type="button" onClick={onCancelar}>
              Cancelar
            </button>
            <button type="submit" disabled={salvando}>
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}

function Perfil({ resenhas, perfil, onAtualizarPerfil, onAtualizarResenha, onExcluirResenha }) {
  // Controla qual diálogo está aberto e separa as resenhas deste usuário.
  const [resenhaEmEdicao, setResenhaEmEdicao] = useState(null)
  const [resenhaParaExcluir, setResenhaParaExcluir] = useState(null)
  const [editarPerfilAberto, setEditarPerfilAberto] = useState(false)
  const [erroExclusao, setErroExclusao] = useState('')
  const [excluindo, setExcluindo] = useState(false)
  const minhasResenhas = resenhas.filter((resenha) => resenha.autor === perfil.username)

  async function confirmarExclusao() {
    setExcluindo(true)
    setErroExclusao('')

    try {
      await onExcluirResenha(resenhaParaExcluir.id)
      setResenhaParaExcluir(null)
    } catch (error) {
      setErroExclusao(error.message)
    } finally {
      setExcluindo(false)
    }
  }

  return (
    <div className="perfil-page">
      {/* Navegação para início, busca e perfil. */}
      <nav className="perfil-sidebar" aria-label="Navegação principal">
        <a className="perfil-nav-link" href="/" aria-label="Voltar para o início">
          <span aria-hidden="true">←</span>
        </a>
        <a className="perfil-nav-link" href="/#buscar-resenhas" aria-label="Buscar resenhas">
          <span aria-hidden="true">⌕</span>
        </a>
        <a className="perfil-sidebar-avatar" href="/perfil" aria-label="Meu perfil">
          {perfil.foto ? (
            <img src={perfil.foto} alt="" />
          ) : (
            perfil.username.charAt(0).toUpperCase()
          )}
        </a>
      </nav>

      <main className="perfil-main">
        {/* Abre o formulário para editar foto, username e biografia. */}
        <button
          className="perfil-configuracoes"
          type="button"
          aria-label="Editar perfil"
          onClick={() => setEditarPerfilAberto(true)}
        >
          <span aria-hidden="true">⚙</span>
        </button>

        <div className="perfil-conteudo">
          {/* Informações do usuário e foto ou inicial usada como avatar. */}
          <section className="perfil-resumo" aria-label="Informações do perfil">
            {perfil.foto ? (
              <img className="perfil-avatar perfil-avatar-foto" src={perfil.foto} alt={`Foto de ${perfil.username}`} />
            ) : (
              <div className="perfil-avatar" role="img" aria-label={`Avatar de ${perfil.username}`}>
                {perfil.username.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="perfil-detalhes">
              <h1 className="perfil-username">{perfil.username}</h1>
              <p className="perfil-bio">{perfil.bio || 'Nenhuma biografia adicionada.'}</p>
            </div>
            <span className="perfil-seguidores">
              {perfil.total_seguidores ?? 0} seguidores
            </span>
          </section>

          {/* Lista de resenhas próprias ou orientação para criar a primeira. */}
          <section className="perfil-resenhas" aria-labelledby="perfil-resenhas-titulo">
            <h2 id="perfil-resenhas-titulo">Minhas resenhas</h2>
            {minhasResenhas.length > 0 ? (
              <div className="perfil-lista-resenhas">
                {[...minhasResenhas].reverse().map((resenha) => (
                  <article className="perfil-resenha" key={resenha.id}>
                    <div className="perfil-resenha-topo">
                      <span className="perfil-jogo">{resenha.jogo}</span>
                      <div className="perfil-resenha-acoes">
                        <time dateTime={resenha.criadaEm}>
                          {new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' }).format(new Date(resenha.criadaEm))}
                        </time>
                        {/* Menu com ações disponíveis para esta resenha. */}
                        <details className="perfil-menu-acoes">
                          <summary aria-label={`Ações para a resenha ${resenha.jogo}`}>
                            <span aria-hidden="true">⋯</span>
                          </summary>
                          <div className="perfil-menu-opcoes">
                            <button
                              type="button"
                              onClick={(event) => {
                                event.currentTarget.closest('details').open = false
                                setResenhaEmEdicao(resenha)
                              }}
                            >
                              Editar
                            </button>
                            <button
                              className="perfil-menu-excluir"
                              type="button"
                              onClick={(event) => {
                                event.currentTarget.closest('details').open = false
                                setResenhaParaExcluir(resenha)
                              }}
                            >
                              Excluir
                            </button>
                          </div>
                        </details>
                      </div>
                    </div>
                    {/* Nota registrada na resenha. */}
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
                <h3>Você ainda não publicou resenhas</h3>
                <p>Quando escrever sua primeira resenha, ela aparecerá aqui.</p>
                <a href="/">Escrever uma resenha</a>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* Diálogo de edição dos dados do perfil. */}
      {editarPerfilAberto && (
        <EditarPerfil
          key={perfil.username}
          perfil={perfil}
          onSalvar={async (atualizacao) => {
            await onAtualizarPerfil(atualizacao)
            setEditarPerfilAberto(false)
          }}
          onCancelar={() => setEditarPerfilAberto(false)}
        />
      )}

      {/* Diálogo de edição da resenha selecionada. */}
      {resenhaEmEdicao && (
        <EditarResenha
          key={resenhaEmEdicao.id}
          resenha={resenhaEmEdicao}
          onSalvar={async (atualizacao) => {
            await onAtualizarResenha(resenhaEmEdicao.id, atualizacao)
            setResenhaEmEdicao(null)
          }}
          onCancelar={() => setResenhaEmEdicao(null)}
        />
      )}

      {/* Confirmação explícita antes de excluir uma resenha permanentemente. */}
      {resenhaParaExcluir && (
        <div className="perfil-dialog-fundo">
          <section
            className="perfil-dialog perfil-dialog-confirmacao"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="perfil-excluir-titulo"
            aria-describedby="perfil-excluir-descricao"
          >
            <div className="perfil-dialog-corpo">
              <h2 id="perfil-excluir-titulo">Excluir resenha?</h2>
              <p id="perfil-excluir-descricao">
                Tem certeza que deseja excluir a resenha de <strong>{resenhaParaExcluir.jogo}</strong>?
                Essa ação não poderá ser desfeita.
              </p>
            </div>
            {erroExclusao && (
              <p className="perfil-formulario-erro" role="alert">
                {erroExclusao}
              </p>
            )}
            <div className="perfil-dialog-acoes">
              <button
                className="perfil-botao-cancelar"
                type="button"
                onClick={() => setResenhaParaExcluir(null)}
              >
                Cancelar
              </button>
              <button
                className="perfil-botao-excluir"
                type="button"
                onClick={confirmarExclusao}
                disabled={excluindo}
              >
                {excluindo ? 'Excluindo...' : 'Excluir resenha'}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Perfil