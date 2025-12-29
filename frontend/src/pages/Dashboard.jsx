import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useSelector, useDispatch } from "react-redux";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import {
  fetchTasks,
  addTask,
  updateTask,
  deleteTask,
  startEdit,
  cancelEdit,
  setForm,
  resetForm,
  setError,
} from "../features/tasks/tasksSlice";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks, loading, error, formData, editingTask } = useSelector(
    (state) => state.tasks
  );
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchTasks());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleFormChange = (name, value) => {
    dispatch(setForm({ name, value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(setError(null));

    if (!formData.title.trim()) {
      dispatch(setError("Title is required."));
      return;
    }

    try {
      if (editingTask) {
        await dispatch(
          updateTask({ id: editingTask.id, data: formData })
        ).unwrap();
      } else {
        await dispatch(addTask(formData)).unwrap();
      }
      dispatch(resetForm());
    } catch (err) {
      dispatch(setError(err || "Operation failed."));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await dispatch(deleteTask(id)).unwrap();
    } catch (err) {
      dispatch(setError(err || "Failed to delete task."));
    }
  };

  const handleStatusChange = async (task, newStatus) => {
    try {
      await dispatch(
        updateTask({ id: task.id, data: { status: newStatus } })
      ).unwrap();
    } catch (err) {
      dispatch(setError(err || "Failed to update task status."));
    }
  };

  const handleEdit = (task) => {
    dispatch(startEdit(task));
  };

  const cancelEditHandler = () => {
    dispatch(cancelEdit());
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <TaskForm
          formData={formData}
          editingTask={editingTask}
          onChange={handleFormChange}
          onSubmit={handleSubmit}
          onCancel={cancelEditHandler}
        />

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            loading={loading}
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
