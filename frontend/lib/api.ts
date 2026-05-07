const API_BASE_URL = "http://127.0.0.1:8000";

export async function registerUser(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
}