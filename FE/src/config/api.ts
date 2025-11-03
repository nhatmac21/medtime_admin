// API Base URL
export const API_BASE_URL = 'https://medtime-be.onrender.com/api';

// Auth endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REGISTER: `${API_BASE_URL}/auth/register`,
  REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

// User endpoints
export const USER_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/user`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/user/${id}`,
  UPDATE: (id: number) => `${API_BASE_URL}/user/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/user/${id}`,
};

// Medicine endpoints
export const MEDICINE_ENDPOINTS = {
  GET_ALL: `${API_BASE_URL}/medicine`,
  GET_BY_ID: (id: number) => `${API_BASE_URL}/medicine/${id}`,
  CREATE: `${API_BASE_URL}/medicine`,
  UPDATE: (id: number) => `${API_BASE_URL}/medicine/${id}`,
  DELETE: (id: number) => `${API_BASE_URL}/medicine/${id}`,
};

// Statistics endpoints
export const STATISTICS_ENDPOINTS = {
  DASHBOARD: `${API_BASE_URL}/statistics/dashboard`,
  TRENDS: `${API_BASE_URL}/statistics/trends`,
};

// Admin Payment endpoints
export const ADMIN_PAYMENT_ENDPOINTS = {
  SUMMARY: `${API_BASE_URL}/admin/payments/summary`,
  DAILY_REVENUE: `${API_BASE_URL}/admin/payments/daily-revenue`,
  PLAN_BREAKDOWN: `${API_BASE_URL}/admin/payments/plan-breakdown`,
  STATUS_BREAKDOWN: `${API_BASE_URL}/admin/payments/status-breakdown`,
  TOP_CUSTOMERS: `${API_BASE_URL}/admin/payments/top-customers`,
  RECENT_TRANSACTIONS: `${API_BASE_URL}/admin/payments/recent-transactions`,
};
