import React, { useState } from 'react';
import './Login.css';

export default function Cadastro({ onAlternarTela }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
// Validação de senha teste
  const regras = {
    temMaiuscula: /[A-Z]/.test(password),
    temEspecial: /[^A-Za-z0-9]/.test(password),
    tamanhoMinimo: password.length >= 6,
  };

  const senhaValida = regras.temMaiuscula && regras.temEspecial && regras.tamanhoMinimo;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!senhaValida) {
      alert('Sua senha não atende a todos os requisitos de segurança!');
      return;
    }

    console.log('Cadastro realizado:', { nome, email, password });
    alert(`Conta criada com sucesso para: ${nome}`);
    onAlternarTela('login');
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Criar Conta LetterStation</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="nome">Nome Completo</label>
            <input 
              type="text" 
              id="nome" 
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo" 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <input 
              type="email" 
              id="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail" 
              required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <input 
              type="password" 
              id="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Crie uma senha forte" 
              required 
            />
          </div>

          {/* Lista de Validação Dinâmica */}
          <div className="password-checklist">
            <div className={`checklist-item ${regras.tamanhoMinimo ? 'valid' : ''}`}>
              {regras.tamanhoMinimo ? '✓' : 'X'} Mínimo de 6 caracteres
            </div>
            <div className={`checklist-item ${regras.temMaiuscula ? 'valid' : ''}`}>
              {regras.temMaiuscula ? '✓' : 'X'} Pelo menos 1 letra maiúscula
            </div>
            <div className={`checklist-item ${regras.temEspecial ? 'valid' : ''}`}>
              {regras.temEspecial ? '✓' : 'X'} Pelo menos 1 caractere especial
            </div>
          </div>

          <button 
            type="submit" 
            className="login-btn" 
            disabled={!senhaValida} 
            style={{ opacity: senhaValida ? 1 : 0.6, cursor: senhaValida ? 'pointer' : 'not-allowed' }}
          >
            Cadastrar
          </button>
        </form>

        <p className="login-footer">
          Já tem uma conta?{' '}
          <a href="#login" onClick={(e) => { e.preventDefault(); onAlternarTela('login'); }}>
            Faça login
          </a>
        </p>
      </div>
    </div>
  );
}
