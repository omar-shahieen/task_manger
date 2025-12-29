import React from "react";
import TaskItem from "./TaskItem";

const TaskList = ({ tasks, loading, onStatusChange, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center py-8 text-gray-500">Loading tasks...</div>
    );
  }

  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No tasks yet. Create your first task above!
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onStatusChange={onStatusChange}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};

export default TaskList;
