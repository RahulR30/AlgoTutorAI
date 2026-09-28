import React from 'react';
import { useQuery } from 'react-query';
import { usersAPI } from '../../services/api';

export default function LeaderboardPage() {
  const { data, isLoading, isError } = useQuery('leaderboard', () => usersAPI.getLeaderboard().then(r => r.data), { staleTime: 0 });
  return <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <h1 className="text-3xl font-bold">Leaderboard</h1>
    <p>Ranked by distinct problems solved.</p>
    {isLoading && <p>Loading rankings…</p>}
    {isError && <p role="alert">Could not load rankings. Please try again.</p>}
    {data?.leaderboard.length === 0 && <p>No learners yet. Register and solve the first problem.</p>}
    <ol>{data?.leaderboard.map(u => <li key={u.username} className="flex justify-between border-b py-4">
      <span>{u.rank}. {u.username}</span><span>{u.stats.problemsSolved} solved</span>
    </li>)}</ol>
  </section>;
}
