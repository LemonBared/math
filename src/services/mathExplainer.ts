import { supabase, type Topic, type Explanation } from '../lib/supabase';

const SYSTEM_PROMPT = `You are an advanced AI mathematics tutor designed to explain any math topic in detail but in a way that is easy to understand for learners at all levels.
Your purpose is to make math simple, visual, and logical while maintaining accuracy and depth.

Use plain, friendly, and encouraging language. Avoid unnecessary jargon unless it's part of the concept, and always define terms clearly.
Explain why things work, not just how. Use analogies, real-world examples, and intuitive reasoning to make abstract ideas relatable.

You must respond with a valid JSON object with the following structure:
{
  "title": "string",
  "category": "string (Arithmetic|Algebra|Geometry|Trigonometry|Calculus|Statistics|Linear Algebra|Discrete Math|Advanced Topics)",
  "difficulty": "string (beginner|intermediate|advanced)",
  "simple_summary": "string (1-2 sentences)",
  "detailed_explanation": "string (comprehensive explanation)",
  "formulas": [{"formula": "string", "description": "string"}],
  "steps": [{"step": number, "title": "string", "description": "string"}],
  "examples": [{"title": "string", "content": "string", "solution": "string"}],
  "common_mistakes": [{"mistake": "string", "correction": "string"}],
  "tips_and_tricks": ["string"],
  "practice_ideas": "string",
  "summary": "string"
}

Make the explanation comprehensive, engaging, and suitable for the difficulty level.`;

export async function generateMathExplanation(topic: string): Promise<Explanation | null> {
  try {
    const existingTopic = await supabase
      .from('topics')
      .select('id, explanations(*)')
      .ilike('title', topic)
      .maybeSingle();

    if (existingTopic.data?.explanations && existingTopic.data.explanations.length > 0) {
      await supabase
        .from('topics')
        .update({ search_count: (existingTopic.data as any).search_count + 1 })
        .eq('id', existingTopic.data.id);

      return existingTopic.data.explanations[0] as Explanation;
    }

    const mockExplanation = generateMockExplanation(topic);

    const { data: newTopic, error: topicError } = await supabase
      .from('topics')
      .insert({
        title: mockExplanation.title,
        category: mockExplanation.category,
        difficulty: mockExplanation.difficulty,
        search_count: 1,
      })
      .select()
      .single();

    if (topicError || !newTopic) {
      console.error('Error creating topic:', topicError);
      return null;
    }

    const { data: explanation, error: explError } = await supabase
      .from('explanations')
      .insert({
        topic_id: newTopic.id,
        simple_summary: mockExplanation.simple_summary,
        detailed_explanation: mockExplanation.detailed_explanation,
        formulas: mockExplanation.formulas,
        steps: mockExplanation.steps,
        examples: mockExplanation.examples,
        common_mistakes: mockExplanation.common_mistakes,
        tips_and_tricks: mockExplanation.tips_and_tricks,
        practice_ideas: mockExplanation.practice_ideas,
        summary: mockExplanation.summary,
      })
      .select()
      .single();

    if (explError) {
      console.error('Error creating explanation:', explError);
      return null;
    }

    return explanation as Explanation;
  } catch (error) {
    console.error('Error generating explanation:', error);
    return null;
  }
}

