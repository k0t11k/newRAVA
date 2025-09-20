import React, { useState } from 'react';
import { Agent } from '@dfinity/agent';
import { idlFactory } from '../declarations/backend'; // Генерируется dfx

const AdminPanel = ({ user }) => {
  const [event, setEvent] = useState({
    id: '',
    title: '',
    date: '',
    time: '',
    city: '',
    category: '',
    price_range: '',
    image: '',
    url: '',
    venue: '',
    description: '',
  });

  const handleChange = (e) => {
    setEvent({ ...event, [e.target.name]: e.target.value });
  };

  const handleCreateEvent = async () => {
    if (!user) return;
    const agent = new Agent({ identity: /* from authClient */ });
    const backend = await agent.fetchRootKey().then(() => actor('backend_canister_id', idlFactory, { agent }));
    await backend.create_event(event);
    alert('Event created!');
  };

  return (
    <section className="py-12 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-[var(--neon-blue)]">Admin Panel - Create Event</h2>
      <div className="max-w-md mx-auto bg-gray-800/40 p-6 rounded-lg border border-[rgba(0,240,255,0.2)]">
        <input name="id" placeholder="ID" onChange={handleChange} className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg" />
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full p-3 mb-4 bg-gray-700 text-white rounded-lg" />
        {/* Остальные поля аналогично */}
        <button onClick={handleCreateEvent} className="button w-full">Create Event</button>
      </div>
    </section>
  );
};

export default AdminPanel;