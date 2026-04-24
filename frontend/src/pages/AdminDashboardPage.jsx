import { useEffect, useState } from "react";
import NewsTable from "../components/NewsTable";
import { createNewsItem, deleteNewsItem, fetchNews } from "../services/api";

function AdminDashboardPage() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [label, setLabel] = useState("fake");
  const [submitting, setSubmitting] = useState(false);

  async function loadNews() {
    setLoading(true);
    setError("");

    try {
      const data = await fetchNews();
      setRows(data);
    } catch (requestError) {
      setRows([]);
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNews();
  }, []);

  async function handleCreate(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await createNewsItem({ title, content, label });
      setTitle("");
      setContent("");
      setLabel("fake");
      await loadNews();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(id) {
    try {
      await deleteNewsItem(id);
      await loadNews();
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Admin Dashboard</h2>
        <button
          type="button"
          onClick={loadNews}
          disabled={loading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh Dataset"}
        </button>
      </div>

      <form onSubmit={handleCreate} className="mt-4 grid gap-3 rounded-md bg-slate-50 p-4">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="News title"
          className="rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-slate-900"
          required
        />
        <textarea
          value={content}
          onChange={(event) => setContent(event.target.value)}
          placeholder="News content"
          className="min-h-28 rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-slate-900"
          required
        />
        <select
          value={label}
          onChange={(event) => setLabel(event.target.value)}
          className="w-44 rounded-md border border-slate-300 p-2 text-sm outline-none focus:border-slate-900"
        >
          <option value="fake">fake</option>
          <option value="true">true</option>
        </select>
        <button
          type="submit"
          disabled={submitting}
          className="w-fit rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {submitting ? "Saving..." : "Add News"}
        </button>
      </form>

      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

      <NewsTable rows={rows} onDelete={handleDelete} />
    </section>
  );
}

export default AdminDashboardPage;
