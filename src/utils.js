export function normalizeTodoText(text) {
  return String(text ?? '').replace(/\s+/g, ' ').trim();
}

export function isDuplicateTodo(todos, text) {
  const lowered = text.toLocaleLowerCase();
  return todos.some((todo) => todo.text.toLocaleLowerCase() === lowered);
}
