import AsyncStorage from '@react-native-async-storage/async-storage';

export const API_BASE_URL = 'http://103.59.160.152:15153';

const TOKEN_KEY = 'streetlight_access_token';
const USER_KEY = 'streetlight_user';

async function parseResponse(response) {
  let payload = null;

  try {
    payload = await response.json();
  } catch (e) {
    payload = null;
  }

  if (!response.ok) {
    const message = payload?.detail || payload?.message || 'Request gagal.';
    const error = new Error(message);
    error.status = response.status;
    error.payload = payload;
    throw error;
  }

  return payload;
}

export const getAccessToken = async () => AsyncStorage.getItem(TOKEN_KEY);

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const apiRequest = async (path, options = {}) => {
  const token = await getAccessToken();
  const headers = {
    Accept: 'application/json',
    ...(options.body ? { 'Content-Type': 'application/json' } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  return parseResponse(response);
};

export const loginUser = async (email, password) => {
  const login = await apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

  await AsyncStorage.setItem(TOKEN_KEY, login.access_token);

  const user = await apiRequest('/api/v1/auth/me');
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

  return { user, role: user.role };
};

export const registerMahasiswa = async (email, password, displayName = '') => (
  apiRequest('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify({
      email,
      password,
      display_name: displayName,
    }),
  })
);

export const registerAndLoginMahasiswa = async (email, password, displayName = '') => {
  await registerMahasiswa(email, password, displayName);
  return loginUser(email, password);
};

export const refreshCurrentUser = async () => {
  const token = await getAccessToken();

  if (!token) {
    return null;
  }

  try {
    const user = await apiRequest('/api/v1/auth/me');
    await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
    return user;
  } catch (e) {
    await logoutUser();
    return null;
  }
};

export const logoutUser = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};
