import React, { useEffect, useState } from 'react';
import axios from 'axios';

function CategoryCrud() {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({
    categoryName: '',
    categoryImage: ''
  });
  const [editingCategory, setEditingCategory] = useState(null);
  const [showAddCategoryForm, setShowAddCategoryForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/category'); // Adjust API endpoint as needed
        setCategories(response.data);
      } catch (err) {
        setError('Error fetching categories');
      }
    };
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/category', newCategory);
      setCategories([...categories, response.data]);
      setNewCategory({
        categoryName: '',
        categoryImage: ''
      });
      setShowAddCategoryForm(false); // Hide the form after adding the category
    } catch (err) {
      setError('Error adding category');
    }
  };

  const handleEditCategory = async (category) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/category/${category._id}`, editingCategory);
      setCategories(categories.map(c => (c._id === category._id ? response.data : c)));
      setEditingCategory(null);
    } catch (err) {
      setError('Error updating category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await axios.delete(`http://localhost:3000/api/category/${categoryId}`);
      setCategories(categories.filter(c => c._id !== categoryId));
    } catch (err) {
      setError('Error deleting category');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Category Management & Operations</h2>

      {/* Toggle Add New Category Form */}
      <button
        onClick={() => setShowAddCategoryForm(!showAddCategoryForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        {showAddCategoryForm ? 'Hide Add New Category Form' : 'Add New Category'}
      </button>

      {/* Add New Category Form */}
      {showAddCategoryForm && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={newCategory.categoryName}
            onChange={(e) => setNewCategory({ ...newCategory, categoryName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Category Image URL"
            value={newCategory.categoryImage}
            onChange={(e) => setNewCategory({ ...newCategory, categoryImage: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddCategory}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Category
          </button>
        </div>
      )}

      {/* Category List */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Category List</h3>
        <div className="w-full max-w-7xl mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {categories.map(category => (
                <tr key={category._id} className="hover:bg-gray-50">
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{category.categoryName}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    <img src={category.categoryImage} alt={category.categoryName} className="w-16 h-16 object-cover rounded" />
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setEditingCategory(category)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(category._id)}
                      className="text-red-600 hover:text-red-900 ml-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Category Form */}
      {editingCategory && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Category</h3>
          <input
            type="text"
            placeholder="Category Name"
            value={editingCategory.categoryName}
            onChange={(e) => setEditingCategory({ ...editingCategory, categoryName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Category Image URL"
            value={editingCategory.categoryImage}
            onChange={(e) => setEditingCategory({ ...editingCategory, categoryImage: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={() => handleEditCategory(editingCategory)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Category
          </button>
          <button
            onClick={() => setEditingCategory(null)}
            className="bg-gray-500 text-white px-4 py-2 rounded ml-4"
          >
            Cancel
          </button>
        </div>
      )}

      {error && <div className="text-red-600 mt-4">{error}</div>}
    </div>
  );
}

export default CategoryCrud;
