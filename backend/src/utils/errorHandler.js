export function notFoundHandler(_req, res) {
  res.status(404).json({ error: "Not Found" });
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const payload = {
    error: err.message || "Internal Server Error",
  };

  if (err.errors) {
    payload.details = err.errors;
  }

  console.error("[ERROR]", status, payload);

  res.status(status).json(payload);
}

