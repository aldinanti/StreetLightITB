import { apiRequest } from './authService';

export const getNodes = async () => apiRequest('/api/v1/nodes');

export const createReport = async ({ nodeId, issueType, severity, description, photoUrl = null }) => (
  apiRequest('/api/v1/reports', {
    method: 'POST',
    body: JSON.stringify({
      node_id: nodeId,
      issue_type: issueType,
      severity,
      description,
      photo_url: photoUrl,
    }),
  })
);

export const getAdminReports = async ({ page = 1, limit = 50 } = {}) => (
  apiRequest(`/api/v1/admin/reports?page=${page}&limit=${limit}`)
);

export const getMyReports = async ({ page = 1, limit = 50, status } = {}) => {
  const params = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) {
    params.append('status', status);
  }

  return apiRequest(`/api/v1/reports/me?${params.toString()}`);
};

export const getTelemetryHistory = async (nodeId, { page = 1, limit = 20 } = {}) => (
  apiRequest(`/api/v1/telemetry/${encodeURIComponent(nodeId)}/history?page=${page}&limit=${limit}`)
);
