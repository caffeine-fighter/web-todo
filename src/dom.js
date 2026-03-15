function createTodoItem(todo) {
  const item = document.createElement('li');
  item.className = `todo-item${todo.completed ? ' is-completed' : ''}`;
  item.dataset.id = todo.id;

  const label = document.createElement('label');
  label.className = 'todo-item__label';

  const toggle = document.createElement('input');
  toggle.type = 'checkbox';
  toggle.className = 'todo-item__toggle';
  toggle.checked = todo.completed;
  toggle.dataset.action = 'toggle';
  toggle.setAttribute('aria-label', `${todo.text} 완료 여부 변경`);

  const text = document.createElement('p');
  text.className = 'todo-item__text';
  text.textContent = todo.text;

  label.append(toggle, text);

  const removeButton = document.createElement('button');
  removeButton.type = 'button';
  removeButton.className = 'todo-item__delete';
  removeButton.textContent = '삭제';
  removeButton.dataset.action = 'delete';
  removeButton.setAttribute('aria-label', `${todo.text} 삭제`);

  item.append(label, removeButton);

  return item;
}

function createEmptyRow() {
  const emptyRow = document.createElement('li');
  emptyRow.className = 'empty';

  const text = document.createElement('p');
  text.className = 'empty__text';
  text.textContent = '아직 할 일이 없어요. 아래 추천 TODO를 빠르게 추가해보세요!';

  const actions = document.createElement('div');
  actions.className = 'empty__actions';

  ['요구사항 정리하기', 'CSS 다듬기', 'DOM 이벤트 실습하기'].forEach((itemText) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'chip';
    button.dataset.quickAdd = itemText;
    button.textContent = itemText;
    actions.append(button);
  });

  emptyRow.append(text, actions);
  return emptyRow;
}

export function renderTodos(listEl, todos) {
  listEl.replaceChildren();

  if (todos.length === 0) {
    listEl.append(createEmptyRow());
    return;
  }

  const fragment = document.createDocumentFragment();
  todos.forEach((todo) => {
    fragment.append(createTodoItem(todo));
  });

  listEl.append(fragment);
}

export function renderStatus(statusEl, todos) {
  const completedCount = todos.filter((todo) => todo.completed).length;
  statusEl.textContent = `총 ${todos.length}개 · 완료 ${completedCount}개`;
}

export function renderFilter(toolbarEl, activeFilter) {
  const chips = toolbarEl.querySelectorAll('.chip[data-filter]');
  chips.forEach((chip) => {
    const isActive = chip.dataset.filter === activeFilter;
    chip.classList.toggle('is-active', isActive);
    chip.setAttribute('aria-pressed', String(isActive));
  });
}

export function renderSummary(activeCountEl, clearCompletedButton, stats) {
  activeCountEl.textContent = String(stats.active);
  clearCompletedButton.disabled = stats.completed === 0;
}

export function announce(announcerEl, message) {
  announcerEl.textContent = message;
}
