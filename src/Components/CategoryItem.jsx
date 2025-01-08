import { useState } from "react";
import { FaPlus, FaTrash, FaEdit, FaCheck, FaCopy } from "react-icons/fa";

export default function CategoryItem({ category, onUpdate, onDelete, onCopy }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(category.name);
  const [newChildName, setNewChildName] = useState("");

  const handleUpdate = () => {
    onUpdate({ ...category, name: editedName });
    setIsEditing(false);
  };

  const handleAddChild = () => {
    if (newChildName.trim()) {
      const newChild = {
        id: Date.now().toString(),
        name: newChildName,
        children: [],
        isCopy: false,
        copyCount: 0,
        originalId: null,
      };
      onUpdate({ ...category, children: [...category.children, newChild] });
      setNewChildName("");
    }
  };

  const handleUpdateChild = (updatedChild) => {
    onUpdate({
      ...category,
      children: category.children.map((child) =>
        child.id === updatedChild.id ? updatedChild : child
      ),
    });
  };

  const handleDeleteChild = (childId) => {
    onUpdate({
      ...category,
      children: category.children.filter((child) => child.id !== childId),
    });
  };

  const handleCopy = () => {
    onCopy(category);
  };

  const borderClass = category.isCopy
    ? "border-2 border-green-500 rounded-lg p-4 mb-4 bg-white shadow-md relative transition-all duration-300 hover:shadow-lg"
    : "border-2 border-gray-200 rounded-lg p-4 mb-4 bg-white shadow-md relative transition-all duration-300 hover:shadow-lg";

  return (
    <div className={borderClass}>
      {category.isCopy && (
        <span className="absolute top-0 right-0 bg-green-500 text-white px-3 py-1 text-sm font-bold rounded-bl-lg rounded-tr-lg">
          Copy: {category.copyCount}
        </span>
      )}
      <div className="flex items-center mb-3">
        {isEditing ? (
          <input
            type="text"
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="flex-grow border-2 border-blue-300 rounded-l-lg px-4 py-3 outline-none focus:outline-none focus:border-blue-500 transition-all duration-300"
          />
        ) : (
          <span className="flex-grow text-lg font-semibold text-gray-800">
            {category.name}
          </span>
        )}
        <div className="flex space-x-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-50"
          >
            {isEditing ? <FaCheck /> : <FaEdit />}
          </button>
          <button
            onClick={handleCopy}
            className="bg-green-500 text-white p-2 rounded-lg hover:bg-green-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
          >
            <FaCopy />
          </button>
          <button
            onClick={() => onDelete(category.id)}
            className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
          >
            <FaTrash />
          </button>
        </div>
      </div>
      {isEditing && (
        <button
          onClick={handleUpdate}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-3 hover:bg-green-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
        >
          Save
        </button>
      )}
      <div className="flex mt-3">
        <input
          type="text"
          value={newChildName}
          onChange={(e) => setNewChildName(e.target.value)}
          className="flex-grow border-2 border-blue-300 rounded-l-lg px-4 py-3 outline-none focus:outline-none focus:border-blue-500 transition-all duration-300"
          placeholder="New child task name"
        />
        <button
          onClick={handleAddChild}
          className="bg-blue-500 text-white px-6 py-2 rounded-r-lg hover:bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <FaPlus />
        </button>
      </div>
      <div className="pl-6 mt-4 border-l-2 border-gray-200">
        {category.children.map((child) => (
          <CategoryItem
            key={child.id}
            category={child}
            onUpdate={handleUpdateChild}
            onDelete={handleDeleteChild}
            onCopy={onCopy}
          />
        ))}
      </div>
    </div>
  );
}
