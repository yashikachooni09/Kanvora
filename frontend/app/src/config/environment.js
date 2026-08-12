const environment = {
  api: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  backendUrl: (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace('/api', ''),
};

export const getFullImageUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("/uploads")) return `${environment.backendUrl}${url}`;
  return url;
};

export default environment;
