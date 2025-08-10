import React, { useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';

const Notificacao = ({ mensagem, tipo, duracao = 3000 }) => {
  const [mostrar, setMostrar] = useState(false);

  useEffect(() => {
    if (mensagem) {
      setMostrar(true);
      const timer = setTimeout(() => {
        setMostrar(false);
      }, duracao);
      return () => clearTimeout(timer);
    }
  }, [mensagem, duracao]);

  const obterEstilos = () => {
    switch (tipo) {
      case 'sucesso':
        return 'bg-green-500 text-white';
      case 'erro':
        return 'bg-red-500 text-white';
      case 'info':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <Transition
      show={mostrar}
      as={React.Fragment}
      enter="transition ease-out duration-300"
      enterFrom="opacity-0 translate-y-full sm:translate-y-0 sm:translate-x-full"
      enterTo="opacity-100 translate-y-0 sm:translate-x-0"
      leave="transition ease-in duration-200"
      leaveFrom="opacity-100 translate-y-0 sm:translate-x-0"
      leaveTo="opacity-0 translate-y-full sm:translate-y-0 sm:translate-x-full"
    >
      <div
        className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg ${obterEstilos()} z-50`}
        role="alert"
      >
        <p className="font-bold">{tipo === 'sucesso' ? 'Sucesso!' : tipo === 'erro' ? 'Erro!' : 'Informação!'}</p>
        <p>{mensagem}</p>
      </div>
    </Transition>
  );
};

export default Notificacao;