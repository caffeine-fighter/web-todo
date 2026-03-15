import { loadTodos, saveTodos } from './storage.js';

const initialTodos = [
  { id: crypto.randomUUID(), text: '요구사항 읽기', completed: true },
  { id: crypto.randomUUID(), text: '순수 CSS로 UI 만들기', completed: false },
];

function createTodo(text, generateId) {
  return {
    id: generateId(),
    text,
    completed: false,
  };
}

export function createTodoStore(
  seed = initialTodos,
  {
    generateId = () => crypto.randomUUID(),
    load = loadTodos,
    save = saveTodos,
  } = {},
) {
  const listeners = new Set();
  const state = {
    todos: load(seed),
  };

  function emit() {
    listeners.forEach((listener) => listener([...state.todos]));
  }

  function commit(nextTodos) {
    if (nextTodos === state.todos) {
      return false;
    }

    state.todos = nextTodos;
    save(state.todos);
    emit();
    return true;
  }

  function replaceByMap(mapper) {
    let changed = false;
    const nextTodos = state.todos.map((todo) => {
      const next = mapper(todo);
      if (next !== todo) {
        changed = true;
      }
      return next;
    });

    return changed ? nextTodos : state.todos;
  }

  return {
    getTodos() {
      return [...state.todos];
    },

    getStats() {
      const total = state.todos.length;
      const completed = state.todos.filter((todo) => todo.completed).length;
      return {
        total,
        completed,
        active: total - completed,
      };
    },

    addTodo(text) {
      return commit([...state.todos, createTodo(text, generateId)]);
    },

    toggleTodo(todoId) {
      const nextTodos = replaceByMap((todo) =>
        todo.id === todoId ? { ...todo, completed: !todo.completed } : todo,
      );
      return commit(nextTodos);
    },

    removeTodo(todoId) {
      const nextTodos = state.todos.filter((todo) => todo.id !== todoId);
      return commit(nextTodos.length === state.todos.length ? state.todos : nextTodos);
    },

    clearCompleted() {
      const nextTodos = state.todos.filter((todo) => !todo.completed);
      return commit(nextTodos.length === state.todos.length ? state.todos : nextTodos);
    },

    subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
}
