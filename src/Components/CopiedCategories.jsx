export default function CopiedCategories({ categories }) {
  const flattenCategories = (category) => {
    let count = 1;
    if (category.children) {
      category.children.forEach((child) => {
        count += flattenCategories(child);
      });
    }
    return count;
  };

  const totalCount = categories.reduce(
    (acc, category) => acc + flattenCategories(category),
    0
  );

  return (
    <div className="mt-8 border-2 border-blue-300 rounded-lg p-4">
      <h2 className="text-xl font-bold mb-4">
        Copied Categories (Total: {totalCount})
      </h2>
      {categories.map((category, index) => (
        <div key={index} className="mb-2">
          <span className="font-semibold">{category.name}</span>
          {category.children && category.children.length > 0 && (
            <ul className="pl-4">
              {category.children.map((child, childIndex) => (
                <li key={childIndex}>{child.name}</li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}
