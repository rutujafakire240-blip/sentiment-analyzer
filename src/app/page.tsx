"use client";

import { useState } from "react";
import axios from "axios";

interface ResultItem {
  sentence: string;
  sentiment: string;
  score: number;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [results, setResults] = useState<ResultItem[]>([]);

  const uploadFile = async () => {
    if (!file) {
      alert("Please select a file");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData
      );

      setResults(response.data.results);
    } catch (error) {
      console.log(error);
      alert("Upload failed");
    }
  };

  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-5">
        AI Sentiment Analyzer
      </h1>

      <div className="flex gap-4 mb-6">
        <input
          type="file"
          accept=".txt"
          onChange={(e) => {
            if (e.target.files) {
              setFile(e.target.files[0]);
            }
          }}
          className="border p-2"
        />

        <button
          onClick={uploadFile}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Analyze
        </button>
      </div>

      <div className="space-y-4">
        {results.map((item, index) => (
          <div
            key={index}
            className="border p-4 rounded"
          >
            <p>{item.sentence}</p>

            <p className="font-bold mt-2">
              {item.sentiment}
            </p>

            <p>
              Score: {item.score}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}