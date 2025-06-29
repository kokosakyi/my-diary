import type { MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "My Diary" },
    { name: "description", content: "A place to record my thoughts and memories" },
  ];
};

export const loader = async () => {
  const entries = await db.diaryEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 10, // Show latest 10 entries
  });

  return json({ entries });
};

export default function Index() {
  const { entries } = useLoaderData<typeof loader>();

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1 style={{ color: "#4a5568", marginBottom: "0.5rem" }}>✨ My Diary</h1>
        <p style={{ color: "#718096", marginBottom: "1rem" }}>A place to record your thoughts and memories</p>
        <Link
          to="/entries/new"
          style={{
            backgroundColor: "#4299e1",
            color: "white",
            padding: "10px 20px",
            borderRadius: "6px",
            textDecoration: "none",
            display: "inline-block"
          }}
        >
          ✍️ Write New Entry
        </Link>
      </header>

      <main>
        {entries.length === 0 ? (
          <div style={{ textAlign: "center", padding: "3rem", color: "#718096" }}>
            <p>📝 No diary entries yet. Start by writing your first entry!</p>
          </div>
        ) : (
          <div>
            <h2 style={{ color: "#4a5568", marginBottom: "1rem" }}>Recent Entries</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {entries.map((entry) => (
                <div
                  key={entry.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                    padding: "1.5rem",
                    backgroundColor: "#f8fafc"
                  }}
                >
                  <div style={{ marginBottom: "0.5rem" }}>
                    <Link
                      to={`/entries/${entry.id}`}
                      style={{
                        fontSize: "1.25rem",
                        fontWeight: "600",
                        color: "#2d3748",
                        textDecoration: "none"
                      }}
                    >
                      {entry.title}
                    </Link>
                    {entry.mood && (
                      <span style={{
                        marginLeft: "0.5rem",
                        backgroundColor: "#e6fffa",
                        color: "#047857",
                        padding: "2px 8px",
                        borderRadius: "12px",
                        fontSize: "0.875rem"
                      }}>
                        {entry.mood}
                      </span>
                    )}
                  </div>
                  <p style={{
                    color: "#718096",
                    fontSize: "0.875rem",
                    marginBottom: "0.5rem"
                  }}>
                    {new Date(entry.createdAt).toLocaleDateString("en-US", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </p>
                  <p style={{ color: "#4a5568", lineHeight: "1.6" }}>
                    {entry.content.length > 200
                      ? `${entry.content.substring(0, 200)}...`
                      : entry.content}
                  </p>
                  {entry.tags && (
                    <div style={{ marginTop: "0.5rem" }}>
                      {entry.tags.split(",").map((tag, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#ebf8ff",
                            color: "#1e40af",
                            padding: "2px 6px",
                            borderRadius: "10px",
                            fontSize: "0.75rem",
                            marginRight: "0.25rem"
                          }}
                        >
                          #{tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
