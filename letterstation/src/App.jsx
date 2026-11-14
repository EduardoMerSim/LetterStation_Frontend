import { useEffect, useState } from 'react'
import Cadastro from './pages/cadastro/Cadastro.jsx'
import Home from './pages/Home.jsx'
import Perfil from './pages/perfil/Perfil.jsx'
import './App.css'
import React from 'react';
import Login from './pages/login/Login';
import PerfilPublico from './pages/perfil/PerfilPublico.jsx'

import { apiFetch } from './services/api'

const chavePerfil = 'letterstation-perfil'
const perfilInicial = { username: 'username', bio: 'Sua bio aparece aqui.', foto: '' }

function carregarPerfil() {
  try {
    const perfilSalvo = JSON.parse(window.localStorage.getItem(chavePerfil) ?? 'null')

    if (!perfilSalvo || typeof perfilSalvo !== 'object' || Array.isArray(perfilSalvo)) {
      return perfilInicial
    }

    return {
      username:
        typeof perfilSalvo.username === 'string' && perfilSalvo.username.trim()
          ? perfilSalvo.username.trim()
          : perfilInicial.username,
      bio: typeof perfilSalvo.bio === 'string' ? perfilSalvo.bio : perfilInicial.bio,
      foto: typeof perfilSalvo.foto === 'string' ? perfilSalvo.foto : '',
    }
  } catch (error) {
    console.error('Não foi possível carregar o perfil salvo.', error)
    return perfilInicial
  }
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [resenhas, setResenhas] = useState([])
  const [perfil, setPerfil] = useState(carregarPerfil)
  const [telaAtiva, setTelaAtiva] = useState('login')
  const [perfilPublico, setPerfilPublico] = useState(null)
  const [carregandoPerfilPublico, setCarregandoPerfilPublico] = useState(false)
  const [erroPerfilPublico, setErroPerfilPublico] = useState('')
  const [seguindoPerfilPublico, setSeguindoPerfilPublico] = useState(false)
  
  const rota = pathname.replace(/\/+$/, '') || '/'
  const matchPerfilPublico = rota.match(/^\/usuario\/(\d+)$/)
  const idPerfilPublico = matchPerfilPublico ? Number(matchPerfilPublico[1]) : null

 useEffect(() => {
  const token = sessionStorage.getItem('letterstation-token')

  if (!token && rota !== '/login' && rota !== '/cadastro') {
    navegar('/login')
  }

  if (token && rota === '/login') {
    navegar('/')
  }
}, [rota])

useEffect(() => {
  async function carregarPerfilAPI() {
    try {
      const resposta = await apiFetch('/usuarios/me');

      if (resposta.status === 401 || resposta.status === 403) {
        sairDaConta()
        return
      }

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar o perfil.')
      }

      const dados = await resposta.json();

      setPerfil({
        username: dados.username,
        bio: dados.biografia || '',
        foto: dados.avatar_url || '',
        email: dados.email,
        id_usuario: dados.id_usuario,
        total_reviews: dados.total_reviews,
        total_seguidores: dados.total_seguidores,
        total_seguindo: dados.total_seguindo,
        data_cadastro: dados.data_cadastro,
      });

    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    }
  }

  if (sessionStorage.getItem('letterstation-token')) {
    carregarPerfilAPI();
  }
}, [pathname]);

useEffect(() => {
  async function carregarPerfilPublicoAPI() {
    setCarregandoPerfilPublico(true)
    setErroPerfilPublico('')
    setPerfilPublico(null)

    try {
      const resposta = await apiFetch(`/usuarios/${idPerfilPublico}`)

      if (!resposta.ok) {
        if (resposta.status === 404) {
          throw new Error('Usuário não encontrado.')
        }
        throw new Error('Não foi possível carregar o perfil.')
      }

      const dados = await resposta.json()

      setPerfilPublico({
        id_usuario: dados.id_usuario,
        username: dados.username,
        foto: dados.avatar_url || '',
        bio: dados.biografia || '',
        seguidores: dados.total_seguidores,
        total_seguindo: dados.total_seguindo,
        total_reviews: dados.total_reviews,
        data_cadastro: dados.data_cadastro,
      })
    } catch (erro) {
      setErroPerfilPublico(erro.message)
    } finally {
      setCarregandoPerfilPublico(false)
    }
  }

  if (idPerfilPublico !== null) {
    carregarPerfilPublicoAPI()
  }
}, [idPerfilPublico])

