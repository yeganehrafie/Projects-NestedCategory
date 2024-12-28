import React, { useState } from "react";
import InputParent from "./inputParent";

const TaskList = () => {
  const initialLists = [
    {
      id: "1",
      name: "Task 1",
      children: [],
    },
  ];

  const [tasks, setTasks] = useState(initialLists);
  const [copiedTasks, setCopiedTasks] = useState([]);

  const addTask = (id, taskName) => {
    if (!taskName.trim()) return;

    const newTask = { id: Date.now().toString(), name: taskName, children: [] };

    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, children: [...(task.children || []), newTask] };
      }
      if (task.children) {
        return {
          ...task,
          children: addTaskToChildren(task.children, id, newTask),
        };
      }
      return task;
    });

    setTasks(updatedTasks);
  };

  const addTaskToChildren = (children, parentId, newTask) => {
    return children.map((child) => {
      if (child.id === parentId) {
        return { ...child, children: [...(child.children || []), newTask] };
      } else if (child.children.length > 0) {
        return {
          ...child,
          children: addTaskToChildren(child.children, parentId, newTask),
        };
      }
      return child;
    });
  };

  const deleteTask = (tasks, id) => {
    return tasks.reduce((acc, task) => {
      if (task.id === id) {
        return acc; // حذف تسک
      }
      if (task.children) {
        task.children = deleteTask(task.children, id); // حذف از فرزندان
      }
      acc.push(task);
      return acc;
    }, []);
  };

  const handleDeleted = (id) => {
    const updatedTasks = deleteTask(tasks, id);
    setTasks(updatedTasks);
  };

  const updateTask = (tasks, id, newTaskName) => {
    return tasks.map((task) => {
      if (task.id === id) {
        return { ...task, name: newTaskName }; // به‌روزرسانی نام تسک
      }
      if (task.children) {
        task.children = updateTask(task.children, id, newTaskName);
      }
      return task;
    });
  };

  const handleUpdate = (id) => {
    const newTaskName = prompt("Enter new task name:");
    if (newTaskName && newTaskName.trim()) {
      const updatedTasks = updateTask(tasks, id, newTaskName);
      setTasks(updatedTasks);
    }
  };

  const deepCopyTask = (task) => {
    return {
      ...task,
      id: Date.now().toString(), // ایجاد ID یکتا برای تسک کپی‌شده
      children: task.children ? task.children.map(deepCopyTask) : [],
    };
  };

  const handleCopy = (task) => {
    const copiedTask = deepCopyTask(task);
    setCopiedTasks((prev) => [...prev, copiedTask]);
    alert(`Copied task: ${task.name} with all its children and grandchildren`);
  };

  const addCopiedTask = (id, taskName) => {
    if (!taskName.trim()) return;

    const newTask = { id: Date.now().toString(), name: taskName, children: [] };

    const updatedCopiedTasks = copiedTasks.map((task) => {
      if (task.id === id) {
        return { ...task, children: [...(task.children || []), newTask] };
      }
      return task;
    });

    setCopiedTasks(updatedCopiedTasks);
  };
  const handleDeleteCopiedTask = (id) => {
    const updatedCopiedTasks = deleteTask(copiedTasks, id);
    setCopiedTasks(updatedCopiedTasks);
  };

  return (
    <>
      {tasks.map((task) => (
        <InputParent
          key={task.id}
          task={task}
          addTask={addTask}
          handleDeleted={handleDeleted}
          handleUpdate={handleUpdate}
          handleCopy={handleCopy}
        />
      ))}
      {copiedTasks.length > 0 && (
        <div className="container mx-auto max-w-screen-lg min-w-full px-4 mt-6">
          {copiedTasks.map((copiedTask, index) => (
            <div
              key={index}
              className="mt-10 border-2 border-neutral-200 p-5 m-3 font-semibold bg-gray-100"
            >
              <h3 className="text-lg text-slate-700">{copiedTask.name}</h3>

              <input
                type="text"
                placeholder="New task ..."
                className="mt-6 border-2 border-stone-400 rounded-md p-2 text-md outline-none duration-700 md:w-2/5 sm:w-auto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCopiedTask(copiedTask.id, e.target.value);
                    e.target.value = ""; // پاک کردن ورودی
                  }
                }}
              />

              <button
                className="bg-blue-600 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-blue-500 mt-3 mx-3 sm:w-auto"
                onClick={() => {
                  const inputValue = document.querySelector(
                    `input[placeholder="New task ..."]`
                  ).value;
                  addCopiedTask(copiedTask.id, inputValue);
                  document.querySelector(
                    `input[placeholder="New task ..."]`
                  ).value = ""; // پاک کردن ورودی
                }}
              >
                Add Item
              </button>
              <button
                className="bg-red-700 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-red-600 mt-3 mx-3 sm:w-auto"
                onClick={() => handleDeleteCopiedTask(copiedTask.id)}
              >
                Delete Item
              </button>
              <button
                className="bg-yellow-400 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-yellow-300 mt-3 mx-3 sm:w-auto"
                onClick={() => handleUpdate(copiedTask.id)}
              >
                Update Item
              </button>
              <button
                className="bg-green-500 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-green-400 mt-3 mx-3 sm:w-auto"
                onClick={() => handleCopy(copiedTask)}
              >
                Copy Item
              </button>

              {copiedTask.children.length > 0 && (
                <div className="ml-4">
                  {copiedTask.children.map((child) => (
                    <InputParent
                      key={child.id}
                      task={child}
                      addTask={addCopiedTask} // استفاده از addCopiedTask
                      handleDeleted={handleDeleteCopiedTask} // استفاده از handleDeleteCopiedTask
                      handleUpdate={handleUpdate}
                      handleCopy={handleCopy}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* {copiedTasks.length > 0 && (
        <div className="container mx-auto max-w-screen-lg min-w-full px-4 mt-6">
          {copiedTasks.map((copiedTask, index) => (
            <div
              key={index}
              className="mt-10 border-2 border-neutral-200 p-5 m-3 font-semibold bg-gray-100"
            >
              <h3 className="text-lg text-slate-700">{copiedTask.name}</h3>

              <input
                type="text"
                placeholder="New task ..."
                className="mt-6 border-2 border-stone-400 rounded-md p-2 text-md outline-none duration-700 md:w-2/5 sm:w-auto"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    addCopiedTask(copiedTask.id, e.target.value);
                    e.target.value = ""; // پاک کردن ورودی
                  }
                }}
              />

              <button
                className="bg-blue-600 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-blue-500 mt-3 mx-3 sm:w-auto"
                onClick={() => {
                  const inputValue = document.querySelector(
                    `input[placeholder="New task ..."]`
                  ).value;
                  addCopiedTask(copiedTask.id, inputValue);
                  document.querySelector(
                    `input[placeholder="New task ..."]`
                  ).value = ""; // پاک کردن ورودی
                }}
              >
                Add Item
              </button>
              <button
                className="bg-red-700 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-red-600 mt-3 mx-3 sm:w-auto"
                onClick={() => handleDeleted(copiedTask.id)}
              >
                Delete Item
              </button>
              <button
                className="bg-yellow-400 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-yellow-300 mt-3 mx-3 sm:w-auto"
                onClick={() => handleUpdate(copiedTask.id)}
              >
                Update Item
              </button>
              <button
                className="bg-green-500 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-green-400 mt-3 mx-3 sm:w-auto"
                onClick={() => handleCopy(copiedTask)}
              >
                Copy Item
              </button>

              {copiedTask.children.length > 0 && (
                <div className="ml-4">
                  {copiedTask.children.map((child) => (
                    <InputParent
                      key={child.id}
                      task={child}
                      addTask={addCopiedTask}
                      handleDeleted={handleDeleted}
                      handleUpdate={handleUpdate}
                      handleCopy={handleCopy}
                    />
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )} */}
    </>
  );
};

export default TaskList;
