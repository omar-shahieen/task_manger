import React, { useReducer, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import axios from "../utils/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";

const initialState = {
  tasks: [],
  loading: true,
  error: "",
  formData: { title: "", description: "", status: "pending" },
  editingTask: null,
};

function reducer(state, action) {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: "" };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, tasks: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    case "SET_FORM":
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.name]: action.payload.value,
        },
      };
    case "RESET_FORM":
      return {
        ...state,
        formData: { title: "", description: "", status: "pending" },
      };
    case "START_EDIT":
      return {
        ...state,
        editingTask: action.payload,
        formData: {
          title: action.payload.title,
          description: action.payload.description || "",
          status: action.payload.status,
        },
      };
    case "CANCEL_EDIT":
      return {
        ...state,
        editingTask: null,
        formData: { title: "", description: "", status: "pending" },
      };
    case "ADD_TASK":
      return { ...state, tasks: [action.payload, ...state.tasks] };
    case "UPDATE_TASK":
      return {
        ...state,
        tasks: state.tasks.map((t) =>
          t.id === action.payload.id ? action.payload : t
        ),
        editingTask: null,
      };
    case "DELETE_TASK":
      return {
        ...state,
        tasks: state.tasks.filter((t) => t.id !== action.payload),
      };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

const Dashboard = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const response = await axios.get("/tasks");
      dispatch({ type: "FETCH_SUCCESS", payload: response.data.tasks });
    } catch (err) {
      dispatch({ type: "FETCH_ERROR", payload: "Failed to fetch tasks." });
    }
  };

  const handleFormChange = (name, value) => {
    dispatch({ type: "SET_FORM", payload: { name, value } });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", payload: "" });

    if (!state.formData.title.trim()) {
      dispatch({ type: "SET_ERROR", payload: "Title is required." });
      return;
    }

    try {
      if (state.editingTask) {
        const response = await axios.put(
          `/tasks/${state.editingTask.id}`,
          state.formData
        );
        dispatch({ type: "UPDATE_TASK", payload: response.data.task });
      } else {
        const response = await axios.post("/tasks", state.formData);
        dispatch({ type: "ADD_TASK", payload: response.data.task });
      }
      dispatch({ type: "RESET_FORM" });
    } catch (err) {
      dispatch({
        type: "SET_ERROR",
        payload: err.response?.data?.error || "Operation failed.",
      });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`/tasks/${id}`);
      dispatch({ type: "DELETE_TASK", payload: id });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to delete task." });
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      const response = await axios.put(`/tasks/${task.id}`, {
        status: newStatus,
      });
      dispatch({ type: "UPDATE_TASK", payload: response.data.task });
    } catch (err) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update task status." });
    }
  };

  const handleEdit = (task) => {
    dispatch({ type: "START_EDIT", payload: task });
  };

  const cancelEdit = () => {
    dispatch({ type: "CANCEL_EDIT" });
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">Task Manager</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Welcome, {user?.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {state.error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {state.error}
          </div>
        )}

        <TaskForm
          formData={state.formData}
          editingTask={state.editingTask}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={cancelEdit}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList
            tasks={state.tasks}
            loading={state.loading}
            onStatusChange={handleStatusChange}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