useEffect(() => {
  async function verificarSeSegue() {
    if (
      idPerfilPublico === null ||
      !perfil.id_usuario ||
      idPerfilPublico === perfil.id_usuario
    ) {
      setSeguindoPerfilPublico(false)
      return
    }

    try {
      const resposta = await apiFetch(
        `/usuarios/${perfil.id_usuario}/seguindo?limit=100&offset=0`
      )

      if (!resposta.ok) {
        throw new Error('Não foi possível verificar o relacionamento.')
      }

      const usuariosSeguidos = await resposta.json()

      setSeguindoPerfilPublico(
        usuariosSeguidos.some(
          (usuario) => usuario.id_usuario === idPerfilPublico
        )
      )
    } catch (erro) {
      console.error('Erro ao verificar se segue o usuário:', erro)
    }
  }

  verificarSeSegue()
}, [idPerfilPublico, perfil.id_usuario])

useEffect(() => {
  async function carregarResenhasAPI() {
    try {
      const resposta = await apiFetch('/feed')

      if (resposta.status === 401 || resposta.status === 403) {
        sairDaConta()
        return
      }

      if (!resposta.ok) {
        throw new Error('Não foi possível carregar as resenhas.')
      }

      const dados = await resposta.json()

      const resenhasFormatadas = dados.map((resenha) => ({
        id: resenha.id_avaliacao,
        id_jogo: resenha.id_jogo,
        id_usuario: resenha.id_usuario,
        jogo: resenha.jogo_nome,
        capa_url: resenha.capa_url,
        titulo: `Review de ${resenha.username} - ${resenha.jogo_nome}`,
        texto: resenha.texto,
        avaliacao: resenha.nota,
        autor: resenha.username,
        criadaEm: resenha.data_criacao,
      }))

      setResenhas(resenhasFormatadas)
    } catch (error) {
      console.error('Erro ao carregar resenhas:', error)
    }
  }

  if (sessionStorage.getItem('letterstation-token')) {
    carregarResenhasAPI()
  }
}, [pathname])

  function navegar(rota) {
    window.history.pushState({}, '', rota)
    setPathname(rota)
  }

  function sairDaConta() {
    window.sessionStorage.removeItem('letterstation-token')
    setPerfil(perfilInicial)
    setTelaAtiva('login')
    navegar('/login')
  }

  async function criarResenha(resenha) {
    const resposta = await apiFetch(`/jogos/${resenha.id_jogo}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nota: resenha.avaliacao,
        texto: resenha.texto,
      }),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(dados.detail || 'Não foi possível publicar a resenha.')
    }

    const novaResenha = {
      id: dados.id_avaliacao,
      id_jogo: dados.id_jogo,
      jogo: dados.jogo_nome || resenha.jogo,
      titulo: resenha.titulo,
      capa_url: resenha.capa_url,
      texto: dados.texto,
      avaliacao: dados.nota,
      autor: dados.username || resenha.autor,
      criadaEm: dados.data_criacao,
    }

    setResenhas((atuais) => [...atuais, novaResenha])
  }

  async function atualizarResenha(id, atualizacao) {
    const resposta = await apiFetch(`/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nota: atualizacao.avaliacao,
        texto: atualizacao.texto,
      }),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(dados.detail || 'Não foi possível atualizar a resenha.')
    }

    setResenhas((atuais) =>
      atuais.map((resenha) =>
        resenha.id === id
          ? {
              ...resenha,
              texto: dados.texto,
              avaliacao: dados.nota,
              criadaEm: dados.data_criacao,
            }
          : resenha,
      ),
    )
  }

  async function excluirResenha(id) {
    const resposta = await apiFetch(`/reviews/${id}`, {
      method: 'DELETE',
    })

    if (!resposta.ok) {
      let dados = {}

      try {
        dados = await resposta.json()
      } catch (error) {
        // A resposta pode não conter JSON.
      }

      throw new Error(dados.detail || 'Não foi possível excluir a resenha.')
    }

    setResenhas((atuais) => atuais.filter((resenha) => resenha.id !== id))
  }

  async function excluirMeuPerfil() {
    const resposta = await apiFetch('/usuarios/me', {
      method: 'DELETE',
    })

    if (!resposta.ok) {
      let dados = {}

      try {
        dados = await resposta.json()
      } catch (error) {
        // A resposta pode não conter JSON.
      }

      throw new Error(dados.detail || 'Não foi possível excluir o perfil.')
    }

    setResenhas([])
    window.localStorage.removeItem(chavePerfil)
    sairDaConta()
  }

  async function alternarSeguirUsuario(idUsuario, seguir) {
    const resposta = await apiFetch(
      `/usuarios/${idUsuario}/seguir`,
      {
        method: seguir ? 'POST' : 'DELETE',
      }
    )

    if (!resposta.ok) {
      const dados = await resposta.json()
      throw new Error(dados.detail || 'Não foi possível atualizar o relacionamento.')
    }

    setSeguindoPerfilPublico(seguir)

    setPerfilPublico((atual) => ({
      ...atual,
      seguidores: atual.seguidores + (seguir ? 1 : -1),
    }))

    setPerfil((atual) => ({
      ...atual,
      total_seguindo: (atual.total_seguindo ?? 0) + (seguir ? 1 : -1),
    }))
  }

  async function atualizarPerfil(atualizacao) {
    const resposta = await apiFetch('/usuarios/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: atualizacao.username,
        biografia: atualizacao.bio,
        avatar_url: atualizacao.foto,
      }),
    })

    const dados = await resposta.json()

    if (!resposta.ok) {
      throw new Error(dados.detail || 'Não foi possível atualizar o perfil.')
    }

    const perfilAtualizado = {
      ...perfil,
      username: dados.username,
      bio: dados.biografia || '',
      foto: dados.avatar_url || '',
      email: dados.email,
      id_usuario: dados.id_usuario,
      total_reviews: dados.total_reviews,
      total_seguidores: dados.total_seguidores,
      total_seguindo: dados.total_seguindo,
      data_cadastro: dados.data_cadastro,
    }

    if (perfilAtualizado.username !== perfil.username) {
      setResenhas((atuais) =>
        atuais.map((resenha) =>
          resenha.autor === perfil.username
            ? { ...resenha, autor: perfilAtualizado.username }
            : resenha,
        ),
      )
    }

    setPerfil(perfilAtualizado)
  }

  if (idPerfilPublico !== null) {
    if (carregandoPerfilPublico) {
      return <p>Carregando perfil...</p>
    }

    if (erroPerfilPublico || !perfilPublico) {
      return <p>{erroPerfilPublico || 'Usuário não encontrado.'}</p>
    }

    return (
      <PerfilPublico
        usuario={perfilPublico}
        perfilAtual={perfil}
        resenhas={resenhas}
        seguindoInicial={seguindoPerfilPublico}
        onAlternarSeguir={alternarSeguirUsuario}
      />
    )
  }

  if (rota === '/cadastro') {
    return <Cadastro />
  }

  if (rota === '/perfil') {
    return (
      <Perfil
        resenhas={resenhas}
        perfil={perfil}
        onAtualizarResenha={atualizarResenha}
        onExcluirResenha={excluirResenha}
        onAtualizarPerfil={atualizarPerfil}
        onExcluirPerfil={excluirMeuPerfil}
      />
    )
  }
  if (rota === '/login'){
    return (
    <>
      {telaAtiva === 'login' ? (
        <Login onAlternarTela={setTelaAtiva} onEntrar={
          (token) => {
            window.sessionStorage.setItem('letterstation-token', token)
            navegar('/')
          }} />
      ) : (
        <Cadastro onAlternarTela={setTelaAtiva} />
      )}
    </>
  );
  }
  return (
    <Home
      resenhas={resenhas}
      perfil={perfil}
      onCriarResenha={criarResenha}
      onSair={sairDaConta}
    /> 
  )
}

export default App;