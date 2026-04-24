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
        Confidence: <strong>{data.confidence}</strong>
      </p>
    </div>
  );
}

export default PredictionResult;
