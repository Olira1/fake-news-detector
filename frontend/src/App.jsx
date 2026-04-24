import { useState } from "react";
import { fetchFullHealth, getBackendUrl, predictNews } from "./services/api";

function App() {
  const [healthData, setHealthData] = useState(null);
  const [healthError, setHealthError] = useState("");
  const [healthLoading, setHealthLoading] = useState(false);

  const [text, setText] = useState("");
  const [predictionData, setPredictionData] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [predictionLoading, setPredictionLoading] = useState(false);

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

  async function handlePredict(event) {
    event.preventDefault();
    setPredictionLoading(true);
    setPredictionError("");

    try {
      const data = await predictNews(text.trim());
      setPredictionData(data);
    } catch (error) {
      setPredictionData(null);
      setPredictionError(error.message);
    } finally {
      setPredictionLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-900">Fake News Detector</h1>
          <p className="mt-2 text-sm text-slate-700">HELLO_WORLD_FRONTEND_OK</p>
          <p className="mt-1 text-xs text-slate-500">
            Backend URL: <span className="font-mono">{getBackendUrl()}</span>
          </p>
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

        <section className="rounded-xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Predict News</h2>
          <form onSubmit={handlePredict} className="mt-3 space-y-3">
            <textarea
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Paste news content here..."
              className="min-h-36 w-full rounded-md border border-slate-300 p-3 text-sm text-slate-900 outline-none focus:border-slate-900"
              required
            />

            <button
              type="submit"
              disabled={predictionLoading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {predictionLoading ? "Predicting..." : "Predict"}
            </button>
          </form>

          {predictionError ? (
            <p className="mt-3 text-sm text-red-600">{predictionError}</p>
          ) : null}

          {predictionData ? (
            <div className="mt-4 rounded-md bg-blue-50 p-4">
              <p className="text-sm text-slate-800">
                Prediction: <strong>{predictionData.prediction}</strong>
              </p>
              <p className="text-sm text-slate-800">
                Confidence: <strong>{predictionData.confidence}</strong>
              </p>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}

export default App;