function generateMockExplanation(topic: string) {
  const topicLower = topic.toLowerCase();

  if (topicLower.includes('pythagorean')) {
    return {
      title: 'The Pythagorean Theorem',
      category: 'Geometry',
      difficulty: 'beginner',
      simple_summary: 'The Pythagorean Theorem shows how the sides of a right triangle relate: the square of the hypotenuse equals the sum of the squares of the other two sides.',
      detailed_explanation: `The Pythagorean Theorem is one of the most famous mathematical relationships in geometry. It applies exclusively to right triangles (triangles with one 90-degree angle).

The theorem states that in a right triangle, if we label the two shorter sides as 'a' and 'b', and the longest side (opposite the right angle, called the hypotenuse) as 'c', then a² + b² = c².

This relationship arises from the geometric properties of squares constructed on each side of the triangle. If you draw squares on each of the three sides, the area of the square on the hypotenuse equals the combined areas of the squares on the other two sides.

The theorem has countless applications in mathematics, physics, engineering, and everyday problem-solving. It forms the foundation for distance calculations, trigonometry, and even plays a role in Einstein's theory of relativity.`,
      formulas: [
        { formula: 'a² + b² = c²', description: 'Where a and b are the legs, and c is the hypotenuse' },
        { formula: 'c = √(a² + b²)', description: 'To find the hypotenuse' },
        { formula: 'a = √(c² - b²)', description: 'To find a leg when you know the hypotenuse and other leg' }
      ],
      steps: [
        { step: 1, title: 'Identify the right triangle', description: 'Make sure your triangle has a 90-degree angle. The Pythagorean Theorem only works for right triangles.' },
        { step: 2, title: 'Label the sides', description: 'Label the two shorter sides as a and b (the legs), and the longest side as c (the hypotenuse). The hypotenuse is always opposite the right angle.' },
        { step: 3, title: 'Square the legs', description: 'Calculate a² and b² by multiplying each side by itself.' },
        { step: 4, title: 'Add the squares', description: 'Add the two squared values: a² + b²' },
        { step: 5, title: 'Take the square root', description: 'To find c, take the square root of the sum: c = √(a² + b²)' }
      ],
      examples: [
        {
          title: 'Simple Example: 3-4-5 Triangle',
          content: 'If a = 3 and b = 4, find c.',
          solution: `Step 1: Square the legs
a² = 3² = 9
b² = 4² = 16

Step 2: Add them together
a² + b² = 9 + 16 = 25

Step 3: Take the square root
c = √25 = 5

Answer: The hypotenuse is 5 units long.`
        },
        {
          title: 'Real-World Example: Ladder Against a Wall',
          content: 'A 13-foot ladder leans against a wall. The base of the ladder is 5 feet from the wall. How high up the wall does the ladder reach?',
          solution: `This is a right triangle where:
- The ladder is the hypotenuse (c = 13 feet)
- The distance from the wall is one leg (a = 5 feet)
- The height on the wall is the other leg (b = ?)

Using the formula: a² + b² = c²
5² + b² = 13²
25 + b² = 169
b² = 169 - 25 = 144
b = √144 = 12

Answer: The ladder reaches 12 feet up the wall.`
        }
      ],
      common_mistakes: [
        { mistake: 'Using the theorem on non-right triangles', correction: 'Always verify that your triangle has a 90-degree angle before applying the Pythagorean Theorem.' },
        { mistake: 'Confusing which side is the hypotenuse', correction: 'The hypotenuse is always the longest side and is always opposite the right angle. It should always be labeled as c.' },
        { mistake: 'Forgetting to take the square root', correction: 'After calculating a² + b², remember to take the square root to find c. The final answer is √(a² + b²), not just a² + b².' },
        { mistake: 'Adding the sides before squaring', correction: 'You must square first, then add. It\'s a² + b², not (a + b)².' }
      ],
      tips_and_tricks: [
        'Common Pythagorean triples to memorize: 3-4-5, 5-12-13, 8-15-17, and 7-24-25. Any multiple of these also works (6-8-10, 9-12-15, etc.).',
        'The theorem works in reverse: if a² + b² = c², then the triangle must be a right triangle.',
        'The distance formula in coordinate geometry (√[(x₂-x₁)² + (y₂-y₁)²]) is based on the Pythagorean Theorem.',
        'Think of the theorem as a "balance" - the area of the big square equals the sum of the two smaller squares.'
      ],
      practice_ideas: 'Try drawing different right triangles and measuring their sides to verify the theorem. Practice with real-world problems like finding distances on maps, or calculating diagonal distances across rectangular spaces. Challenge yourself with problems where you need to find a leg instead of the hypotenuse.',
      summary: 'The Pythagorean Theorem (a² + b² = c²) is a fundamental relationship in geometry that connects the three sides of any right triangle. It states that the square of the hypotenuse equals the sum of the squares of the other two sides. This elegant formula has applications far beyond geometry, including physics, engineering, computer graphics, and navigation. Remember: it only works for right triangles, and the hypotenuse is always the longest side opposite the right angle.'
    };
  }

  if (topicLower.includes('quadratic')) {
    return {
      title: 'Quadratic Equations',
      category: 'Algebra',
      difficulty: 'intermediate',
      simple_summary: 'A quadratic equation is a polynomial equation of degree 2, typically written as ax² + bx + c = 0, and can be solved using multiple methods including factoring, completing the square, or the quadratic formula.',
      detailed_explanation: `Quadratic equations are second-degree polynomial equations, meaning the highest power of the variable is 2. They appear everywhere in mathematics, physics, engineering, and real-world applications like projectile motion, optimization problems, and profit calculations.

The standard form is ax² + bx + c = 0, where:
- a is the coefficient of x² (and cannot be zero, or it wouldn't be quadratic)
- b is the coefficient of x
- c is the constant term

The solutions to a quadratic equation are called roots or zeros. A quadratic equation can have:
- Two distinct real solutions
- One repeated real solution (when the parabola touches the x-axis at exactly one point)
- Two complex solutions (when the parabola doesn't cross the x-axis)

The graph of a quadratic equation is a parabola, which opens upward if a > 0 and downward if a < 0. The roots are the x-intercepts of this parabola.`,
      formulas: [
        { formula: 'ax² + bx + c = 0', description: 'Standard form of a quadratic equation' },
        { formula: 'x = (-b ± √(b² - 4ac)) / (2a)', description: 'The quadratic formula - works for all quadratic equations' },
        { formula: 'b² - 4ac', description: 'The discriminant - tells you the nature of the roots' }
      ],
      steps: [
        { step: 1, title: 'Write in standard form', description: 'Rearrange the equation so it equals zero: ax² + bx + c = 0' },
        { step: 2, title: 'Identify a, b, and c', description: 'Note the coefficients: a (coefficient of x²), b (coefficient of x), and c (constant term)' },
        { step: 3, title: 'Choose a solution method', description: 'Try factoring first. If that doesn\'t work easily, use the quadratic formula.' },
        { step: 4, title: 'Apply the quadratic formula', description: 'Substitute a, b, and c into x = (-b ± √(b² - 4ac)) / (2a)' },
        { step: 5, title: 'Simplify', description: 'Calculate the discriminant (b² - 4ac), then find both solutions using + and -' }
      ],
      examples: [
        {
          title: 'Simple Factoring Example',
          content: 'Solve x² - 5x + 6 = 0',
          solution: `Method 1: Factoring
We need two numbers that multiply to 6 and add to -5.
Those numbers are -2 and -3.

x² - 5x + 6 = 0
(x - 2)(x - 3) = 0

Set each factor to zero:
x - 2 = 0  →  x = 2
x - 3 = 0  →  x = 3

Answer: x = 2 or x = 3`
        },
        {
          title: 'Using the Quadratic Formula',
          content: 'Solve 2x² + 5x - 3 = 0',
          solution: `Here: a = 2, b = 5, c = -3

x = (-b ± √(b² - 4ac)) / (2a)
x = (-5 ± √(5² - 4(2)(-3))) / (2(2))
x = (-5 ± √(25 + 24)) / 4
x = (-5 ± √49) / 4
x = (-5 ± 7) / 4

Two solutions:
x = (-5 + 7) / 4 = 2/4 = 1/2
x = (-5 - 7) / 4 = -12/4 = -3

Answer: x = 1/2 or x = -3`
        }
      ],
      common_mistakes: [
        { mistake: 'Forgetting the ± sign in the quadratic formula', correction: 'The ± means you must calculate TWO answers: one with + and one with -' },
        { mistake: 'Sign errors with b in the formula', correction: 'The formula has -b, so if b is negative, -b becomes positive. Be careful with signs!' },
        { mistake: 'Incorrect calculation of the discriminant', correction: 'Remember it\'s b² - 4ac, not b - 4ac. The b must be squared first.' },
        { mistake: 'Dividing only part of the numerator by 2a', correction: 'The entire numerator (-b ± √discriminant) must be divided by 2a' }
      ],
      tips_and_tricks: [
        'Check the discriminant (b² - 4ac) first: if positive, you have 2 real solutions; if zero, 1 solution; if negative, no real solutions.',
        'Perfect square trinomials like x² + 6x + 9 = (x + 3)² are easy to spot: the constant term is (b/2)²',
        'You can always verify your answers by substituting them back into the original equation.',
        'Memorize the quadratic formula song or mnemonic: "x equals negative b, plus or minus the square root, of b squared minus 4ac, all over 2a"'
      ],
      practice_ideas: 'Start with simple factorable quadratics, then progress to using the quadratic formula. Practice identifying a, b, and c in different formats. Try graphing quadratics to visualize where the solutions appear as x-intercepts. Create word problems involving area or projectile motion that lead to quadratic equations.',
      summary: 'Quadratic equations (ax² + bx + c = 0) are second-degree polynomials with applications throughout mathematics and science. They can be solved by factoring when possible, or by using the reliable quadratic formula: x = (-b ± √(b² - 4ac)) / (2a). The discriminant (b² - 4ac) tells you whether you\'ll get two, one, or no real solutions. Understanding quadratics is essential for algebra, calculus, physics, and many real-world problem-solving scenarios.'
    };
  }

  return {
    title: topic,
    category: 'General',
    difficulty: 'intermediate',
    simple_summary: `An explanation of ${topic} - a fundamental concept in mathematics.`,
    detailed_explanation: `This is a comprehensive explanation of ${topic}. This topic involves understanding key mathematical principles and their applications.`,
    formulas: [],
    steps: [
      { step: 1, title: 'Understanding the concept', description: 'Begin by understanding the basic definition and purpose.' },
      { step: 2, title: 'Learn the key principles', description: 'Identify the main rules and relationships.' },
      { step: 3, title: 'Practice with examples', description: 'Work through examples to solidify understanding.' }
    ],
    examples: [
      { title: 'Basic Example', content: `A simple example demonstrating ${topic}.`, solution: 'Step-by-step solution would be provided here.' }
    ],
    common_mistakes: [],
    tips_and_tricks: ['Practice regularly', 'Work through multiple examples', 'Connect concepts to real-world applications'],
    practice_ideas: 'Try various practice problems and explore different applications of this concept.',
    summary: `Understanding ${topic} is important for building a strong mathematical foundation.`
  };
}

export async function searchTopics(query: string): Promise<Topic[]> {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .ilike('title', `%${query}%`)
    .order('search_count', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error searching topics:', error);
    return [];
  }

  return data as Topic[];
}
