import type { LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const loader = async ({ params }: LoaderFunctionArgs) => {
    const entryId = params.id;

    if (!entryId) {
        throw new Response("Entry ID is required", { status: 400 });
    }

    const entry = await db.diaryEntry.findUnique({
        where: { id: entryId },
    });

    if (!entry) {
        throw new Response("Entry not found", { status: 404 });
    }

    return json({ entry });
};

export const meta: MetaFunction<typeof loader> = ({ data }) => {
    return [
        { title: data?.entry.title ? `${data.entry.title} - My Diary` : "Entry - My Diary" },
        { name: "description", content: data?.entry.content.substring(0, 150) || "A diary entry" },
    ];
};

export default function EntryDetail() {
    const { entry } = useLoaderData<typeof loader>();

    return (
        <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.8", maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
            <header style={{ marginBottom: "2rem" }}>
                <Link
                    to="/"
                    style={{
                        color: "#4299e1",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        display: "inline-block",
                        marginBottom: "1rem"
                    }}
                >
                    ← Back to Diary
                </Link>
            </header>

            <article style={{
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                padding: "2rem"
            }}>
                <header style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "0.5rem" }}>
                        <h1 style={{
                            color: "#2d3748",
                            fontSize: "2rem",
                            fontWeight: "700",
                            margin: "0"
                        }}>
                            {entry.title}
                        </h1>
                        {entry.mood && (
                            <span style={{
                                backgroundColor: "#e6fffa",
                                color: "#047857",
                                padding: "4px 12px",
                                borderRadius: "16px",
                                fontSize: "1rem",
                                fontWeight: "500"
                            }}>
                                {entry.mood}
                            </span>
                        )}
                    </div>

                    <div style={{ color: "#718096", fontSize: "0.875rem" }}>
                        <span>📅 {new Date(entry.createdAt).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                        })}</span>
                        {entry.updatedAt !== entry.createdAt && (
                            <span style={{ marginLeft: "1rem" }}>
                                ✏️ Updated {new Date(entry.updatedAt).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit"
                                })}
                            </span>
                        )}
                    </div>
                </header>

                <main style={{ marginBottom: "1.5rem" }}>
                    <div style={{
                        color: "#4a5568",
                        fontSize: "1.125rem",
                        lineHeight: "1.7",
                        whiteSpace: "pre-wrap" // Preserve line breaks
                    }}>
                        {entry.content}
                    </div>
                </main>

                {entry.tags && (
                    <footer>
                        <div style={{
                            borderTop: "1px solid #e2e8f0",
                            paddingTop: "1rem",
                            marginTop: "1.5rem"
                        }}>
                            <p style={{
                                color: "#718096",
                                fontSize: "0.875rem",
                                marginBottom: "0.5rem",
                                fontWeight: "600"
                            }}>
                                Tags:
                            </p>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
                                {entry.tags.split(",").map((tag, index) => (
                                    <span
                                        key={index}
                                        style={{
                                            backgroundColor: "#ebf8ff",
                                            color: "#1e40af",
                                            padding: "4px 12px",
                                            borderRadius: "12px",
                                            fontSize: "0.875rem",
                                            fontWeight: "500"
                                        }}
                                    >
                                        #{tag.trim()}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </footer>
                )}
            </article>

            <div style={{
                marginTop: "2rem",
                textAlign: "center",
                padding: "1rem",
                backgroundColor: "#f7fafc",
                borderRadius: "8px",
                border: "1px solid #e2e8f0"
            }}>
                <p style={{ color: "#718096", fontSize: "0.875rem", marginBottom: "1rem" }}>
                    Want to add more memories?
                </p>
                <Link
                    to="/entries/new"
                    style={{
                        backgroundColor: "#4299e1",
                        color: "white",
                        padding: "10px 20px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        fontSize: "0.875rem",
                        fontWeight: "600",
                        display: "inline-block"
                    }}
                >
                    ✍️ Write New Entry
                </Link>
            </div>
        </div>
    );
} 