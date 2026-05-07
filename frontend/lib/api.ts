const API_BASE_URL = "http://127.0.0.1:8000";

export async function registerUser(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Registration failed");
  }

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.detail || "Login failed");
  }

  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Could not fetch current user");
  }

  return res.json();
}

export async function createWorkout(
  token: string,
  data: {
    workout_type: string;
    duration_minutes: number;
    distance_meters?: number;
    intensity_rpe?: number;
    notes?: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/workouts/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Could not create workout");
  }

  return res.json();
}

export async function getWorkouts(token: string) {
  const res = await fetch(`${API_BASE_URL}/workouts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Could not fetch workouts");
  }

  return res.json();
}