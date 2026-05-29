'use client';

import { ToDoItem } from '@/types/analysis';

interface TodoListProps {
  todos: ToDoItem[];
  onToggleTodo: (todoId: string, completed: boolean) => void;
}

export default function TodoList({ todos, onToggleTodo }: TodoListProps) {
  if (todos.length === 0) {
    return (
      <div className="py-8 text-center text-sm text-gray-400 dark:text-gray-500">
        やること（ToDo）はありません。
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`flex items-start gap-3 rounded-xl border p-4 transition-all duration-150 ${
            todo.completed
              ? 'border-gray-200 bg-gray-50/50 dark:border-gray-800/40 dark:bg-gray-900/10'
              : 'border-gray-200 bg-white hover:border-indigo-200 dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-900/50'
          }`}
        >
          <div className="flex h-5 items-center">
            <input
              id={`todo-${todo.id}`}
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => onToggleTodo(todo.id, e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 dark:border-gray-600 dark:bg-gray-700"
            />
          </div>
          <div className="flex-1 text-sm">
            <label
              htmlFor={`todo-${todo.id}`}
              className={`font-semibold cursor-pointer ${
                todo.completed
                  ? 'text-gray-400 line-through dark:text-gray-500'
                  : 'text-gray-700 dark:text-gray-200'
              }`}
            >
              {todo.task}
            </label>
            {todo.deadline && (
              <span
                className={`mt-1 block text-xs font-semibold ${
                  todo.completed
                    ? 'text-gray-300 dark:text-gray-650'
                    : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                📆 {todo.deadline}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
