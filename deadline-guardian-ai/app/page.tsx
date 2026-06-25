"use client";

import { useState } from "react";

export default function Home() {
  const [task, setTask] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const analyzeTask = async () => {
    if (!task) return;

    setLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ task }),
      });

      const data = await response.json();

      setResult(data.result);
    } catch (error) {
      console.error(error);
      setResult("Error analyzing task.");
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6">
          Deadline Guardian AI
        </h1>

        <p className="text-center text-gray-600 mb-8">
          Your AI-powered productivity companion.
        </p>

        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-xl font-semibold mb-4">
            Enter Your Task
          </h2>

          <textarea
            value={task}
            onChange={(e) => setTask(e.target.value)}
            className="w-full border p-3 rounded-lg"
            rows={5}
            placeholder="Example: My AI assignment is due this Friday and I have not started yet."
          />

          <button
            onClick={analyzeTask}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg"
          >
            {loading ? "Analyzing..." : "Analyze Task"}
          </button>

          {result && (
            <div className="mt-6 p-4 bg-gray-100 rounded-lg whitespace-pre-wrap">
              {result}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}