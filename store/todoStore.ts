import { create } from "zustand";

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
    updateTodo: (id: string, completed: boolean) => void;
    deleteTodo: (id: string) => void;
}

export const useTodoStore = create<TodoStore>((set) => ({
    todos: [],
    setTodos: (todos) => set({ todos }),
    addTodo: (todo) => set((state) => ({ todos: [todo, ...state.todos] })),
    updateTodo: (id, completed) =>
        set((state) => ({
            todos: state.todos.map((t) =>
                t.id === id ? { ...t, completed } : t
            ),
        })),
    deleteTodo: (id) =>
        set((state) => ({
            todos: state.todos.filter((t) => t.id !== id),
        })),
}));