import React, { useState } from 'react';
import Login from './pages/login/Login';
import Cadastro from './pages/login/Cadastro';

function App() {
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
