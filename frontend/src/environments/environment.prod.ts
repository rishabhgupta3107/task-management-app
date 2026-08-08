// Production environment. An empty apiUrl means the API is served from the same origin
// (e.g. behind a reverse proxy), so requests go to /api/... on the current host.
export const environment = {
  production: true,
  apiUrl: '',
};
