import { BookOpen } from 'lucide-react';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 p-2 rounded-xl">
            <BookOpen className="text-white" size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">MathExplained</h1>
            <p className="text-sm text-gray-600">Making math simple, visual, and logical</p>
          </div>
        </div>
      </div>
    </header>
  );
}
