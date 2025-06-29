import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { db } from "~/utils/db.server";

export const meta: MetaFunction = () => {
    return [
        { title: "New Entry - My Diary" },
        { name: "description", content: "Write a new diary entry" },
    ];
};

export const action = async ({ request }: ActionFunctionArgs) => {
    const formData = await request.formData();
    const title = formData.get("title") as string;
    const content = formData.get("content") as string;
    const mood = formData.get("mood") as string;
    const tags = formData.get("tags") as string;

    // Simple validation
    const errors: { title?: string; content?: string } = {};

    if (!title || title.trim().length === 0) {
        errors.title = "Title is required";
    }

    if (!content || content.trim().length === 0) {
        errors.content = "Content is required";
    }

    if (Object.keys(errors).length > 0) {
        return json({ errors }, { status: 400 });
    }

    // Create the diary entry
    await db.diaryEntry.create({
        data: {
            title: title.trim(),
            content: content.trim(),
            mood: mood || null,
            tags: tags && tags.trim().length > 0 ? tags.trim() : null,
        },
    });

    return redirect("/");
};

export default function NewEntry() {
    const actionData = useActionData<typeof action>();

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
                <h1 style={{ color: "#4a5568", marginBottom: "0.5rem" }}>✍️ Write New Entry</h1>
                <p style={{ color: "#718096" }}>Share your thoughts, feelings, and memories</p>
            </header>

            <Form method="post" style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                <div>
                    <label
                        htmlFor="title"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#4a5568"
                        }}
                    >
                        Title *
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                        }}
                        placeholder="What's on your mind today?"
                    />
                    {actionData?.errors.title && (
                        <p style={{ color: "#e53e3e", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                            {actionData.errors.title}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="mood"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#4a5568"
                        }}
                    >
                        Mood (optional)
                    </label>
                    <select
                        id="mood"
                        name="mood"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            boxSizing: "border-box",
                            backgroundColor: "white"
                        }}
                    >
                        <option value="">Select your mood...</option>
                        <option value="😊 Happy">😊 Happy</option>
                        <option value="😢 Sad">😢 Sad</option>
                        <option value="😤 Frustrated">😤 Frustrated</option>
                        <option value="😌 Peaceful">😌 Peaceful</option>
                        <option value="🤔 Thoughtful">🤔 Thoughtful</option>
                        <option value="😴 Tired">😴 Tired</option>
                        <option value="🎉 Excited">🎉 Excited</option>
                        <option value="😰 Anxious">😰 Anxious</option>
                        <option value="❤️ Grateful">❤️ Grateful</option>
                    </select>
                </div>

                <div>
                    <label
                        htmlFor="content"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#4a5568"
                        }}
                    >
                        Content *
                    </label>
                    <textarea
                        id="content"
                        name="content"
                        required
                        rows={8}
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            resize: "vertical",
                            boxSizing: "border-box"
                        }}
                        placeholder="Write about your day, thoughts, experiences..."
                    />
                    {actionData?.errors.content && (
                        <p style={{ color: "#e53e3e", fontSize: "0.875rem", marginTop: "0.25rem" }}>
                            {actionData.errors.content}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        htmlFor="tags"
                        style={{
                            display: "block",
                            marginBottom: "0.5rem",
                            fontWeight: "600",
                            color: "#4a5568"
                        }}
                    >
                        Tags (optional)
                    </label>
                    <input
                        type="text"
                        id="tags"
                        name="tags"
                        style={{
                            width: "100%",
                            padding: "12px",
                            border: "1px solid #e2e8f0",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            boxSizing: "border-box"
                        }}
                        placeholder="work, family, travel, goals (comma-separated)"
                    />
                    <p style={{ color: "#718096", fontSize: "0.75rem", marginTop: "0.25rem" }}>
                        Separate multiple tags with commas
                    </p>
                </div>

                <div style={{ display: "flex", gap: "1rem", paddingTop: "1rem" }}>
                    <button
                        type="submit"
                        style={{
                            backgroundColor: "#4299e1",
                            color: "white",
                            padding: "12px 24px",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "1rem",
                            cursor: "pointer",
                            fontWeight: "600"
                        }}
                    >
                        💾 Save Entry
                    </button>
                    <Link
                        to="/"
                        style={{
                            backgroundColor: "#e2e8f0",
                            color: "#4a5568",
                            padding: "12px 24px",
                            borderRadius: "6px",
                            textDecoration: "none",
                            fontSize: "1rem",
                            fontWeight: "600",
                            display: "inline-block"
                        }}
                    >
                        Cancel
                    </Link>
                </div>
            </Form>
        </div>
    );
} 