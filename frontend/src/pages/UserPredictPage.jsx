import { useState } from "react";
import PredictionResult from "../components/PredictionResult";
import { fetchPredictions, predictNews } from "../services/api";

function UserPredictPage() {
  const [text, setText] = useState("");
  const [predictionData, setPredictionData] = useState(null);
  const [predictionError, setPredictionError] = useState("");
  const [predictionLoading, setPredictionLoading] = useState(false);

  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);

  async function handlePredict(event) {
    event.preventDefault();
    setPredictionLoading(true);
    setPredictionError("");

    try {
      const data = await predictNews(text.trim());
      setPredictionData(data);
      setText("");
    } catch (error) {
      setPredictionData(null);
      setPredictionError(error.message);
    } finally {
      setPredictionLoading(false);
    }
  }

  async function loadHistory() {
    setHistoryLoading(true);
    setHistoryError("");

    try {
      const data = await fetchPredictions();
      setHistory(data);
    } catch (error) {
      setHistory([]);
      setHistoryError(error.message);
    } finally {
      setHistoryLoading(false);
    }
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">User Prediction</h2>
        <button
          type="button"
          onClick={loadHistory}
          disabled={historyLoading}
          className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {historyLoading ? "Loading..." : "Load Prediction History"}
        </button>
      </div>

      <form onSubmit={handlePredict} className="mt-4 space-y-3">
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

      {predictionError ? <p className="mt-3 text-sm text-red-600">{predictionError}</p> : null}
      <PredictionResult data={predictionData} />

      {historyError ? <p className="mt-4 text-sm text-red-600">{historyError}</p> : null}

      {history.length ? (
        <div className="mt-4 rounded-md bg-slate-100 p-3">
          <p className="text-sm font-medium text-slate-800">Recent Predictions</p>
          <ul className="mt-2 space-y-2 text-xs text-slate-700">
            {history.slice(0, 8).map((item) => (
              <li key={item.id} className="rounded bg-white p-2">
                <p>
                  <strong>{item.prediction}</strong> ({item.confidence}) -{" "}
                  {new Date(item.created_at).toLocaleString()}
                </p>
                <p className="mt-1 text-slate-500">{item.input_text}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

export default UserPredictPage;
