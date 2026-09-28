import React from 'react';
import { useQuery } from 'react-query';
import { usersAPI } from '../../services/api';

export default function AnalyticsDashboard() {
  const { data, isLoading, isError } = useQuery('learning-stats', () => usersAPI.getStats().then(r => r.data.stats), { staleTime: 0 });
  return <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-6">
    <h1 className="text-3xl font-bold">Learning analytics</h1>
    <p>Statistics from your saved submissions.</p>
    {isLoading && <p>Loading statistics…</p>}
    {isError && <p role="alert">Could not load statistics. Please try again.</p>}
    {data && <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{[
        ['Problems solved', data.overview.totalProblemsSolved], ['Submissions', data.submissions.total],
        ['Accepted', data.submissions.successful], ['Success rate', `${data.submissions.successRate}%`]
      ].map(([label,value]) => <div key={label} className="border rounded p-4"><p>{label}</p><strong className="text-2xl">{value}</strong></div>)}</div>
      <h2 className="text-xl font-semibold">Languages used</h2>
      {Object.entries(data.languages).map(([language,count]) => <p key={language}>{language}: {count} submissions</p>)}
      {data.submissions.total === 0 && <p>Solve a problem to start building your history.</p>}
    </>}
  </section>;
}
