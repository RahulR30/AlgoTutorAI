import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { problemsAPI } from '../services/api';

export default function HomePage() {
  const { data, isLoading, isError } = useQuery('catalog-summary', () => problemsAPI.getTopics().then(r => r.data));
  return <div className="space-y-8">
    <section className="bg-white dark:bg-gray-800 rounded-lg p-8 space-y-5">
      <h1 className="text-4xl font-bold">Build your algorithm skills through practice</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300">Choose a problem, write JavaScript or Python, and check your solution against real test cases. Save submissions and track your progress.</p>
      <div className="flex gap-4"><Link to="/problems" className="bg-blue-600 text-white px-5 py-3 rounded">Browse problems</Link><Link to="/register" className="border px-5 py-3 rounded">Create account</Link></div>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-lg p-8 space-y-4">
      <h2 className="text-2xl font-semibold">Available topics</h2>
      {isLoading && <p>Loading the catalog…</p>}
      {isError && <p role="alert">The practice API is unavailable. Start the backend to load the catalog.</p>}
      {data?.topics.length === 0 && <p>The catalog is empty. Start the seeded local demo to try three example problems.</p>}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">{data?.topics.map(t => <Link key={t.name} to={`/topics/${encodeURIComponent(t.name)}`} className="border rounded p-4 hover:border-blue-500">
        <strong className="capitalize">{t.name.replace(/-/g, ' ')}</strong><p>{t.total} problems</p>
      </Link>)}</div>
    </section>
    <p className="text-gray-500">AI-generated problems and adaptive recommendations are experimental and are not enabled in this version.</p>
  </div>;
}
