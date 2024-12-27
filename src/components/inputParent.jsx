import React, { useState } from "react";

const InputParent = ({
  task,
  addTask,
  handleDeleted,
  handleUpdate,
  handleCopy,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTask = (parentId) => {
    if (inputValue) {
      addTask(parentId, inputValue);
      setInputValue("");
    }
  };

  return (
    <div className="mt-10 border-2 border-neutral-200 p-5 m-3 font-semibold bg-gray-100">
      <h3 className="text-lg text-slate-700 text-start">{task.name}</h3>
      <input
        type="text"
        placeholder="New task ..."
        className="mt-6 border-2 border-stone-400 rounded-md p-2 text-md outline-none duration-700 md:w-2/5 sm:w-auto"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleAddTask(task.id);
          }
        }}
      />

      <button
        className="bg-blue-600 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-blue-500 mt-3 mx-3 sm:w-auto"
        onClick={() => handleAddTask(task.id)}
      >
        Add Item
      </button>
      <button
        className="bg-red-700 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-red-600 mt-3 mx-3 sm:w-auto"
        onClick={() => handleDeleted(task.id)}
      >
        Delete Item
      </button>
      <button
        className="bg-yellow-400 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-yellow-300 mt-3 mx-3 sm:w-auto"
        onClick={() => handleUpdate(task.id)}
      >
        Update Item
      </button>
      <button
        className="bg-green-500 p-2 border-0 outline-none rounded-md text-md text-slate-50 cursor-pointer duration-700 hover:bg-green-400 mt-3 mx-3 sm:w-auto"
        onClick={() => handleCopy(task)}
      >
        Copy Item
      </button>

      {task.children.length > 0 && (
        <div className="ml-4">
          {task.children.map((child) => (
            <InputParent
              key={child.id}
              task={child}
              addTask={addTask}
              handleDeleted={handleDeleted}
              handleUpdate={handleUpdate}
              handleCopy={handleCopy}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default InputParent;
