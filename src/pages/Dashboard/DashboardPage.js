import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { useAuth } from '../../contexts/AuthContext';
import { usersAPI } from '../../services/api';

export default function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isError } = useQuery('recent-submissions', () => usersAPI.getSubmissions({limit: 5}).then(r => r.data), { staleTime: 0 });
  return <div className="space-y-6">
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
      <h1 className="text-3xl font-bold">Welcome, {user?.profile?.firstName || user?.username}!</h1>
      <p>{user?.learningStats?.totalProblemsSolved || 0} distinct problems solved · {user?.learningStats?.totalSubmissions || 0} submissions</p>
      <div className="flex gap-4"><Link className="text-blue-600" to="/problems">Browse problems</Link><Link className="text-blue-600" to="/topics">Explore topics</Link><Link className="text-blue-600" to="/analytics">View analytics</Link></div>
    </section>
    <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold">Recent submissions</h2>
      {isLoading && <p>Loading activity…</p>}
      {isError && <p role="alert">Could not load activity. Please try again.</p>}
      {data?.submissions.length === 0 && <p>No submissions yet. Pick a problem to get started.</p>}
      {data?.submissions.map(s => <div className="border-b py-3" key={s._id}>
        <Link className="text-blue-600" to={`/problems/${s.problemId?._id}`}>{s.problemId?.title || 'Problem'}</Link>
        <p>{s.overallResult.isCorrect ? 'Accepted' : 'Not accepted'} · {s.language} · {new Date(s.createdAt).toLocaleString()}</p>
      </div>)}
    </section>
  </div>;
}
