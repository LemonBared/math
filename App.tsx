import { useState } from 'react';
import { Header } from './components/Header';
import { SearchBar } from './components/SearchBar';
import { ExplanationView } from './components/ExplanationView';
import { LoadingState } from './components/LoadingState';
import { PopularTopics } from './components/PopularTopics';
import { generateMathExplanation } from './services/mathExplainer';
import { Explanation } from './lib/supabase';
import { AlertCircle } from 'lucide-react';

function App() {
  const [explanation, setExplanation] = useState<Explanation | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setLoading(true);
    setError(null);
    setExplanation(null);

    try {
      const result = await generateMathExplanation(query);
      if (result) {
        setExplanation(result);
      } else {
        setError('Unable to generate explanation. Please try again.');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center gap-12">
          <div className="text-center space-y-4">
            <h2 className="text-5xl font-bold text-gray-900">
              Understanding Math Made Easy
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl">
              Get clear, comprehensive explanations for any math topic.
              From basic arithmetic to advanced calculus, we make every concept accessible.
            </p>
          </div>

          <SearchBar onSearch={handleSearch} loading={loading} />

          {loading && <LoadingState />}

          {error && (
            <div className="w-full max-w-4xl bg-red-50 border-2 border-red-200 rounded-xl p-6 flex items-center gap-3">
              <AlertCircle className="text-red-600" size={24} />
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {explanation && !loading && <ExplanationView explanation={explanation} />}

          {!explanation && !loading && !error && (
            <PopularTopics onTopicClick={handleSearch} />
          )}
        </div>
      </main>

      <footer className="border-t border-gray-200 mt-20 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-600">
          <p>Making mathematics accessible to learners at all levels</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
