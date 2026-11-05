import React, { useState } from 'react';
import './Login.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui você adiciona a lógica de autenticação futuramente
    console.log('Dados enviados:', { email, password });
    alert(`Tentando logar com: ${email}`);
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Entrar no LetterStation</h2>
        
        <form onSubmit={handleSubmit}>
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
              placeholder="Digite sua senha" 
              required 
            />
          </div>

          <button type="submit" className="login-btn">Acessar</button>
        </form>

        <p className="login-footer">
          Não tem uma conta? <a href="#cadastro">Cadastre-se</a>
        </p>
      </div>
    </div>
  );
}
