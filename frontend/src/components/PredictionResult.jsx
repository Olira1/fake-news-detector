function formatConfidence(value) {
  const num = Number(value);
  if (Number.isNaN(num)) {
    return "N/A";
  }
  return `${(num * 100).toFixed(2)}%`;
}

function PredictionResult({ data }) {
  if (!data) {
    return null;
  }

  return (
    <div className="mt-4 rounded-md bg-blue-50 p-4">
      <p className="text-sm text-slate-800">
        Prediction: <strong>{data.prediction}</strong>
      </p>
      <p className="text-sm text-slate-800">
        Confidence: <strong>{formatConfidence(data.confidence)}</strong>
      </p>
    </div>
  );
}

export default PredictionResult;
