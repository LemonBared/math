import { TrendingUp } from 'lucide-react';

interface PopularTopicsProps {
  onTopicClick: (topic: string) => void;
}

const POPULAR_TOPICS = [
  { name: 'Pythagorean Theorem', category: 'Geometry', difficulty: 'beginner' },
  { name: 'Quadratic Equations', category: 'Algebra', difficulty: 'intermediate' },
  { name: 'Derivatives', category: 'Calculus', difficulty: 'advanced' },
  { name: 'Probability', category: 'Statistics', difficulty: 'intermediate' },
  { name: 'Trigonometric Identities', category: 'Trigonometry', difficulty: 'intermediate' },
  { name: 'Matrix Multiplication', category: 'Linear Algebra', difficulty: 'intermediate' },
];

const DIFFICULTY_COLORS = {
  beginner: 'bg-green-100 text-green-700',
  intermediate: 'bg-yellow-100 text-yellow-700',
  advanced: 'bg-red-100 text-red-700',
};

export function PopularTopics({ onTopicClick }: PopularTopicsProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="text-blue-600" size={24} />
        <h2 className="text-2xl font-bold text-gray-900">Popular Topics</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {POPULAR_TOPICS.map((topic) => (
          <button
            key={topic.name}
            onClick={() => onTopicClick(topic.name)}
            className="text-left p-4 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-2">
              <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                {topic.name}
              </h3>
              <span className={`text-xs px-2 py-1 rounded-full ${DIFFICULTY_COLORS[topic.difficulty as keyof typeof DIFFICULTY_COLORS]}`}>
                {topic.difficulty}
              </span>
            </div>
            <p className="text-sm text-gray-600">{topic.category}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
