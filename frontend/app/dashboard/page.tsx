"use client";

import { useEffect, useState } from "react";

import {
  createGoal,
  createWorkout,
  deleteGoal,
  deleteWorkout,
  getCurrentUser,
  getGoals,
  getWorkouts,
  updateWorkout,
} from "@/lib/api";

import { useRouter } from "next/navigation";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
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
  created_at: string;
};

type Goal = {
  id: number;
  goal_type: string;
  title: string;
  target_value: number;
  current_value: number;
  unit: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [workoutType, setWorkoutType] = useState("rowing");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [distanceMeters, setDistanceMeters] = useState("");
  const [intensityRpe, setIntensityRpe] = useState("");
  const [notes, setNotes] = useState("");

  const [goalType, setGoalType] = useState("distance");
  const [goalTitle, setGoalTitle] = useState("");
  const [goalTargetValue, setGoalTargetValue] = useState("");
  const [goalCurrentValue, setGoalCurrentValue] = useState("");
  const [goalUnit, setGoalUnit] = useState("meters");

  const [editingWorkoutId, setEditingWorkoutId] = useState<number | null>(null);
  const [editWorkoutType, setEditWorkoutType] = useState("");
  const [editDurationMinutes, setEditDurationMinutes] = useState("");
  const [editDistanceMeters, setEditDistanceMeters] = useState("");
  const [editIntensityRpe, setEditIntensityRpe] = useState("");
  const [editNotes, setEditNotes] = useState("");

  const workoutLoads = workouts.map((workout) => ({
    ...workout,
    load: workout.duration_minutes * (workout.intensity_rpe || 1),
  }));

  const totalWorkouts = workouts.length;

  const totalDistance = workouts.reduce(
    (sum, workout) => sum + (workout.distance_meters || 0),
    0
  );

  const totalMinutes = workouts.reduce(
    (sum, workout) => sum + workout.duration_minutes,
    0
  );

  const rpeWorkouts = workouts.filter((workout) => workout.intensity_rpe);

  const averageRpe =
    rpeWorkouts.length > 0
      ? rpeWorkouts.reduce(
          (sum, workout) => sum + (workout.intensity_rpe || 0),
          0
        ) / rpeWorkouts.length
      : 0;

  const trainingLoad = workoutLoads.reduce(
    (sum, workout) => sum + workout.load,
    0
  );

  const recentLoad = workoutLoads
    .slice(0, 7)
    .reduce((sum, workout) => sum + workout.load, 0);

  const averageWorkoutLoad =
    workoutLoads.length > 0 ? trainingLoad / workoutLoads.length : 0;

  const fatigueScore =
    averageWorkoutLoad > 0 ? recentLoad / averageWorkoutLoad : 0;

  const recoveryStatus =
    fatigueScore < 5 ? "Fresh" : fatigueScore < 9 ? "Balanced" : "Fatigued";

  const workoutChartData = workoutLoads.map((workout, index) => ({
    name: `${index + 1}`,
    load: workout.load,
  }));

  const workoutTypeData = Object.values(
    workouts.reduce((acc, workout) => {
      if (!acc[workout.workout_type]) {
        acc[workout.workout_type] = {
          name: workout.workout_type,
          value: 0,
        };
      }

      acc[workout.workout_type].value += 1;
      return acc;
    }, {} as Record<string, { name: string; value: number }>)
  );

  const weeklyVolumeData = Object.values(
    workouts.reduce((acc, workout) => {
      const date = new Date(workout.created_at);
      const weekLabel = `${date.getMonth() + 1}/${date.getDate()}`;

      if (!acc[weekLabel]) {
        acc[weekLabel] = {
          week: weekLabel,
          distanceKm: 0,
        };
      }

      acc[weekLabel].distanceKm += (workout.distance_meters || 0) / 1000;
      return acc;
    }, {} as Record<string, { week: string; distanceKm: number }>)
  );

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
        
        try {
          const goalData = await getGoals(token);
          setGoals(goalData);
        } catch {
          setGoals([]);
        }
      } catch {
        localStorage.removeItem("aequitas_token");
        router.push("/login");
      }
    }

    loadDashboard();
  }, [router]);

  async function handleCreateWorkout(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const newWorkout = await createWorkout(token, {
      workout_type: workoutType,
      duration_minutes: Number(durationMinutes),
      distance_meters: distanceMeters ? Number(distanceMeters) : undefined,
      intensity_rpe: intensityRpe ? Number(intensityRpe) : undefined,
      notes: notes || undefined,
    });

    setWorkouts([newWorkout, ...workouts]);

    setDurationMinutes("");
    setDistanceMeters("");
    setIntensityRpe("");
    setNotes("");
  }

  async function handleCreateGoal(e: React.FormEvent) {
    e.preventDefault();

    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const newGoal = await createGoal(token, {
      goal_type: goalType,
      title: goalTitle,
      target_value: Number(goalTargetValue),
      current_value: goalCurrentValue ? Number(goalCurrentValue) : 0,
      unit: goalUnit,
    });

    setGoals([newGoal, ...goals]);

    setGoalTitle("");
    setGoalTargetValue("");
    setGoalCurrentValue("");
    setGoalUnit("meters");
  }

  async function handleDeleteGoal(goalId: number) {
    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    await deleteGoal(token, goalId);

    setGoals(goals.filter((goal) => goal.id !== goalId));
  }

  async function handleDeleteWorkout(workoutId: number) {
    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    await deleteWorkout(token, workoutId);

    setWorkouts(workouts.filter((workout) => workout.id !== workoutId));
  }

  function startEditing(workout: Workout) {
    setEditingWorkoutId(workout.id);
    setEditWorkoutType(workout.workout_type);
    setEditDurationMinutes(String(workout.duration_minutes));
    setEditDistanceMeters(
      workout.distance_meters ? String(workout.distance_meters) : ""
    );
    setEditIntensityRpe(
      workout.intensity_rpe ? String(workout.intensity_rpe) : ""
    );
    setEditNotes(workout.notes || "");
  }

  function cancelEditing() {
    setEditingWorkoutId(null);
    setEditWorkoutType("");
    setEditDurationMinutes("");
    setEditDistanceMeters("");
    setEditIntensityRpe("");
    setEditNotes("");
  }

  async function handleUpdateWorkout(workoutId: number) {
    const token = localStorage.getItem("aequitas_token");

    if (!token) {
      router.push("/login");
      return;
    }

    const updatedWorkout = await updateWorkout(token, workoutId, {
      workout_type: editWorkoutType,
      duration_minutes: Number(editDurationMinutes),
      distance_meters: editDistanceMeters
        ? Number(editDistanceMeters)
        : undefined,
      intensity_rpe: editIntensityRpe ? Number(editIntensityRpe) : undefined,
      notes: editNotes || undefined,
    });

    setWorkouts(
      workouts.map((workout) =>
        workout.id === workoutId ? updatedWorkout : workout
      )
    );

    cancelEditing();
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
            <h1 className="text-3xl font-bold">Aequitas Dashboard</h1>

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
            <p className="text-sm text-gray-500">Total Workouts</p>
            <p className="text-2xl font-bold">{totalWorkouts}</p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Total Distance</p>
            <p className="text-2xl font-bold">
              {(totalDistance / 1000).toFixed(1)} km
            </p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Training Time</p>
            <p className="text-2xl font-bold">{totalMinutes} min</p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Average RPE</p>
            <p className="text-2xl font-bold">{averageRpe.toFixed(1)}</p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Training Load</p>
            <p className="text-2xl font-bold">{trainingLoad.toFixed(0)}</p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Recent Load</p>
            <p className="text-2xl font-bold">{recentLoad.toFixed(0)}</p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Fatigue Score</p>
            <p className="text-2xl font-bold">{fatigueScore.toFixed(1)}</p>
          </div>

          <div className="bg-white border rounded-xl p-5">
            <p className="text-sm text-gray-500">Recovery Status</p>
            <p className="text-2xl font-bold">{recoveryStatus}</p>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Create Goal</h2>

          <form
            onSubmit={handleCreateGoal}
            className="grid gap-4 md:grid-cols-2"
          >
            <select
              className="border p-3 rounded"
              value={goalType}
              onChange={(e) => setGoalType(e.target.value)}
            >
              <option value="distance">Distance</option>
              <option value="time">Time</option>
              <option value="load">Training Load</option>
              <option value="strength">Strength</option>
            </select>

            <input
              className="border p-3 rounded"
              placeholder="Goal title"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Target value"
              value={goalTargetValue}
              onChange={(e) => setGoalTargetValue(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Current value"
              value={goalCurrentValue}
              onChange={(e) => setGoalCurrentValue(e.target.value)}
            />

            <input
              className="border p-3 rounded md:col-span-2"
              placeholder="Unit, e.g. meters, minutes, kg"
              value={goalUnit}
              onChange={(e) => setGoalUnit(e.target.value)}
            />

            <button className="bg-black text-white p-3 rounded md:col-span-2">
              Save Goal
            </button>
          </form>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {goals.length === 0 ? (
            <div className="bg-white border rounded-xl p-6">
              <p className="text-gray-600">No goals created yet.</p>
            </div>
          ) : (
            goals.map((goal) => {
              const progress =
                goal.target_value > 0
                  ? Math.min(
                      (goal.current_value / goal.target_value) * 100,
                      100
                    )
                  : 0;

              return (
                <div
                  key={goal.id}
                  className="bg-white border rounded-xl p-6 space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm text-gray-500 capitalize">
                        {goal.goal_type}
                      </p>

                      <h3 className="text-lg font-semibold">
                        {goal.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="text-red-600 border border-red-300 rounded px-3 py-1"
                    >
                      Delete
                    </button>
                  </div>

                  <p className="text-gray-700">
                    {goal.current_value} / {goal.target_value} {goal.unit}
                  </p>

                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-black h-3 rounded-full"
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <p className="text-sm text-gray-500">
                    {progress.toFixed(1)}% complete
                  </p>
                </div>
              );
            })
          )}
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Log Workout</h2>

          <form
            onSubmit={handleCreateWorkout}
            className="grid gap-4 md:grid-cols-2"
          >
            <select
              className="border p-3 rounded"
              value={workoutType}
              onChange={(e) => setWorkoutType(e.target.value)}
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
              onChange={(e) => setDurationMinutes(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Distance meters"
              value={distanceMeters}
              onChange={(e) => setDistanceMeters(e.target.value)}
            />

            <input
              className="border p-3 rounded"
              placeholder="Intensity RPE 1-10"
              value={intensityRpe}
              onChange={(e) => setIntensityRpe(e.target.value)}
            />

            <textarea
              className="border p-3 rounded md:col-span-2"
              placeholder="Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />

            <button className="bg-black text-white p-3 rounded md:col-span-2">
              Save Workout
            </button>
          </form>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Training Load Trend</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={workoutChartData}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="load" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Weekly Volume Trend</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weeklyVolumeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="distanceKm" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white border rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-semibold">Workout Type Breakdown</h2>

          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={workoutTypeData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {workoutTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} />
                  ))}
                </Pie>

                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Workout History</h2>

          {workouts.length === 0 ? (
            <p className="text-gray-600">No workouts logged yet.</p>
          ) : (
            <div className="grid gap-4">
              {workouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-white border rounded-xl p-5"
                >
                  {editingWorkoutId === workout.id ? (
                    <div className="grid gap-3">
                      <select
                        className="border p-3 rounded"
                        value={editWorkoutType}
                        onChange={(e) => setEditWorkoutType(e.target.value)}
                      >
                        <option value="rowing">Rowing</option>
                        <option value="running">Running</option>
                        <option value="biking">Biking</option>
                        <option value="lifting">Lifting</option>
                        <option value="recovery">Recovery</option>
                      </select>

                      <input
                        className="border p-3 rounded"
                        value={editDurationMinutes}
                        onChange={(e) =>
                          setEditDurationMinutes(e.target.value)
                        }
                        placeholder="Duration minutes"
                      />

                      <input
                        className="border p-3 rounded"
                        value={editDistanceMeters}
                        onChange={(e) => setEditDistanceMeters(e.target.value)}
                        placeholder="Distance meters"
                      />

                      <input
                        className="border p-3 rounded"
                        value={editIntensityRpe}
                        onChange={(e) => setEditIntensityRpe(e.target.value)}
                        placeholder="Intensity RPE"
                      />

                      <textarea
                        className="border p-3 rounded"
                        value={editNotes}
                        onChange={(e) => setEditNotes(e.target.value)}
                        placeholder="Notes"
                      />

                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateWorkout(workout.id)}
                          className="bg-black text-white px-4 py-2 rounded"
                        >
                          Save
                        </button>

                        <button
                          onClick={cancelEditing}
                          className="border px-4 py-2 rounded bg-white"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <div>
                          <h3 className="font-semibold capitalize">
                            {workout.workout_type}
                          </h3>

                          <p className="text-sm text-gray-500">
                            {new Date(workout.created_at).toLocaleString()}
                          </p>
                        </div>

                        <span className="text-sm text-gray-500">
                          {workout.duration_minutes} min
                        </span>
                      </div>

                      <p className="text-gray-700 mt-2">
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
                        <p className="text-gray-600 mt-2">{workout.notes}</p>
                      )}

                      <div className="flex gap-3 mt-4">
                        <button
                          onClick={() => startEditing(workout)}
                          className="border px-4 py-2 rounded bg-white"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteWorkout(workout.id)}
                          className="border border-red-300 text-red-600 px-4 py-2 rounded bg-white"
                        >
                          Delete
                        </button>
                      </div>
                    </>
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