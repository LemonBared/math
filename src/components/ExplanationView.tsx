import { Explanation } from '../lib/supabase';
import { BookOpen, Lightbulb, AlertCircle, Target, CheckCircle, TrendingUp } from 'lucide-react';

interface ExplanationViewProps {
  explanation: Explanation;
}

export function ExplanationView({ explanation }: ExplanationViewProps) {
  return (
    <div className="w-full max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-8">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          {explanation.simple_summary}
        </h1>
      </div>

      <Section
        icon={<BookOpen className="text-blue-600" size={24} />}
        title="Detailed Explanation"
        content={explanation.detailed_explanation}
      />

      {explanation.formulas && explanation.formulas.length > 0 && (
        <div className="bg-blue-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Target className="text-blue-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Key Formulas</h2>
          </div>
          <div className="space-y-4">
            {explanation.formulas.map((formula, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <code className="text-lg font-mono text-blue-700 block mb-2">
                  {formula.formula}
                </code>
                <p className="text-gray-700">{formula.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.steps && explanation.steps.length > 0 && (
        <div className="bg-green-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="text-green-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Step-by-Step Breakdown</h2>
          </div>
          <div className="space-y-4">
            {explanation.steps.map((step) => (
              <div key={step.step} className="bg-white rounded-lg p-4 shadow-sm flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-bold">
                  {step.step}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-1">{step.title}</h3>
                  <p className="text-gray-700">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.examples && explanation.examples.length > 0 && (
        <div className="bg-orange-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="text-orange-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Examples</h2>
          </div>
          <div className="space-y-6">
            {explanation.examples.map((example, idx) => (
              <div key={idx} className="bg-white rounded-lg p-5 shadow-sm">
                <h3 className="font-bold text-lg text-gray-900 mb-3">{example.title}</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-gray-600 mb-1">Problem:</p>
                    <p className="text-gray-800">{example.content}</p>
                  </div>
                  {example.solution && (
                    <div>
                      <p className="text-sm font-semibold text-gray-600 mb-1">Solution:</p>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <pre className="whitespace-pre-wrap text-gray-800 font-sans">
                          {example.solution}
                        </pre>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.common_mistakes && explanation.common_mistakes.length > 0 && (
        <div className="bg-red-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <AlertCircle className="text-red-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Common Mistakes</h2>
          </div>
          <div className="space-y-4">
            {explanation.common_mistakes.map((item, idx) => (
              <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                <p className="text-red-700 font-semibold mb-2">Mistake: {item.mistake}</p>
                <p className="text-green-700">
                  <span className="font-semibold">Correction:</span> {item.correction}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {explanation.tips_and_tricks && explanation.tips_and_tricks.length > 0 && (
        <div className="bg-yellow-50 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Lightbulb className="text-yellow-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">Tips & Tricks</h2>
          </div>
          <ul className="space-y-3">
            {explanation.tips_and_tricks.map((tip, idx) => (
              <li key={idx} className="flex gap-3 bg-white rounded-lg p-4 shadow-sm">
                <span className="text-yellow-600 font-bold">•</span>
                <span className="text-gray-800">{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {explanation.practice_ideas && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Practice Ideas</h2>
          <p className="text-gray-800 leading-relaxed">{explanation.practice_ideas}</p>
        </div>
      )}

      {explanation.summary && (
        <div className="bg-gray-100 rounded-xl p-6 border-l-4 border-blue-600">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Summary</h2>
          <p className="text-gray-800 leading-relaxed text-lg">{explanation.summary}</p>
        </div>
      )}
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode; title: string; content: string }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
      </div>
      <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{content}</p>
    </div>
  );
}
