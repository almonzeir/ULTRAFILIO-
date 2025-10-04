// MinimalistTemplate.tsx
import React from "react";
import { PortfolioData } from "./types";

export default function MinimalistTemplate({ data }: { data: PortfolioData }) {
  return (
    <main className="max-w-4xl mx-auto px-6 py-20 font-sans bg-white text-black">
      <h1 className="text-5xl font-bold">{data.name}</h1>
      <p className="text-lg text-gray-700 mb-8">{data.title}</p>

      <section className="border-t border-gray-200 pt-8">
        <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4">
          Summary
        </h2>
        <p className="text-gray-800 mb-10">{data.summary}</p>

        <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4">
          Experience
        </h2>
        {data.experience.map((exp, i) => (
          <div key={i} className="mb-6">
            <h3 className="font-medium">{exp.role}</h3>
            <p className="text-gray-600 text-sm">
              {exp.company} — {exp.start} to {exp.end}
            </p>
            <p className="text-sm text-gray-700">{exp.description}</p>
          </div>
        ))}

        <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4 mt-10">
          Skills
        </h2>
        <p>{data.skills.join(", ")}</p>

        <h2 className="uppercase text-xs tracking-wider text-gray-500 mb-4 mt-10">
          Education
        </h2>
        {data.education.map((edu, i) => (
          <p key={i}>
            {edu.degree}, {edu.institution} ({edu.start}–{edu.end})
          </p>
        ))}
      </section>
    </main>
  );
}