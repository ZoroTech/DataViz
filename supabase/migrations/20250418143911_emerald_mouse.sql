/*
  # Add Array Quiz Data

  1. New Data
    - Creates a quiz for arrays topic
    - Adds multiple-choice questions with explanations
    - Questions cover array operations and time complexity

  2. Content
    - Quiz focuses on fundamental array concepts
    - Each question has 4 options and detailed explanations
    - Questions are ordered by difficulty
*/

-- Insert quiz for arrays
INSERT INTO quizzes (id, topic, title, description)
VALUES (
  'f0e05550-1234-4321-a432-123456789abc',
  'arrays',
  'Arrays Fundamentals',
  'Test your knowledge of array data structures and operations'
);

-- Insert quiz questions
INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
VALUES
  (
    'f0e05550-1234-4321-a432-123456789abc',
    'What is the time complexity of accessing an element in an array by its index?',
    '["O(n)", "O(log n)", "O(1)", "O(n²)"]',
    2,
    'Array access by index is O(1) because arrays store elements in contiguous memory locations, allowing direct access to any element using its index.',
    1
  ),
  (
    'f0e05550-1234-4321-a432-123456789abc',
    'Which operation would take O(n) time in an array?',
    '["Accessing the first element", "Accessing the last element", "Inserting at the beginning", "Updating an element at a known index"]',
    2,
    'Inserting at the beginning of an array requires shifting all existing elements one position to the right, resulting in O(n) time complexity.',
    2
  ),
  (
    'f0e05550-1234-4321-a432-123456789abc',
    'What is the space complexity of an array with n elements?',
    '["O(1)", "O(log n)", "O(n)", "O(n²)"]',
    2,
    'Arrays have a space complexity of O(n) because they require memory proportional to the number of elements they store.',
    3
  ),
  (
    'f0e05550-1234-4321-a432-123456789abc',
    'Which of the following is NOT an advantage of arrays?',
    '["Fast access by index", "Memory efficiency", "Dynamic size", "Cache-friendly"]',
    2,
    'Arrays have a fixed size in most implementations. To grow an array, you need to create a new larger array and copy all elements, which is not memory efficient for dynamic data.',
    4
  ),
  (
    'f0e05550-1234-4321-a432-123456789abc',
    'What happens when you try to access an array index that is out of bounds?',
    '["Returns null", "Returns undefined", "Throws an error", "Returns the last element"]',
    2,
    'Accessing an array index that is out of bounds typically throws an error (e.g., IndexOutOfBoundsException in Java, undefined in JavaScript) because it attempts to access memory outside the allocated array space.',
    5
  );