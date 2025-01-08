"use client";

import { useState, useEffect, useCallback } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import DraggableCategory from "./DraggableCategory";

export default function Main() {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const storedCategories = localStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories));
  }, [categories]);

  const addCategory = () => {
    if (newCategoryName.trim()) {
      setCategories([
        ...categories,
        {
          id: Date.now().toString(),
          name: newCategoryName,
          children: [],
          isCopy: false,
          copyCount: 0,
          originalId: null,
        },
      ]);
      setNewCategoryName("");
    }
  };

  const updateCategory = (updatedCategory) => {
    setCategories((prevCategories) =>
      updateCategoryRecursive(prevCategories, updatedCategory)
    );
  };

  const updateCategoryRecursive = (categories, updatedCategory) => {
    return categories.map((category) => {
      if (category.id === updatedCategory.id) {
        return updatedCategory;
      }
      if (category.children.length > 0) {
        return {
          ...category,
          children: updateCategoryRecursive(category.children, updatedCategory),
        };
      }
      return category;
    });
  };

  const deleteCategory = (id) => {
    setCategories((prevCategories) => {
      const deleteCategoryRecursive = (categories) => {
        return categories.filter((cat) => {
          if (cat.id === id || cat.originalId === id) {
            return false;
          }
          if (cat.children.length > 0) {
            cat.children = deleteCategoryRecursive(cat.children);
          }
          return true;
        });
      };
      return deleteCategoryRecursive(prevCategories);
    });
  };

  const copyCategory = (categoryToCopy) => {
    const createCopy = (category, isTopLevel = false) => {
      const newCopy = JSON.parse(JSON.stringify(category));
      if (isTopLevel) {
        newCopy.id = Date.now().toString();
        newCopy.isCopy = true;
        newCopy.copyCount = 1;
        newCopy.originalId = category.id;
      }
      newCopy.children = newCopy.children.map((child) => createCopy(child));
      return newCopy;
    };

    setCategories((prevCategories) => {
      const copyRecursive = (categories) => {
        return categories.map((category) => {
          if (category.id === categoryToCopy.id) {
            if (category.isCopy) {
              // Increment the copy count if it's already a copy
              return { ...category, copyCount: category.copyCount + 1 };
            } else {
              // Create a new copy
              const newCopy = createCopy(category, true);
              return [category, newCopy];
            }
          }
          if (category.children.length > 0) {
            const newChildren = copyRecursive(category.children);
            return {
              ...category,
              children: newChildren.flat(),
            };
          }
          return category;
        });
      };
      return copyRecursive(prevCategories).flat();
    });
  };

  const moveCategory = useCallback((draggedId, hoveredId) => {
    setCategories((prevCategories) => {
      const flattenCategories = (items, parentId = null, level = 0) =>
        items.reduce(
          (acc, item) => [
            ...acc,
            { ...item, parentId, level },
            ...flattenCategories(item.children, item.id, level + 1),
          ],
          []
        );

      const rebuildTree = (flatList) => {
        const idToChildren = {};
        flatList.forEach((item) => {
          if (!idToChildren[item.parentId]) {
            idToChildren[item.parentId] = [];
          }
          idToChildren[item.parentId].push({ ...item, children: [] });
        });

        const addChildren = (item) => {
          if (idToChildren[item.id]) {
            item.children = idToChildren[item.id].map(addChildren);
          }
          return item;
        };

        return idToChildren[null].map(addChildren);
      };

      const flat = flattenCategories(prevCategories);
      const draggedItemWithChildren = flat.filter(
        (item) =>
          item.id === draggedId ||
          flat.some(
            (parent) => parent.id === draggedId && item.parentId === parent.id
          )
      );
      const otherItems = flat.filter(
        (item) =>
          !draggedItemWithChildren.some(
            (draggedItem) => draggedItem.id === item.id
          )
      );

      const hoveredIndex = otherItems.findIndex(
        (item) => item.id === hoveredId
      );
      const newFlat = [
        ...otherItems.slice(0, hoveredIndex),
        ...draggedItemWithChildren,
        ...otherItems.slice(hoveredIndex),
      ];

      return rebuildTree(newFlat);
    });
  }, []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="min-h-screen bg-gradient-to-r from-slate-400 to-slate-300 p-20">
        <div className="max-w-6xl mx-auto bg-white rounded-md shadow-xl p-8">
          <h1 className="text-3xl tracking-wider font-extrabold  mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-300 border-b-2 pb-4">
            Nested Categories
          </h1>
          <div className="flex mb-6">
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="flex-grow border-2 border-blue-300 rounded-l-lg px-4 py-3 outline-none focus:outline-none focus:border-blue-500 transition-all duration-300"
              placeholder="New task ...."
            />
            <button
              onClick={addCategory}
              className="bg-blue-600  font-semibold text-white px-8 py-3 rounded-r-md hover:bg-blue-500 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              Add item
            </button>
          </div>
          <div className="space-y-4">
            {categories.map((category, index) => (
              <DraggableCategory
                key={category.id}
                category={category}
                index={index}
                onUpdate={updateCategory}
                onDelete={deleteCategory}
                onCopy={copyCategory}
                moveCategory={moveCategory}
              />
            ))}
          </div>
        </div>
      </div>
    </DndProvider>
  );
}
