import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Editor } from '@monaco-editor/react';
import {
  ArrowLeft,
  Code,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Users,
  TrendingUp,
  BookOpen,
  Lightbulb,
  Settings,
  Star
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { problemsAPI, authAPI } from '../../services/api';

const ProblemDetailPage = () => {
  const { id } = useParams();
  const { token, updateUser } = useAuth();
  const [problem, setProblem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);

  useEffect(() => {
    fetchProblem();
  }, [id]);

  useEffect(() => {
    if (problem) {
      setCode(problem.starterCode?.[selectedLanguage] || getStarterCode(selectedLanguage));
    }
  }, [problem, selectedLanguage]);

  const fetchProblem = async () => {
    try {
      console.log('🔍 Fetching problem with ID:', id);
      const response = await problemsAPI.getById(id);
      const data = response.data;
      console.log('✅ Problem data received:', data);
      setProblem(data.problem);

      // Set initial code based on selected language
      if (data.problem.starterCode) {
        setCode(data.problem.starterCode[selectedLanguage] || '');
      }
    } catch (error) {
      console.error('❌ Error fetching problem:', error);
      console.error('   Error details:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const getStarterCode = (language) => {
    const templates = {
      javascript: `function solution(input) {
  // Write your solution here
  // Example: return input * 2;
}

`,
      python: `def solution(input):
    # Write your solution here
    # Example: return input * 2
    pass

`,
      java: `public class Solution {
    public static int solution(int input) {
        // Write your solution here
        // Example: return input * 2;
        return 0;
    }

    public static void main(String[] args) {
        System.out.println(solution(5));
    }
}`,
      cpp: `#include <iostream>
using namespace std;

int solution(int input) {
    // Write your solution here
    // Example: return input * 2;
    return 0;
}

int main() {
    cout << solution(5) << endl;
    return 0;
}`
    };
    return templates[language] || templates.javascript;
  };

  const isSolutionCorrect = (submission) => {
    if (!submission?.overallResult) return false;
    return submission.overallResult.passedTestCases === submission.overallResult.totalTestCases;
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    if (problem?.starterCode?.[language]) {
      setCode(problem.starterCode[language]);
    } else {
      setCode(getStarterCode(language));
    }
  };

  const getMonacoLanguage = (language) => {
    const languageMap = {
      javascript: 'javascript',
      python: 'python',
      java: 'java',
      cpp: 'cpp'
    };
    return languageMap[language] || 'javascript';
  };

  const handleSubmit = async () => {
    if (!token) {
      setSubmissionResult({ error: 'Please login to submit solutions' });
      return;
    }

    setIsSubmitting(true);
    try {
      console.log('📝 Submitting solution for problem:', id);
      const response = await problemsAPI.submitSolution(id, {
        language: selectedLanguage,
        code: code
      });

      const result = response.data;
      const profile = await authAPI.getProfile();
      updateUser(profile.data.user);
      console.log('✅ Submission result:', result);
      console.log('📊 Result structure:', {
        hasSubmission: !!result.submission,
        hasOverallResult: !!result.submission?.overallResult,
        hasExecutionResults: !!result.submission?.executionResults,
        submissionKeys: result.submission ? Object.keys(result.submission) : [],
        overallResultKeys: result.submission?.overallResult ? Object.keys(result.submission.overallResult) : [],
        executionResultsLength: result.submission?.executionResults?.length || 0
      });

      // Ensure we have the expected structure
      if (!result.submission || !result.submission.overallResult) {
        console.warn('⚠️ Submission result missing expected structure:', result);
        // Try to create a proper structure from available data
        const structuredResult = {
          submission: {
            overallResult: result.submission?.overallResult || {
              isCorrect: false,
              totalTestCases: 1,
              passedTestCases: 0,
              executionTime: 0,
              score: 0
            },
            executionResults: result.submission?.executionResults || []
          },
          message: result.message || 'Solution submitted',
          ...result
        };
        console.log('🔧 Structured result:', structuredResult);
        setSubmissionResult(structuredResult);
      } else {
        setSubmissionResult(result);
      }
    } catch (error) {
      console.error('❌ Error submitting solution:', error);
      console.error('   Error details:', error.response?.data || error.message);

      if (error.response?.status === 401) {
        setSubmissionResult({ error: 'Authentication failed. Please login again.' });
      } else {
        setSubmissionResult({ error: 'Failed to submit solution' });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-400';
      case 'medium': return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-400';
      case 'hard': return 'text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-400';
      default: return 'text-gray-600 bg-gray-100 dark:bg-gray-700 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="text-center py-12">
        <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          Problem not found
        </h3>
        <Link to="/problems" className="text-blue-600 hover:text-blue-700">
          Back to Problems
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              to="/problems"
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {problem.title}
              </h1>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(problem.difficulty)}`}>
                  {problem.difficulty}
                </span>
                <span className="text-gray-600 dark:text-gray-400 capitalize">
                  {problem.topics && problem.topics[0] ? problem.topics[0].replace('-', ' ') : 'General'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <Users className="w-4 h-4" />
              <span>{problem.statistics?.totalSubmissions || 0}</span>
            </div>
            <div className="flex items-center space-x-1">
              <TrendingUp className="w-4 h-4" />
              <span>{problem.statistics?.successRate || 0}%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Problem Description */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Problem Description</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed">
              {problem.description}
            </p>

            {problem.examples && problem.examples.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Examples:</h3>
                {problem.examples.map((example, index) => (
                  <div key={index} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Input:</p>
                        <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          {example.input}
                        </code>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Output:</p>
                        <code className="text-sm bg-gray-200 dark:bg-gray-600 px-2 py-1 rounded">
                          {example.output}
                        </code>
                      </div>
                    </div>
                    {example.explanation && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Explanation:</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{example.explanation}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {problem.constraints && problem.constraints.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">Constraints:</h3>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                  {problem.constraints.map((constraint, index) => (
                    <li key={index}>• {constraint}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Code Editor */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Code Editor</h2>
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>


              </select>
            </div>

            <div className="bg-gray-900 rounded-lg mb-4" style={{ height: '400px' }}>
              <Editor
                height="100%"
                defaultLanguage={getMonacoLanguage(selectedLanguage)}
                language={getMonacoLanguage(selectedLanguage)}
                value={code}
                onChange={(value) => setCode(value || '')}
                theme="vs-dark"
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  lineNumbers: 'on',
                  roundedSelection: false,
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                  folding: true,
                  autoIndent: 'full',
                  formatOnPaste: true,
                  formatOnType: true,
                  suggestOnTriggerCharacters: true,
                  quickSuggestions: true,
                  // Add more editor options for better experience
                  tabSize: 2,
                  insertSpaces: true,
                  detectIndentation: true,
                  trimAutoWhitespace: true,
                  largeFileOptimizations: false,
                  // Enable IntelliSense features
                  suggest: {
                    showKeywords: true,
                    showSnippets: true,
                    showClasses: true,
                    showFunctions: true,
                    showVariables: true,
                    showConstants: true,
                    showEnums: true,
                    showInterfaces: true,
                    showModules: true,
                    showProperties: true,
                    showEvents: true,
                    showOperators: true,
                    showUnits: true,
                    showValues: true,
                    showColors: true,
                    showFiles: true,
                    showReferences: true,
                    showFolders: true,
                    showTypeParameters: true,
                    showWords: true,
                    showUsers: true,
                    showIssues: true,
                  }
                }}
                placeholder="Write your solution here..."
                loading={
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <span className="ml-2">Loading editor...</span>
                  </div>
                }
                onMount={(editor, monaco) => {
                  console.log('✅ Monaco Editor mounted successfully');
                  console.log('📝 Editor instance:', editor);
                  console.log('🎨 Monaco instance:', monaco);

                  // Configure editor after mount
                  editor.focus();

                  // Add some debugging
                  window.monacoEditor = editor;
                  window.monaco = monaco;
                }}
                onError={(error) => {
                  console.error('❌ Monaco Editor error:', error);
                }}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 flex items-center justify-center px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Running...
                  </>
                  ) : (
                  <>
                    <Code className="w-4 h-4 mr-2" />
                    Submit Solution
                  </>
                )}
              </button>

            </div>
          </div>

          {/* Submission Result */}
          {submissionResult && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                {submissionResult.isPreview ? 'Code Test Result' : 'Submission Result'}
              </h3>

              {submissionResult.error ? (
                <div className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                  <XCircle className="w-5 h-5" />
                  <span>{submissionResult.error}</span>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Preview Result */}
                  {submissionResult.isPreview ? (
                    <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6">
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center">
                            <Play className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                          </div>
                        </div>
                        <div>
                          <h4 className="text-lg font-medium text-blue-800 dark:text-blue-200">
                            {submissionResult.message}
                            {submissionResult.isMock && (
                              <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                                Mock Execution
                              </span>
                            )}
                          </h4>
                          {submissionResult.details && (
                            <p className="text-blue-700 dark:text-blue-300">
                              {submissionResult.details}
                            </p>
                          )}
                          {submissionResult.result !== undefined && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Result: </span>
                              <code className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-800 dark:text-blue-200">
                                {String(submissionResult.result)}
                              </code>
                            </div>
                          )}
                          {submissionResult.stdout && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Output: </span>
                              <pre className="bg-blue-100 dark:bg-blue-800 px-2 py-1 rounded text-blue-800 dark:text-blue-200 text-xs mt-1 overflow-x-auto">
                                {submissionResult.stdout}
                              </pre>
                            </div>
                          )}
                          {submissionResult.traceback && (
                            <div className="mt-2">
                              <span className="text-sm font-medium text-red-700 dark:text-red-300">Traceback: </span>
                              <pre className="bg-red-100 dark:bg-red-800 px-2 py-1 rounded text-red-800 dark:text-red-200 text-xs mt-1 overflow-x-auto">
                                {submissionResult.traceback}
                              </pre>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Actual Submission Result */
                    submissionResult.submission?.overallResult ? (
                      <div className={`flex items-center space-x-3 p-6 rounded-lg ${
                        isSolutionCorrect(submissionResult.submission)
                          ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800'
                      }`}>
                        {isSolutionCorrect(submissionResult.submission) ? (
                          <>
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center">
                                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-green-800 dark:text-green-200">🎉 Solution Correct!</h3>
                              <p className="text-green-700 dark:text-green-300">Congratulations! All test cases passed successfully.</p>
                              <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                You've solved this problem correctly!
                              </p>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="flex-shrink-0">
                              <div className="w-12 h-12 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center">
                                <XCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <h3 className="text-xl font-bold text-red-800 dark:text-red-200">❌ Solution Incorrect</h3>
                              <p className="text-red-700 dark:text-red-300">
                                {submissionResult.submission.overallResult.passedTestCases} out of {submissionResult.submission.overallResult.totalTestCases} test cases passed.
                              </p>
                              <p className="text-sm text-red-600 dark:text-red-400 mt-1">
                                Keep trying! Review the failed test cases below.
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Solution submitted successfully!</span>
                      </div>
                    )
                  )}

                  {/* Detailed Results */}
                  {submissionResult.submission?.overallResult && (
                    <div className="space-y-4">
                      {/* Test Case Summary */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 flex items-center">
                            <Code className="w-4 h-4 mr-1" />
                            Test Cases
                          </div>
                          <div className="font-semibold text-lg">
                            {submissionResult.submission.overallResult.passedTestCases}/{submissionResult.submission.overallResult.totalTestCases}
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            Success Rate
                          </div>
                          <div className="font-semibold text-lg">
                            {Math.round((submissionResult.submission.overallResult.passedTestCases / submissionResult.submission.overallResult.totalTestCases) * 100)}%
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            Execution Time
                          </div>
                          <div className="font-semibold text-lg">
                            {submissionResult.submission.overallResult.executionTime || 0}ms
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                          <div className="text-gray-600 dark:text-gray-400 flex items-center">
                            <Star className="w-4 h-4 mr-1" />
                            Score
                          </div>
                          <div className="font-semibold text-lg">
                            {submissionResult.submission.overallResult.score || 0}%
                          </div>
                        </div>
                      </div>

                      {/* Individual Test Case Results */}
                      {submissionResult.submission.executionResults && submissionResult.submission.executionResults.length > 0 && (
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                            <BookOpen className="w-5 h-5 mr-2" />
                            Test Case Details
                          </h4>
                          <div className="space-y-3">
                            {submissionResult.submission.executionResults.map((result, index) => (
                              <div key={index} className={`p-4 rounded-lg border-2 ${
                                result.isCorrect
                                  ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                                  : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              }`}>
                                <div className="flex items-center justify-between mb-2">
                                  <span className="font-semibold text-gray-900 dark:text-white flex items-center">
                                    <Code className="w-4 h-4 mr-2" />
                                    Test Case {index + 1}
                                  </span>
                                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    result.isCorrect
                                      ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                                      : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200'
                                  }`}>
                                    {result.isCorrect ? '✅ PASSED' : '❌ FAILED'}
                                  </span>
                                </div>
                                {!result.isCorrect && (
                                  <div className="mt-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                      <div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Expected Output:</span>
                                        <div className="mt-1 p-2 bg-white dark:bg-gray-600 rounded border font-mono text-xs">
                                          {result.expectedOutput}
                                        </div>
                                      </div>
                                      <div>
                                        <span className="font-semibold text-gray-700 dark:text-gray-300">Your Output:</span>
                                        <div className="mt-1 p-2 bg-white dark:bg-gray-600 rounded border font-mono text-xs">
                                          {result.actualOutput || result.errorMessage || 'No output generated'}
                                        </div>
                                      </div>
                                      {result.errorMessage && (
                                        <div className="col-span-2">
                                          <span className="font-semibold text-red-700 dark:text-red-300">Error:</span>
                                          <div className="mt-1 p-2 bg-red-50 dark:bg-red-900/20 rounded border font-mono text-xs text-red-800 dark:text-red-200">
                                            {result.errorMessage}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProblemDetailPage;
