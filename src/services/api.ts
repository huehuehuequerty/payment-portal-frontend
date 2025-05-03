
import axios from 'axios';
import { toast } from 'sonner';

const API_URL = 'http://localhost:3000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const message = error.response?.data?.message || 'An error occurred';
    toast.error(message);
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: async (username: string, password: string) => {
    const response = await api.post('/user/login', { username, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', username);
    }
    return response.data;
  },
  
  register: async (username: string, password: string) => {
    const response = await api.post('/user/register', { username, password });
    return response.data;
  },
  
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  },
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
  
  getUsername: () => {
    return localStorage.getItem('username');
  }
};

// Payment services
export const paymentService = {
  createPayment: async (data: { 
    school_id: string, 
    trustee_id: string, 
    student_info?: string, 
    amount: number, 
    callback_url: string, 
    gateway: string 
  }) => {
    const response = await api.post('/user/create-payment', data);
    return response.data;
  },
  
  checkStatus: async (collect_request_id: string, school_id: string) => {
    const response = await api.get(`/user/check-status/${collect_request_id}`, {
      params: { school_id }
    });
    return response.data;
  }
};

// Transaction services
export const transactionService = {
  getTransactions: async (params?: { 
    page?: number, 
    limit?: number, 
    sort?: string, 
    order?: 'asc' | 'desc' 
  }) => {
    const response = await api.get('/user/transactions', { params });
    return response.data;
  },
  
  getSchoolTransactions: async (schoolId: string) => {
    const response = await api.get(`/user/transactions/school/${schoolId}`);
    return response.data;
  },
  
  getTransactionStatus: async (orderId: string) => {
    const response = await api.get(`/user/transaction-status/${orderId}`);
    return response.data;
  }
};

export default api;
