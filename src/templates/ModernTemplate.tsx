// ModernTemplate.tsx
import React from "react";
import { PortfolioData } from "./types";

export default function ModernTemplate({ data }: { data: PortfolioData }) {
  return (
    <main className="max-w-6xl mx-auto px-8 py-20 font-inter bg-white text-gray-900">
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-2">{data.name}</h1>
        <p className="text-xl text-gray-600">{data.title}</p>
        <p className="mt-6 text-gray-500 max-w-2xl mx-auto">{data.summary}</p>
      </section>

      <section className="grid md:grid-cols-2 gap-12 mb-16">
        <div>
          <h2 className="text-2xl font-semibold mb-4">Experience</h2>
          {data.experience.map((exp, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold text-lg">
                {exp.role} — {exp.company}
              </h3>
              <p className="text-sm text-gray-500">
                {exp.start} – {exp.end}
              </p>
              <p className="text-gray-600 mt-2">{exp.description}</p>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">Projects</h2>
          {data.projects.map((p, i) => (
            <div key={i} className="mb-6">
              <h3 className="font-semibold text-lg">{p.title}</h3>
              <p className="text-gray-600 mt-2">{p.description}</p>
              {p.link && (
                <a href={p.link} className="text-blue-600 hover:underline text-sm">
                  View Project
                </a>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-2xl font-semibold mb-4">Skills</h2>
        <div className="flex flex-wrap gap-3">
          {data.skills.map((skill, i) => (
            <span
              key={i}
              className="px-4 py-2 bg-gray-100 rounded-full text-sm font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Education</h2>
        {data.education.map((edu, i) => (
          <div key={i}>
            <h3 className="font-semibold">
              {edu.degree} — {edu.institution}
            </h3>
            <p className="text-sm text-gray-500">
              {edu.start} – {edu.end}
            </p>
          </div>
        ))}
      </section>
    </main>
  );
}