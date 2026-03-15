import test from 'node:test';
import assert from 'node:assert/strict';

import { createTodoStore } from '../src/state.js';
import { isDuplicateTodo, normalizeTodoText } from '../src/utils.js';

test('normalizeTodoText trims and compacts spaces', () => {
  assert.equal(normalizeTodoText('  hello   world  '), 'hello world');
});

test('isDuplicateTodo checks case-insensitive duplicates', () => {
  const todos = [{ id: '1', text: 'Read Book', completed: false }];
  assert.equal(isDuplicateTodo(todos, 'read book'), true);
  assert.equal(isDuplicateTodo(todos, 'write book'), false);
});

test('store add/toggle/remove/clear work with injected deps', () => {
  const saved = [];
  let id = 0;

  const store = createTodoStore([], {
    generateId: () => `id-${++id}`,
    load: (seed) => [...seed],
    save: (todos) => saved.push(todos.map((todo) => ({ ...todo }))),
  });

  assert.equal(store.addTodo('첫 할 일'), true);
  assert.equal(store.addTodo('둘째 할 일'), true);

  let todos = store.getTodos();
  assert.equal(todos.length, 2);

  assert.equal(store.toggleTodo(todos[0].id), true);
  todos = store.getTodos();
  assert.equal(todos[0].completed, true);

  assert.equal(store.removeTodo('missing-id'), false);
  assert.equal(store.removeTodo(todos[1].id), true);
  assert.equal(store.getTodos().length, 1);

  assert.equal(store.clearCompleted(), true);
  assert.equal(store.getTodos().length, 0);
  assert.equal(store.clearCompleted(), false);

  assert.ok(saved.length >= 5);
});

test('store getStats returns total/completed/active', () => {
  const store = createTodoStore(
    [
      { id: 'a', text: 'A', completed: false },
      { id: 'b', text: 'B', completed: true },
    ],
    { load: (seed) => [...seed], save: () => {} },
  );

  assert.deepEqual(store.getStats(), {
    total: 2,
    completed: 1,
    active: 1,
  });
});

test('toggle missing id does not call save', () => {
  let saveCalls = 0;
  const store = createTodoStore(
    [{ id: 'a', text: 'A', completed: false }],
    {
      load: (seed) => [...seed],
      save: () => {
        saveCalls += 1;
      },
    },
  );

  assert.equal(store.toggleTodo('missing'), false);
  assert.equal(saveCalls, 0);
});
