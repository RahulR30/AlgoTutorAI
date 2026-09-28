import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from 'react-query';
import { problemsAPI } from '../../services/api';

export default function TopicDetailPage() {
  const { topicName } = useParams();
  const { data, isLoading, isError } = useQuery(['topic', topicName], () => problemsAPI.getByTopic(topicName).then(r => r.data));
  return <section className="bg-white dark:bg-gray-800 rounded-lg p-6 space-y-4">
    <Link to="/topics" className="text-blue-600">← All topics</Link>
    <h1 className="text-3xl font-bold capitalize">{topicName.replace(/-/g, ' ')}</h1>
    {isLoading && <p>Loading problems…</p>}
    {isError && <p role="alert">Could not load this topic. Check the API connection and try again.</p>}
    {data?.problems.length === 0 && <p>No problems in this topic yet.</p>}
    {data?.problems.map(p => <Link key={p._id} to={`/problems/${p._id}`} className="block border rounded p-4 hover:border-blue-500">
      <strong>{p.title}</strong><span className="ml-4 text-gray-500">{p.difficulty}</span>
    </Link>)}
  </section>;
}
