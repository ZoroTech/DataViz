/*
  # Add Quiz Data for Data Structures

  1. New Data
    - Creates quizzes for multiple topics:
      - Algorithms
      - Graphs
      - Linked Lists
      - Queues
      - Stacks
      - Trees
    - Each quiz has multiple-choice questions with explanations
    - Questions cover theory and practical applications

  2. Content Structure
    - Each topic has 5 questions
    - Questions progress from basic to advanced concepts
    - Detailed explanations for each answer
*/

DO $$
DECLARE
  algorithms_quiz_id uuid;
  graphs_quiz_id uuid;
  linked_lists_quiz_id uuid;
  queues_quiz_id uuid;
  stacks_quiz_id uuid;
  trees_quiz_id uuid;
BEGIN
  -- Create Algorithms Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'algorithms',
    'Algorithm Fundamentals',
    'Test your knowledge of sorting and searching algorithms'
  )
  RETURNING id INTO algorithms_quiz_id;

  -- Create Graphs Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'graphs',
    'Graph Theory Basics',
    'Test your understanding of graph data structures and algorithms'
  )
  RETURNING id INTO graphs_quiz_id;

  -- Create Linked Lists Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'linked-lists',
    'Linked List Operations',
    'Test your knowledge of linked list implementations and operations'
  )
  RETURNING id INTO linked_lists_quiz_id;

  -- Create Queues Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'queues',
    'Queue Data Structure',
    'Test your understanding of queue operations and implementations'
  )
  RETURNING id INTO queues_quiz_id;

  -- Create Stacks Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'stacks',
    'Stack Operations',
    'Test your knowledge of stack data structure and its applications'
  )
  RETURNING id INTO stacks_quiz_id;

  -- Create Trees Quiz
  INSERT INTO quizzes (topic, title, description)
  VALUES (
    'trees',
    'Tree Data Structures',
    'Test your understanding of tree structures and operations'
  )
  RETURNING id INTO trees_quiz_id;

  -- Insert Algorithms Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      algorithms_quiz_id,
      'What is the time complexity of Bubble Sort?',
      '["O(n)", "O(n log n)", "O(n²)", "O(1)"]',
      2,
      'Bubble Sort has a time complexity of O(n²) because it uses nested loops to compare and swap adjacent elements.',
      1
    ),
    (
      algorithms_quiz_id,
      'Which sorting algorithm is typically the fastest in practice?',
      '["Bubble Sort", "Quick Sort", "Selection Sort", "Insertion Sort"]',
      1,
      'Quick Sort is generally the fastest sorting algorithm in practice due to its efficient partitioning strategy and good average-case time complexity of O(n log n).',
      2
    ),
    (
      algorithms_quiz_id,
      'What is the time complexity of Binary Search?',
      '["O(n)", "O(log n)", "O(n²)", "O(1)"]',
      1,
      'Binary Search has a time complexity of O(log n) because it repeatedly divides the search interval in half.',
      3
    ),
    (
      algorithms_quiz_id,
      'Which sorting algorithm is stable?',
      '["Quick Sort", "Heap Sort", "Merge Sort", "Selection Sort"]',
      2,
      'Merge Sort is stable because it preserves the relative order of equal elements during the sorting process.',
      4
    ),
    (
      algorithms_quiz_id,
      'What is the space complexity of Merge Sort?',
      '["O(1)", "O(log n)", "O(n)", "O(n²)"]',
      2,
      'Merge Sort has a space complexity of O(n) because it needs additional space proportional to the input size to merge the sorted subarrays.',
      5
    );

  -- Insert Graphs Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      graphs_quiz_id,
      'Which traversal algorithm uses a queue?',
      '["Depth-First Search", "Breadth-First Search", "Topological Sort", "Dijkstra''s Algorithm"]',
      1,
      'Breadth-First Search (BFS) uses a queue data structure to visit nodes level by level, exploring all neighbors before moving to the next level.',
      1
    ),
    (
      graphs_quiz_id,
      'What is the time complexity of Dijkstra''s algorithm with a priority queue?',
      '["O(V)", "O(E)", "O((V + E) log V)", "O(V²)"]',
      2,
      'Dijkstra''s algorithm with a priority queue has a time complexity of O((V + E) log V), where V is the number of vertices and E is the number of edges.',
      2
    ),
    (
      graphs_quiz_id,
      'Which graph representation is more space-efficient for sparse graphs?',
      '["Adjacency Matrix", "Adjacency List", "Edge List", "Incidence Matrix"]',
      1,
      'Adjacency List is more space-efficient for sparse graphs because it only stores actual edges, using O(V + E) space instead of O(V²) for adjacency matrix.',
      3
    ),
    (
      graphs_quiz_id,
      'What algorithm finds the minimum spanning tree?',
      '["Dijkstra''s", "Floyd-Warshall", "Kruskal''s", "Bellman-Ford"]',
      2,
      'Kruskal''s algorithm finds the minimum spanning tree by selecting edges in ascending order of weight while avoiding cycles.',
      4
    ),
    (
      graphs_quiz_id,
      'Which algorithm detects cycles in a directed graph?',
      '["BFS", "DFS", "Topological Sort", "Binary Search"]',
      1,
      'DFS (Depth-First Search) can detect cycles in a directed graph by keeping track of nodes in the current recursion stack.',
      5
    );

  -- Insert Linked Lists Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      linked_lists_quiz_id,
      'What is the time complexity of inserting at the beginning of a linked list?',
      '["O(1)", "O(n)", "O(log n)", "O(n²)"]',
      0,
      'Inserting at the beginning of a linked list is O(1) because we only need to update the head pointer and the new node''s next pointer.',
      1
    ),
    (
      linked_lists_quiz_id,
      'Which operation requires traversing the entire list?',
      '["Inserting at head", "Deleting first node", "Finding the last node", "Getting the length"]',
      3,
      'Getting the length of a linked list requires traversing all nodes to count them, resulting in O(n) time complexity.',
      2
    ),
    (
      linked_lists_quiz_id,
      'What is a doubly linked list?',
      '["List with only head pointer", "List with head and tail pointers", "List with previous and next pointers", "List with multiple heads"]',
      2,
      'A doubly linked list has nodes with both previous and next pointers, allowing bidirectional traversal.',
      3
    ),
    (
      linked_lists_quiz_id,
      'How do you detect a cycle in a linked list?',
      '["Count nodes", "Floyd''s cycle-finding", "Binary search", "Sort the list"]',
      1,
      'Floyd''s cycle-finding algorithm (also known as tortoise and hare) uses two pointers moving at different speeds to detect cycles.',
      4
    ),
    (
      linked_lists_quiz_id,
      'What is the space complexity of a linked list?',
      '["O(1)", "O(n)", "O(log n)", "O(n²)"]',
      1,
      'The space complexity of a linked list is O(n) because it needs memory proportional to the number of elements stored.',
      5
    );

  -- Insert Queues Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      queues_quiz_id,
      'What is the order of elements in a queue?',
      '["LIFO", "FIFO", "Random", "Sorted"]',
      1,
      'Queue follows First-In-First-Out (FIFO) order, where elements are removed in the same order they were added.',
      1
    ),
    (
      queues_quiz_id,
      'What is the time complexity of enqueue operation?',
      '["O(1)", "O(n)", "O(log n)", "O(n²)"]',
      0,
      'Enqueue operation in a queue is O(1) because we only need to add an element at the rear of the queue.',
      2
    ),
    (
      queues_quiz_id,
      'Which data structure can implement a queue?',
      '["Array", "Linked List", "Both A and B", "Neither"]',
      2,
      'Queues can be implemented using either arrays (circular queue) or linked lists, each with their own advantages.',
      3
    ),
    (
      queues_quiz_id,
      'What is a priority queue?',
      '["FIFO queue", "LIFO queue", "Elements have priorities", "Circular queue"]',
      2,
      'A priority queue is a queue where elements have priorities and are dequeued based on their priority rather than arrival order.',
      4
    ),
    (
      queues_quiz_id,
      'What is a deque?',
      '["Single-ended queue", "Priority queue", "Double-ended queue", "Circular queue"]',
      2,
      'A deque (double-ended queue) allows insertion and deletion at both ends of the queue.',
      5
    );

  -- Insert Stacks Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      stacks_quiz_id,
      'What is the order of elements in a stack?',
      '["FIFO", "LIFO", "Random", "Sorted"]',
      1,
      'Stack follows Last-In-First-Out (LIFO) order, where the last element pushed is the first one to be popped.',
      1
    ),
    (
      stacks_quiz_id,
      'What is stack overflow?',
      '["Empty stack", "Full stack", "Stack corruption", "Invalid operation"]',
      1,
      'Stack overflow occurs when trying to push an element onto a stack that is already full (in bounded implementations).',
      2
    ),
    (
      stacks_quiz_id,
      'Which operation is not typically found in a stack?',
      '["Push", "Pop", "Peek", "Insert at middle"]',
      3,
      'Insert at middle is not a standard stack operation as it violates the LIFO principle. Stacks typically only support push, pop, and peek.',
      3
    ),
    (
      stacks_quiz_id,
      'What is a common application of stacks?',
      '["Task scheduling", "Function call management", "Database indexing", "Network routing"]',
      1,
      'Stacks are commonly used for managing function calls (call stack) in programming language implementations.',
      4
    ),
    (
      stacks_quiz_id,
      'What is the time complexity of push and pop operations?',
      '["O(n)", "O(log n)", "O(1)", "O(n²)"]',
      2,
      'Both push and pop operations in a stack are O(1) because they only involve the top element.',
      5
    );

  -- Insert Trees Quiz Questions
  INSERT INTO quiz_questions (quiz_id, question, options, correct_answer, explanation, "order")
  VALUES
    (
      trees_quiz_id,
      'What is the height of a perfect binary tree with n nodes?',
      '["log n", "n", "n/2", "2^n"]',
      0,
      'The height of a perfect binary tree is log n (base 2) because each level doubles the number of nodes.',
      1
    ),
    (
      trees_quiz_id,
      'Which traversal visits the root first?',
      '["Inorder", "Preorder", "Postorder", "Level-order"]',
      1,
      'Preorder traversal visits the root node first, then the left subtree, and finally the right subtree.',
      2
    ),
    (
      trees_quiz_id,
      'What makes a binary search tree?',
      '["All nodes have 2 children", "Left < Root < Right", "Balanced height", "Complete levels"]',
      1,
      'In a binary search tree, all nodes in the left subtree are less than the root, and all nodes in the right subtree are greater than the root.',
      3
    ),
    (
      trees_quiz_id,
      'What is an AVL tree?',
      '["Any binary tree", "Complete binary tree", "Self-balancing BST", "Perfect binary tree"]',
      2,
      'An AVL tree is a self-balancing binary search tree where the heights of left and right subtrees differ by at most one.',
      4
    ),
    (
      trees_quiz_id,
      'What is the time complexity of searching in a balanced BST?',
      '["O(1)", "O(log n)", "O(n)", "O(n²)"]',
      1,
      'Searching in a balanced binary search tree takes O(log n) time because we eliminate half of the remaining nodes at each step.',
      5
    );
END $$;