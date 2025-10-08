import { useState,useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from "axios";

export default function ItemListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;
  const [items, setItems] = useState([]);
  const [newItemName, setNewItemName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch items on page load
  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/api/items/`)
      .then((res) => setItems(res.data))
      .catch((err) => console.error("Error fetching items:", err));
  }, []);


//   const filteredItems = items.filter(item =>
//     item.name.toLowerCase().includes(searchTerm.toLowerCase())
//   );
  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination calculations
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

//   const handleAddItem = (e) => {
//     e.preventDefault();
//     if (newItemName.trim()) {
//       const newItem = {
//         id: items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1,
//         name: newItemName.trim()
//       };
//       setItems([...items, newItem]);
//       setNewItemName('');
//       setCurrentPage(1);
//     }
//   };
const handleAddItem = async (e) => {
    e.preventDefault();
    if (newItemName.trim()) {
      try {
        const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/items/`, {
          name: newItemName,
        });
        setItems([...items, res.data]);
        setNewItemName("");
      } catch (err) {
        console.error("Error adding item:", err);
      }
    }
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditName(name);
  };

  const handleEditClick = (item) => {
    setEditingId(item.id);
    setEditName(item.name);
  };

//   const handleSaveEdit = (id) => {
//     if (editName.trim()) {
//       setItems(items.map(item =>
//         item.id === id
//           ? { ...item, name: editName.trim() }
//           : item
//       ));
//       setEditingId(null);
//       setEditName('');
//     }
//   };
  const handleSaveEdit = async (id) => {
    if (editName.trim()) {
      try {
        const res = await axios.put(
          `${import.meta.env.VITE_API_BASE_URL}/api/items/${id}/`,
          { name: editName }
        );
        setItems(items.map((item) => (item.id === id ? res.data : item)));
        setEditingId(null);
        setEditName("");
      } catch (err) {
        console.error("Error updating item:", err);
      }
    }
  };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setEditName('');
//   };
const handleCancelEdit = () => {
    setEditingId(null);
    setEditName("");
  };

//   const handleDelete = (id) => {
//     if (window.confirm('Are you sure you want to delete this item?')) {
//       setItems(items.filter(item => item.id !== id));
//       // Adjust current page if needed
//       const newFilteredLength = items.filter(item => item.id !== id).length;
//       const newTotalPages = Math.ceil(newFilteredLength / itemsPerPage);
//       if (currentPage > newTotalPages && newTotalPages > 0) {
//         setCurrentPage(newTotalPages);
//       }
//     }
//   };
 const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/items/${id}/`);
        setItems(items.filter((item) => item.id !== id));
      } catch (err) {
        console.error("Error deleting item:", err);
      }
    }
  };

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        pageNumbers.push(currentPage - 1);
        pageNumbers.push(currentPage);
        pageNumbers.push(currentPage + 1);
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-6xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">
                  Item Master - UA Motors
                </span>
              </h2>
              <div className="text-gray-600 text-lg">
                Manage your service items
              </div>
            </div>

            {/* Main Card Container */}
            <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
              {/* Search Bar */}
              <div className="mb-6">
                <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                  Search Items
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Search by item name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>

              {/* Add New Item Form */}
              <div className="bg-blue-50 rounded-lg p-6 mb-6 border border-blue-200">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Item</h3>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name
                    </label>
                    <input
                      id="itemName"
                      type="text"
                      placeholder="Enter item name"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddItem(e);
                        }
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleAddItem}
                      className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition-colors font-medium"
                    >
                      Add Item
                    </button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                        ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Item Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-48">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentItems.length > 0 ? (
                      currentItems.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {item.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">
                            {editingId === item.id ? (
                              <input
                                type="text"
                                value={editName}
                                onChange={(e) => setEditName(e.target.value)}
                                className="w-full px-3 py-1 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                              />
                            ) : (
                              item.name
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            {editingId === item.id ? (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleSaveEdit(item.id)}
                                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                                >
                                  Save
                                </button>
                                <button
                                  onClick={handleCancelEdit}
                                  className="bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleEdit(item.id, item.name)}
                                  className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors"
                                >
                                  Edit
                                </button>
                                <button
                                  onClick={() => handleDelete(item.id)}
                                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="px-6 py-12 text-center text-gray-500">
                          No items found matching your search
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {filteredItems.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="text-sm text-gray-600">
                      Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
                      <span className="font-semibold">{Math.min(endIndex, filteredItems.length)}</span> of{' '}
                      <span className="font-semibold">{filteredItems.length}</span> items
                      {searchTerm && ` (filtered from ${items.length} total)`}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => goToPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Previous
                      </button>
                      
                      <div className="flex gap-1">
                        {renderPageNumbers().map((pageNum, idx) => (
                          pageNum === '...' ? (
                            <span key={`ellipsis-${idx}`} className="px-3 py-1 text-gray-500">
                              ...
                            </span>
                          ) : (
                            <button
                              key={pageNum}
                              onClick={() => goToPage(pageNum)}
                              className={`px-3 py-1 border rounded-md text-sm font-medium transition-colors ${
                                currentPage === pageNum
                                  ? 'bg-blue-600 text-white border-blue-600'
                                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                              }`}
                            >
                              {pageNum}
                            </button>
                          )
                        ))}
                      </div>
                      
                      <button
                        onClick={() => goToPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}