"use client";

import { useEffect, useState } from "react";
import { useTodoStore } from "@/store/todoStore";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const { todos, setTodos, addTodo, updateTodo, deleteTodo } = useTodoStore();
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");

  useEffect(() => {
    fetch("/api/todos")
      .then((res) => res.json())
      .then(setTodos);
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    const res = await fetch("/api/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
      headers: { "Content-Type": "application/json" },
    });
    const todo = await res.json();
    addTodo(todo);
    setTitle("");
    toast.success("Todo eklendi!");
  };

  const handleToggle = async (id: string, completed: boolean) => {
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !completed }),
      headers: { "Content-Type": "application/json" },
    });
    updateTodo(id, !completed);
    toast.success(!completed ? "Tamamlandı!" : "Geri alındı!");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    deleteTodo(id);
    toast.error("Todo silindi!");
  };

  const handleEditStart = (id: string, currentTitle: string) => {
    setEditingId(id);
    setEditingTitle(currentTitle);
  };

  const handleEditSave = async (id: string) => {
    if (!editingTitle.trim()) return;
    await fetch(`/api/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ title: editingTitle }),
      headers: { "Content-Type": "application/json" },
    });
    updateTodo(id, todos.find((t) => t.id === id)?.completed ?? false, editingTitle);
    setEditingId(null);
    toast.success("Todo güncellendi!");
  };

  const completed = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-gradient-to from-blue-50 to-indigo-100 py-16 px-4">
      <Toaster position="top-right" />

      <div className="max-w-lg mx-auto">
        {/* Başlık */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-700 mb-1">Todo App</h1>
          <p className="text-gray-500 text-sm">
            {completed}/{todos.length} tamamlandı
          </p>
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 border-0 shadow-md rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-400 bg-white"
            placeholder="Yeni todo ekle..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-indigo-600 text-white px-5 py-3 rounded-xl hover:bg-indigo-700 shadow-md font-medium transition"
          >
            Ekle
          </button>
        </div>

        {/* Liste */}
        <ul className="space-y-3">
          {todos.length === 0 && (
            <p className="text-center text-gray-400 py-10">Henüz todo yok!</p>
          )}
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center justify-between bg-white rounded-xl px-4 py-3 shadow-sm"
            >
              {editingId === todo.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    className="flex-1 border rounded-lg px-3 py-1 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditSave(todo.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(todo.id)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-400 hover:text-gray-600 text-sm"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id, todo.completed)}
                      className="w-4 h-4 cursor-pointer accent-indigo-600"
                    />
                    <span
                      className={`flex-1 ${todo.completed ? "line-through text-gray-300" : "text-gray-700"
                        }`}
                    >
                      {todo.title}
                    </span>
                  </div>
                  <div className="flex gap-2 ml-2">
                    <button
                      onClick={() => handleEditStart(todo.id, todo.title)}
                      className="text-indigo-400 hover:text-indigo-600 text-sm"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-red-400 hover:text-red-600 text-sm"
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}