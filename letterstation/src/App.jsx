import { useEffect, useState } from 'react'
import Cadastro from './pages/cadastro/Cadastro.jsx'
import Home from './pages/Home.jsx'
import Perfil from './pages/perfil/Perfil.jsx'
import './App.css'
import React, { useState } from 'react';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';

const chaveResenhas = 'letterstation-resenhas'
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
      foto:
        typeof perfilSalvo.foto === 'string' && perfilSalvo.foto.startsWith('data:image/')
          ? perfilSalvo.foto
          : '',
    }
  } catch (error) {
    console.error('Não foi possível carregar o perfil salvo.', error)
    return perfilInicial
  }
}

function carregarResenhas() {
  try {
    const resenhasSalvas = JSON.parse(window.localStorage.getItem(chaveResenhas) ?? '[]')

    if (!Array.isArray(resenhasSalvas)) {
      throw new TypeError('Os dados salvos de resenhas não estão no formato esperado.')
    }

    const resenhasValidas = resenhasSalvas.filter(
      (resenha) =>
        resenha &&
        typeof resenha.id === 'string' &&
        typeof resenha.jogo === 'string' &&
        typeof resenha.titulo === 'string' &&
        typeof resenha.texto === 'string' &&
        typeof resenha.autor === 'string' &&
        typeof resenha.criadaEm === 'string' &&
        !Number.isNaN(Date.parse(resenha.criadaEm)),
    )

    if (resenhasValidas.length !== resenhasSalvas.length) {
      console.error('Algumas resenhas salvas foram ignoradas por estarem incompletas ou inválidas.')
    }

    return resenhasValidas.map((resenha) => ({
      ...resenha,
      avaliacao:
        Number.isInteger(resenha.avaliacao) && resenha.avaliacao >= 1 && resenha.avaliacao <= 5
          ? resenha.avaliacao
          : 0,
    }))
  } catch (error) {
    console.error('Não foi possível carregar as resenhas salvas.', error)
    return []
  }
}

function App() {
  const [pathname, setPathname] = useState(window.location.pathname)
  const [resenhas, setResenhas] = useState(carregarResenhas)
  const [perfil, setPerfil] = useState(carregarPerfil)

  useEffect(() => {
    function handlePopState() {
      setPathname(window.location.pathname)
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useEffect(() => {
    try {
      window.localStorage.setItem(chaveResenhas, JSON.stringify(resenhas))
    } catch (error) {
      console.error('Não foi possível salvar as resenhas neste navegador.', error)
    }
  }, [resenhas])

  function criarResenha(resenha) {
    setResenhas((atuais) => [
      ...atuais,
      { ...resenha, id: `${Date.now()}-${Math.random().toString(36).slice(2)}` },
    ])
  }

  function atualizarResenha(id, atualizacao) {
    setResenhas((atuais) =>
      atuais.map((resenha) =>
        resenha.id === id ? { ...resenha, ...atualizacao, id: resenha.id } : resenha,
      ),
    )
  }

  function excluirResenha(id) {
    setResenhas((atuais) => atuais.filter((resenha) => resenha.id !== id))
  }

  function atualizarPerfil(atualizacao) {
    const perfilAtualizado = { ...perfil, ...atualizacao }

    try {
      window.localStorage.setItem(chavePerfil, JSON.stringify(perfilAtualizado))
    } catch (error) {
      console.error('Não foi possível salvar as alterações do perfil.', error)
      throw new Error('Não foi possível salvar as alterações. Tente novamente ou escolha uma foto menor.')
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

  const rota = pathname.replace(/\/+$/, '') || '/'

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
      />
    )
  }

  return <Home resenhas={resenhas} perfil={perfil} onCriarResenha={criarResenha} />
  const [telaAtiva, setTelaAtiva] = useState('login');

  return (
    <>
      {telaAtiva === 'login' ? (
        <Login onAlternarTela={setTelaAtiva} />
      ) : (
        <Cadastro onAlternarTela={setTelaAtiva} />
      )}
    </>
  );
}

export default App;
