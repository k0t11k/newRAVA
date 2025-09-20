import React from 'react';
import { PlugController } from '@psychedelic/plug-connect';

const Login = ({ setUser, authClient }) => {
  const handleLogin = async () => {
    await authClient.login({
      identityProvider: 'https://identity.ic0.app/#authorize',
      onSuccess: () => {
        const identity = authClient.getIdentity();
        setUser({ principal: identity.getPrincipal().toString() });
      }
    });
  };

  const handlePlugLogin = async () => {
    const connected = await PlugController.connect();
    if (connected) {
      // Получить principal от Plug
      const principal = await PlugController.getPrincipal();
      setUser({ principal: principal.toString() });
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-800/40 p-6 rounded-lg">
      <button onClick={handleLogin} className="button w-full mb-4">Login with Internet Identity</button>
      <button onClick={handlePlugLogin} className="button w-full flex items-center justify-center gap-2">
        Sign in with Plug Wallet
      </button>
    </div>
  );
};

export default Login;