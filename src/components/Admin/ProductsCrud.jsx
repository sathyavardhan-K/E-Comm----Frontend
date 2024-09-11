import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ProductCrud() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    productName: '',
    description: '',
    price: '',
    productImg: '',
    refProductImgs: '',
    sku: '',
    brandName: '',
    availableStockQuantity: '',
    colors: '',
    sellerName: '',
    productCategory: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/products'); // Adjust API endpoint as needed
        setProducts(response.data);
      } catch (err) {
        setError('Error fetching products');
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/products', newProduct);
      setProducts([...products, response.data]);
      setNewProduct({
        productName: '',
        description: '',
        price: '',
        productImg: '',
        refProductImgs: '',
        sku: '',
        brandName: '',
        availableStockQuantity: '',
        colors: '',
        sellerName: '',
        productCategory: ''
      });
      setShowAddProductForm(false); // Hide the form after adding the product
    } catch (err) {
      setError('Error adding product');
    }
  };

  const handleEditProduct = async (product) => {
    try {
      const response = await axios.put(`http://localhost:3000/api/products/${product._id}`, editingProduct);
      setProducts(products.map(p => (p._id === product._id ? response.data : p)));
      setEditingProduct(null);
    } catch (err) {
      setError('Error updating product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`http://localhost:3000/api/products/${productId}`);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      setError('Error deleting product');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Product CRUD</h2>
      
      {/* Toggle Add New Product Form */}
      <button
        onClick={() => setShowAddProductForm(!showAddProductForm)}
        className="bg-blue-500 text-white px-4 py-2 rounded mb-6"
      >
        {showAddProductForm ? 'Hide Add New Product Form' : 'Add New Product'}
      </button>

      {/* Add New Product Form */}
      {showAddProductForm && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Add New Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={newProduct.productName}
            onChange={(e) => setNewProduct({ ...newProduct, productName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={newProduct.description}
            onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Product Image URL"
            value={newProduct.productImg}
            onChange={(e) => setNewProduct({ ...newProduct, productImg: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Reference Product Images (comma-separated URLs)"
            value={newProduct.refProductImgs}
            onChange={(e) => setNewProduct({ ...newProduct, refProductImgs: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="SKU"
            value={newProduct.sku}
            onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Brand Name"
            value={newProduct.brandName}
            onChange={(e) => setNewProduct({ ...newProduct, brandName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Available Stock Quantity"
            value={newProduct.availableStockQuantity}
            onChange={(e) => setNewProduct({ ...newProduct, availableStockQuantity: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Colors (comma-separated)"
            value={newProduct.colors}
            onChange={(e) => setNewProduct({ ...newProduct, colors: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Seller Name"
            value={newProduct.sellerName}
            onChange={(e) => setNewProduct({ ...newProduct, sellerName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Product Category"
            value={newProduct.productCategory}
            onChange={(e) => setNewProduct({ ...newProduct, productCategory: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={handleAddProduct}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Add Product
          </button>
        </div>
      )}
      
      {/* Product List */}
      <div className="overflow-x-auto">
        <h3 className="text-xl font-semibold mb-4">Product List</h3>
        <div className="w-full max-w-7xl mx-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Brand</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Seller</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
  {products.map(product => (
    <tr key={product._id} className="hover:bg-gray-50">
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.productName}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{`₹${product.price}`}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.description}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.brandName}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.availableStockQuantity}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{product.sellerName}</td>
      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
        {product.productCategory ? product.productCategory.categoryName : 'N/A'}
      </td>
      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
        <button
          onClick={() => setEditingProduct(product)}
          className="text-blue-600 hover:text-blue-900"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteProduct(product._id)}
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

      {/* Edit Product Form */}
      {editingProduct && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-4">Edit Product</h3>
          <input
            type="text"
            placeholder="Product Name"
            value={editingProduct.productName}
            onChange={(e) => setEditingProduct({ ...editingProduct, productName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <textarea
            placeholder="Description"
            value={editingProduct.description}
            onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Price"
            value={editingProduct.price}
            onChange={(e) => setEditingProduct({ ...editingProduct, price: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Product Image URL"
            value={editingProduct.productImg}
            onChange={(e) => setEditingProduct({ ...editingProduct, productImg: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Reference Product Images (comma-separated URLs)"
            value={editingProduct.refProductImgs}
            onChange={(e) => setEditingProduct({ ...editingProduct, refProductImgs: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="SKU"
            value={editingProduct.sku}
            onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Brand Name"
            value={editingProduct.brandName}
            onChange={(e) => setEditingProduct({ ...editingProduct, brandName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="number"
            placeholder="Available Stock Quantity"
            value={editingProduct.availableStockQuantity}
            onChange={(e) => setEditingProduct({ ...editingProduct, availableStockQuantity: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Colors (comma-separated)"
            value={editingProduct.colors}
            onChange={(e) => setEditingProduct({ ...editingProduct, colors: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Seller Name"
            value={editingProduct.sellerName}
            onChange={(e) => setEditingProduct({ ...editingProduct, sellerName: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <input
            type="text"
            placeholder="Product Category"
            value={editingProduct.productCategory}
            onChange={(e) => setEditingProduct({ ...editingProduct, productCategory: e.target.value })}
            className="border p-2 mb-2 w-full"
          />
          <button
            onClick={() => handleEditProduct(editingProduct)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Update Product
          </button>
        </div>
      )}

      {/* Error Handling */}
      {error && (
        <div className="text-red-500">
          {error}
        </div>
      )}
    </div>
  );
}

export default ProductCrud;
