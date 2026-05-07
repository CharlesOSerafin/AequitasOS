const API_BASE_URL = "http://localhost:8000";

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

  if (!res.ok) throw new Error("Registration failed");

  return res.json();
}

export async function loginUser(email: string, password: string) {
  const formData = new URLSearchParams();

  formData.append("username", email);
  formData.append("password", password);

  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Login failed");

  return res.json();
}

export async function getCurrentUser(token: string) {
  const res = await fetch(`${API_BASE_URL}/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Unauthorized");

  return res.json();
}

export async function getWorkouts(token: string) {
  const res = await fetch(`${API_BASE_URL}/workouts/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch workouts");

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

  if (!res.ok) throw new Error("Failed to create workout");

  return res.json();
}

export async function updateWorkout(
  token: string,
  workoutId: number,
  data: {
    workout_type: string;
    duration_minutes: number;
    distance_meters?: number;
    intensity_rpe?: number;
    notes?: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update workout");

  return res.json();
}

export async function deleteWorkout(token: string, workoutId: number) {
  const res = await fetch(`${API_BASE_URL}/workouts/${workoutId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete workout");

  return res.json();
}

export async function getGoals(token: string) {
  const res = await fetch(`${API_BASE_URL}/goals/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch goals");

  return res.json();
}

export async function createGoal(
  token: string,
  data: {
    goal_type: string;
    title: string;
    target_value: number;
    current_value?: number;
    unit: string;
  }
) {
  const res = await fetch(`${API_BASE_URL}/goals/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to create goal");

  return res.json();
}

export async function deleteGoal(token: string, goalId: number) {
  const res = await fetch(`${API_BASE_URL}/goals/${goalId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to delete goal");

  return res.json();
}