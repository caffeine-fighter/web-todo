const STORAGE_KEY = 'web-todo.todos.v2';

function isTodoShape(value) {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof value.id === 'string' &&
    typeof value.text === 'string' &&
    typeof value.completed === 'boolean'
  );
}

export function loadTodos(fallbackTodos = []) {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [...fallbackTodos];
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      return [...fallbackTodos];
    }

    const todos = parsed.filter(isTodoShape);
    return todos.length > 0 ? todos : [...fallbackTodos];
  } catch {
    return [...fallbackTodos];
  }
}

export function saveTodos(todos) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {
    // Ignore storage write failures (e.g. private mode quota).
  }
}
