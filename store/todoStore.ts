import { create } from "zustand";
import { persist } from "zustand/middleware";

interface Todo {
    id: string;
    title: string;
    completed: boolean;
    createdAt: string;
}

interface TodoStore {
    todos: Todo[];
    setTodos: (todos: Todo[]) => void;
    addTodo: (todo: Todo) => void;
    updateTodo: (id: string, completed: boolean, title?: string) => void;
    deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>()(
    persist(
        (set) => ({
            todos: [],
            setTodos: (todos) => set({ todos }),
            addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
            updateTodo: (id, completed, title) =>
                set((state) => ({
                    todos: state.todos.map((t) =>
                        t.id === id ? { ...t, completed, ...(title && { title }) } : t
                    ),
                })),
            deleteTodo: (id) =>
                set((state) => ({
                    todos: state.todos.filter((t) => t.id !== id),
                })),
        }),
        {
            name: "todo-storage",
            skipHydration: true,
        }
    )
);