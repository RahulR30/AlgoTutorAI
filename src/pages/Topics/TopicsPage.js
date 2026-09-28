import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { problemsAPI } from '../../services/api';

export default function TopicsPage() {
  const { data, isLoading, isError } = useQuery('topics', () => problemsAPI.getTopics().then(r => r.data));
  return <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <h1 className="text-3xl font-bold">Learning topics</h1>
    <p>Explore the available catalog. A problem can belong to more than one topic.</p>
    {isLoading && <p>Loading topics…</p>}
    {isError && <p role="alert">Could not load topics. Please check the API connection.</p>}
    {data?.topics.length === 0 && <p>No topics yet. Start the seeded demo to explore examples.</p>}
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{data?.topics.map(t => {
      const counts = (Array.isArray(t.counts) ? t.counts[0] : t.counts) || {};
      return <Link className="border rounded p-4 hover:border-blue-500" key={t.name} to={`/topics/${encodeURIComponent(t.name)}`}>
      <h2 className="text-xl font-semibold capitalize">{t.name.replace(/-/g, ' ')}</h2>
      <p>{t.total} problems</p><p>Easy: {counts.easy || 0} · Medium: {counts.medium || 0} · Hard: {counts.hard || 0}</p>
    </Link>; })}</div>
  </section>;
}
