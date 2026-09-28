import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';

export default function ProfilePage() {
  const { user, updateProfile } = useAuth();
  const [firstName, setFirstName] = useState(user?.profile?.firstName || '');
  const [lastName, setLastName] = useState(user?.profile?.lastName || '');
  const [bio, setBio] = useState(user?.profile?.bio || '');
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);
  async function save(e) {
    e.preventDefault(); setSaving(true);
    const result = await updateProfile({ firstName, lastName, bio });
    setMessage(result.success ? 'Profile saved.' : result.error); setSaving(false);
  }
  return <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <h1 className="text-3xl font-bold">Profile</h1><p>{user?.username} · {user?.email}</p>
    <form onSubmit={save} className="space-y-4 max-w-lg">
      <label className="block">First name<input className="block w-full border rounded p-2 dark:bg-gray-700" value={firstName} onChange={e => setFirstName(e.target.value)} maxLength={50}/></label>
      <label className="block">Last name<input className="block w-full border rounded p-2 dark:bg-gray-700" value={lastName} onChange={e => setLastName(e.target.value)} maxLength={50}/></label>
      <label className="block">Bio<textarea className="block w-full border rounded p-2 dark:bg-gray-700" value={bio} onChange={e => setBio(e.target.value)} maxLength={500}/></label>
      <button disabled={saving} className="bg-blue-600 text-white rounded px-4 py-2">{saving ? 'Saving…' : 'Save profile'}</button>
      <p role="status">{message}</p>
    </form>
  </section>;
}
