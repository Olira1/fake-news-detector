import { useState } from "react";
import AdminDashboardPage from "./pages/AdminDashboardPage";
import UserPredictPage from "./pages/UserPredictPage";
import { fetchFullHealth, getBackendUrl } from "./services/api";

function App() {
  const [activeTab, setActiveTab] = useState("user");
  const [healthData, setHealthData] = useState(null);
  const [healthError, setHealthError] = useState("");
  const [healthLoading, setHealthLoading] = useState(false);

  async function handleCheckHealth() {
    setHealthLoading(true);
    setHealthError("");

    try {
      const data = await fetchFullHealth();
      setHealthData(data);
    } catch (error) {
      setHealthData(null);
      setHealthError(error.message);
    } finally {
      setHealthLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Fake News Detector</h1>
          <p className="mt-2 text-sm text-slate-700">HELLO_WORLD_FRONTEND_OK</p>
          <p className="mt-1 text-xs text-slate-500">
            Backend URL: <span className="font-mono">{getBackendUrl()}</span>
          </p>
        </section>

        <section className="rounded-xl bg-white p-3 shadow-sm">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              User Page
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("admin")}
              className={`rounded-md px-4 py-2 text-sm font-medium ${
                activeTab === "admin"
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-700"
              }`}
            >
              Admin Dashboard
            </button>
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">System Health Check</h2>
            <button
              type="button"
              onClick={handleCheckHealth}
              disabled={healthLoading}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {healthLoading ? "Checking..." : "Check /health/full"}
            </button>
          </div>

          {healthError ? (
            <p className="mt-3 text-sm text-red-600">{healthError}</p>
          ) : null}

          {healthData ? (
            <pre className="mt-3 overflow-x-auto rounded-md bg-slate-100 p-3 text-xs text-slate-800">
              {JSON.stringify(healthData, null, 2)}
            </pre>
          ) : null}
        </section>

        {activeTab === "user" ? <UserPredictPage /> : <AdminDashboardPage />}
      </div>
    </main>
  );
}

export default App;
