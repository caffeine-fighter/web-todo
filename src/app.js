import { announce, renderFilter, renderStatus, renderSummary, renderTodos } from './dom.js';
import { createTodoStore } from './state.js';
import { isDuplicateTodo, normalizeTodoText } from './utils.js';

const form = document.querySelector('#todo-form');
const input = document.querySelector('#todo-input');
const list = document.querySelector('#todo-list');
const count = document.querySelector('#todo-count');
const toolbar = document.querySelector('#toolbar');
const announcer = document.querySelector('#announcer');
const activeCount = document.querySelector('#active-count');
const clearCompletedButton = document.querySelector('#clear-completed');

if (!form || !input || !list || !count || !toolbar || !clearCompletedButton || !announcer || !activeCount) {
  throw new Error('필수 DOM 요소를 찾을 수 없습니다.');
}

const store = createTodoStore();

const filter = {
  value: 'all',
};

function getVisibleTodos(todos) {
  if (filter.value === 'active') {
    return todos.filter((todo) => !todo.completed);
  }

  if (filter.value === 'completed') {
    return todos.filter((todo) => todo.completed);
  }

  return todos;
}

function updateView() {
  const todos = store.getTodos();
  const stats = store.getStats();
  renderTodos(list, getVisibleTodos(todos));
  renderStatus(count, todos);
  renderFilter(toolbar, filter.value);
  renderSummary(activeCount, clearCompletedButton, stats);
}

function handleAddTodo(event) {
  event.preventDefault();
  const formData = new FormData(form);
  const value = normalizeTodoText(formData.get('todo'));

  if (!value) {
    input.setCustomValidity('할 일을 입력해주세요.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');

  if (isDuplicateTodo(store.getTodos(), value)) {
    input.setCustomValidity('동일한 TODO가 이미 존재합니다.');
    form.reportValidity();
    input.focus();
    return;
  }

  input.setCustomValidity('');
  store.addTodo(value);
  announce(announcer, `할 일 추가: ${value}`);
  form.reset();
  input.focus();
}

function handleFilterClick(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const nextFilter = target.dataset.filter;
  if (!nextFilter) {
    return;
  }

  filter.value = nextFilter;
  announce(announcer, `필터 변경: ${target.textContent ?? '전체'}`);
  updateView();
}


function moveFilterFocus(currentButton, direction) {
  const chips = [...toolbar.querySelectorAll('.chip[data-filter]')];
  const index = chips.indexOf(currentButton);
  if (index < 0) {
    return;
  }

  const nextIndex = (index + direction + chips.length) % chips.length;
  chips[nextIndex].focus();
}

function handleToolbarKeydown(event) {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement) || !target.dataset.filter) {
    return;
  }

  if (event.key === 'ArrowRight') {
    event.preventDefault();
    moveFilterFocus(target, 1);
  }

  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    moveFilterFocus(target, -1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    toolbar.querySelector('.chip[data-filter="all"]')?.focus();
  }

  if (event.key === 'End') {
    event.preventDefault();
    toolbar.querySelector('.chip[data-filter="completed"]')?.focus();
  }
}

function handleTodoAction(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) {
    return;
  }

  const quickText = target.closest('[data-quick-add]')?.dataset.quickAdd;
  if (quickText) {
    const added = store.addTodo(quickText);
    if (added) {
      announce(announcer, `추천 할 일 추가: ${quickText}`);
    }
    return;
  }

  const row = target.closest('.todo-item');
  if (!row || !row.dataset.id) {
    return;
  }

  const actionEl = target.closest('[data-action]');
  const action = actionEl?.dataset.action;

  if (action === 'delete') {
    const text = row.querySelector('.todo-item__text')?.textContent ?? '할 일';
    store.removeTodo(row.dataset.id);
    announce(announcer, `할 일 삭제: ${text}`);
  }
}

function handleTodoToggle(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  if (target.dataset.action !== 'toggle') {
    return;
  }

  const row = target.closest('.todo-item');
  if (!row || !row.dataset.id) {
    return;
  }

  const text = row.querySelector('.todo-item__text')?.textContent ?? '할 일';
  store.toggleTodo(row.dataset.id);
  announce(announcer, `완료 상태 변경: ${text}`);
}

function handleClearCompleted() {
  const removed = store.clearCompleted();
  if (removed) {
    announce(announcer, '완료된 할 일을 모두 삭제했습니다.');
  }
}

form.addEventListener('submit', handleAddTodo);
toolbar.addEventListener('click', handleFilterClick);
toolbar.addEventListener('keydown', handleToolbarKeydown);
list.addEventListener('click', handleTodoAction);
list.addEventListener('change', handleTodoToggle);
clearCompletedButton.addEventListener('click', handleClearCompleted);

store.subscribe(updateView);
updateView();
