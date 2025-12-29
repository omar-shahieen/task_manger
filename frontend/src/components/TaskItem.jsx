import React from "react";

const getStatusColor = (status) => {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "in_progress":
      return "bg-blue-100 text-blue-800";
    case "done":
      return "bg-green-100 text-green-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "pending":
      return "Pending";
    case "in_progress":
      return "In Progress";
    case "done":
      return "Done";
    default:
      return status;
  }
};

const TaskItem = ({ task, onStatusChange, onEdit, onDelete }) => {
  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
            task.status
          )}`}
        >
          {getStatusText(task.status)}
        </span>
      </div>
      {task.description && (
        <p className="text-gray-600 mb-3">{task.description}</p>
      )}
      <div className="text-xs text-gray-400 mb-3">
        Created: {new Date(task.created_at).toLocaleDateString()}
      </div>
      <div className="flex flex-wrap gap-2">
        <select
          value={task.status}
          onChange={(e) => onStatusChange(task, e.target.value)}
          className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <button
          onClick={() => onEdit(task)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition text-sm"
        >
          Edit
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
