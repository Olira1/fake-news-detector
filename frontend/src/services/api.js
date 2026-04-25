const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL ||
  (import.meta.env.DEV
    ? "http://localhost:5000"
    : "https://fake-news-detector-backend-4slm.onrender.com");

async function request(path, options = {}) {
  const response = await fetch(`${BACKEND_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data?.message || `Request failed with ${response.status}`);
  }

  return data;
}

export function getBackendUrl() {
  return BACKEND_URL;
}

export function fetchFullHealth() {
  return request("/health/full");
}

export function predictNews(text) {
  return request("/api/predict", {
    method: "POST",
    body: JSON.stringify({ text }),
  });
}

export function fetchNews() {
  return request("/api/news");
}

export function createNewsItem(payload) {
  return request("/api/news", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function deleteNewsItem(id) {
  return request(`/api/news/${id}`, {
    method: "DELETE",
  });
}

export function fetchPredictions() {
  return request("/api/predictions");
}

export function retrainModelFromNews() {
  return request("/api/ml/retrain", {
    method: "POST",
  });
}
