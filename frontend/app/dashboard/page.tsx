"use client";

import { useEffect, useState } from "react";
import {
  createWorkout,
  getCurrentUser,
  getWorkouts,
} from "@/lib/api";

import { useRouter } from "next/navigation";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

type User = {
  email: string;
  first_name?: string;
};

type Workout = {
  id: number;
  workout_type: string;
  duration_minutes: number;
  distance_meters?: number;
  intensity_rpe?: number;
  notes?: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  const [workoutType, setWorkoutType] = useState("rowing");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [distanceMeters, setDistanceMeters] = useState("");
  const [intensityRpe, setIntensityRpe] = useState("");
  const [notes, setNotes] = useState("");

  const totalWorkouts = workouts.length;

  const totalDistance = workouts.reduce(
    (sum, workout) => sum + (workout.distance_meters || 0),
    0
  );

  const totalMinutes = workouts.reduce(
    (sum, workout) => sum + workout.duration_minutes,
    0
  );

  const rpeWorkouts = workouts.filter(
    (workout) => workout.intensity_rpe
  );

  const averageRpe =
    rpeWorkouts.length > 0
      ? rpeWorkouts.reduce(
          (sum, workout) => sum + (workout.intensity_rpe || 0),
          0
        ) / rpeWorkouts.length
      : 0;

  const trainingLoad = workouts.reduce(
    (sum, workout) =>
      sum + workout.duration_minutes * (workout.intensity_rpe || 1),
    0
  );

  const workoutChartData = workouts.map((workout, index) => ({
    name: `${index + 1}`,
    load:
      workout.duration_minutes *
      (workout.intensity_rpe || 1),
  }));

  useEffect(() => {
    async function loadDashboard() {
      const token = localStorage.getItem("aequitas_token");

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const userData = await getCurrentUser(token);
        const workoutData = await getWorkouts(token);

        setUser(userData);
        setWorkouts(workoutData);
      } catch {
        localStorage.removeItem("aequitas_token");
        router.push("/login");
      }
    }

    loadDashboard();
  }, [router]);

  async function handleCreateWorkout(
    e: React.FormEvent
  ) {
    e.preventDefault();

    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const newWorkout = await createWorkout(token, {
      workout_type: workoutType,
      duration_minutes: Number(durationMinutes),
      distance_meters: distanceMeters
        ? Number(distanceMeters)
        : undefined,
      intensity_rpe: intensityRpe
        ? Number(intensityRpe)
        : undefined,
      notes: notes || undefined,
    });

    setWorkouts([newWorkout, ...workouts]);

    setDurationMinutes("");
    setDistanceMeters("");
    setIntensityRpe("");
    setNotes("");
  }

  function logout() {
    localStorage.removeItem("aequitas_token");
    router.push("/login");
  }

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              Aequitas Dashboard
            </h1>

            {user && (
              <p className="text-gray-600">
                Welcome, {user.first_name || user.email}
              </p>
            )}
          </div>

          <button
            onClick={logout}
            className="border px-4 py-2 rounded bg-white"
          >
            Logout
          </button>
        </div>

        <section className="grid gap-4 md:grid-cols-5">
          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Total Workouts
            </p>

            <p className="text-2xl font-bold">
              {totalWorkouts}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Total Distance
            </p>

            <p className="text-2xl font-bold">
              {(totalDistance / 1000).toFixed(1)} km
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Training Time
            </p>

            <p className="text-2xl font-bold">
              {totalMinutes} min
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Average RPE
            </p>

            <p className="text-2xl font-bold">
              {averageRpe.toFixed(1)}
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">
              Training Load
            </p>

            <p className="text-2xl font-bold">
              {trainingLoad.toFixed(0)}
            </p>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Log Workout
          </h2>

          <form
            onSubmit={handleCreateWorkout}
            className="grid gap-4 md:grid-cols-2"
          >
            <select
              className="border p-3 rounded"
              value={workoutType}
              onChange={(e) =>
                setWorkoutType(e.target.value)
              }
            >
              <option value="rowing">Rowing</option>
              <option value="running">Running</option>
              <option value="biking">Biking</option>
              <option value="lifting">Lifting</option>
              <option value="recovery">Recovery</option>
            </select>

            <input
              className="border p-3 rounded"
              placeholder="Duration minutes"
              value={durationMinutes}
              onChange={(e) =>
                setDurationMinutes(e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Distance meters"
              value={distanceMeters}
              onChange={(e) =>
                setDistanceMeters(e.target.value)
              }
            />

            <input
              className="border p-3 rounded"
              placeholder="Intensity RPE 1-10"
              value={intensityRpe}
              onChange={(e) =>
                setIntensityRpe(e.target.value)
              }
            />

            <textarea
              className="border p-3 rounded md:col-span-2"
              placeholder="Notes"
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
            />

            <button className="bg-black text-white p-3 rounded md:col-span-2">
              Save Workout
            </button>
          </form>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">
            Training Load Trend
          </h2>

          <div className="h-80">
            <ResponsiveContainer
              width="100%"
              height="100%"
            >
              <BarChart data={workoutChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />

                <Bar
                  dataKey="load"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">
            Workout History
          </h2>

          {workouts.length === 0 ? (
            <p className="text-gray-600">
              No workouts logged yet.
            </p>
          ) : (
            <div className="grid gap-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white border rounded-xl p-5"
                >
                  <div className="flex justify-between">
                    <h3 className="font-semibold capitalize">
                      {workout.workout_type}
                    </h3>

                    <span className="text-sm text-gray-500">
                      {workout.duration_minutes} min
                    </span>
                  </div>

                  <p className="text-gray-700">
                    {workout.distance_meters
                      ? `${workout.distance_meters} meters`
                      : "No distance"}
                  </p>

                  {workout.intensity_rpe && (
                    <p className="text-gray-700">
                      RPE: {workout.intensity_rpe}/10
                    </p>
                  )}

                  {workout.notes && (
                    <p className="text-gray-600 mt-2">
                      {workout.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}