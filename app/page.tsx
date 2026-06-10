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
    toast.success(!completed ? "Tamamlandı! ✓" : "Geri alındı!");
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    deleteTodo(id);
    toast("Todo silindi", { icon: "🗑️" });
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
    toast.success("Güncellendi!");
  };

  const completed = todos.filter((t) => t.completed).length;
  const progress = todos.length > 0 ? (completed / todos.length) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#0f0f13] text-white py-16 px-4">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1e1e2e",
            color: "#fff",
            border: "1px solid #2e2e3e",
          },
        }}
      />

      <div className="max-w-lg mx-auto">

        {/* Başlık */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent mb-2">
            Todo App
          </h1>
          <p className="text-gray-500 text-sm">
            {completed} / {todos.length} tamamlandı
          </p>

          {/* Progress bar */}
          {todos.length > 0 && (
            <div className="mt-4 h-1.5 bg-[#1e1e2e] rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-violet-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2 mb-8">
          <input
            className="flex-1 bg-[#1e1e2e] border border-[#2e2e3e] rounded-xl px-4 py-3 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 placeholder-gray-600 transition"
            placeholder="Yeni bir görev ekle..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="bg-violet-600 hover:bg-violet-700 text-white px-5 py-3 rounded-xl font-medium transition active:scale-95"
          >
            + Ekle
          </button>
        </div>

        {/* Liste */}
        <ul className="space-y-2">
          {todos.length === 0 && (
            <div className="text-center py-16">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-gray-600">Henüz görev yok. Bir şeyler ekle!</p>
            </div>
          )}

          {todos.map((todo) => (
            <li
              key={todo.id}
              className="group flex items-center justify-between bg-[#1e1e2e] border border-[#2e2e3e] hover:border-[#3e3e5e] rounded-xl px-4 py-3 transition"
            >
              {editingId === todo.id ? (
                <div className="flex flex-1 gap-2">
                  <input
                    className="flex-1 bg-[#0f0f13] border border-violet-500 rounded-lg px-3 py-1.5 text-sm outline-none"
                    value={editingTitle}
                    onChange={(e) => setEditingTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleEditSave(todo.id)}
                    autoFocus
                  />
                  <button
                    onClick={() => handleEditSave(todo.id)}
                    className="text-violet-400 hover:text-violet-300 text-sm font-medium px-2"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-gray-600 hover:text-gray-400 text-sm px-1"
                  >
                    İptal
                  </button>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <input
                      type="checkbox"
                      checked={todo.completed}
                      onChange={() => handleToggle(todo.id, todo.completed)}
                      className="w-4 h-4 cursor-pointer accent-violet-500 shrink-0"
                    />
                    <span
                      className={`truncate transition ${todo.completed
                        ? "line-through text-gray-600"
                        : "text-gray-200"
                        }`}
                    >
                      {todo.title}
                    </span>
                  </div>

                  <div className="flex gap-3 ml-3 opacity-0 group-hover:opacity-100 transition shrink-0">
                    <button
                      onClick={() => handleEditStart(todo.id, todo.title)}
                      className="text-gray-500 hover:text-violet-400 text-sm transition"
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => handleDelete(todo.id)}
                      className="text-gray-500 hover:text-red-400 text-sm transition"
                    >
                      Sil
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>

        {/* Footer */}
        {todos.length > 0 && (
          <p className="text-center text-gray-700 text-xs mt-8">
            {todos.length - completed} görev kaldı
          </p>
        )}
      </div>
    </main>
  );
}