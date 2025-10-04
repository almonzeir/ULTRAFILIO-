
import React from "react";
import type { PortfolioData } from "./types";

export default function BasicTemplate({ data }: { data: PortfolioData }) {
  return (
    <main className="max-w-3xl mx-auto border border-gray-200 shadow-sm bg-white px-10 py-12 text-gray-900 font-sans">
      <header className="mb-8 border-b pb-4">
        <h1 className="text-3xl font-bold">{data.name}</h1>
        <p className="text-gray-600">{data.title}</p>
      </header>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p className="text-gray-700">{data.summary}</p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Experience</h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-3">
            <strong>{exp.role}</strong> – {exp.company}
            <div className="text-sm text-gray-500">
              {exp.start} to {exp.end}
            </div>
            <p className="text-sm">{exp.description}</p>
          </div>
        ))}
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        {data.education.map((edu, i) => (
          <p key={i}>
            {edu.degree}, {edu.institution} ({edu.start}–{edu.end})
          </p>
        ))}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc list-inside text-gray-700">
          {data.skills.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
