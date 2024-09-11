// import React from 'react';
// import { Link, Outlet, useLocation } from 'react-router-dom';
// import Cards from './Cards';
// import { useAuth } from '../../AuthContext';

// function AdminDashboard() {
//   const location = useLocation();
//   const currentPath = location.pathname;

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
//         <h2 className="text-xl font-semibold mb-4">Management</h2>
//         <ul>
//           <li>
//             <Link
//               to="/admin/users"
//               className={`block py-2 px-4 rounded hover:bg-gray-700 ${
//                 currentPath === '/admin/users' ? 'bg-gray-600' : ''
//               }`}
//             >
//               User Management
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/admin/orders"
//               className={`block py-2 px-4 rounded hover:bg-gray-700 ${
//                 currentPath === '/admin/orders' ? 'bg-gray-600' : ''
//               }`}
//             >
//               Order Management
//             </Link>
//           </li>
//           <li>
//             <Link
//               to="/admin/products"
//               className={`block py-2 px-4 rounded hover:bg-gray-700 ${
//                 currentPath === '/admin/products' ? 'bg-gray-600' : ''
//               }`}
//             >
//               Product Management
//             </Link>
//           </li>

//           <li>
//             <Link
//               to="/admin/categories"
//               className={`block py-2 px-4 rounded hover:bg-gray-700 ${
//                 currentPath === '/admin/categories' ? 'bg-gray-600' : ''
//               }`}
//             >
//               Category Management
//             </Link>
//           </li>
//         </ul>
//       </aside>

//       {/* Main Content Section */}
//       <div className="flex-1 flex flex-col">
//         <header className="bg-white shadow p-4">
//           <div className="flex justify-between items-center">
//             <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
//           </div>
//         </header>

//         {/* Main Content Wrapper */}
//         <main className="flex-1 p-6 overflow-auto">
//           {/* Using the updated Cards component to display user and order counts */}
//           <Cards />
//           <Outlet /> {/* This renders the nested route components */}
//         </main>
//       </div>
//     </div>
//   );
// }

// export default AdminDashboard;

import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import Cards from './Cards';

function AdminDashboard() {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Management</h2>
        <ul>
          <li>
            <Link
              to="/admin/users"
              className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                currentPath === '/admin/users' ? 'bg-gray-600' : ''
              }`}
            >
              User Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/orders"
              className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                currentPath === '/admin/orders' ? 'bg-gray-600' : ''
              }`}
            >
              Order Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/products"
              className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                currentPath === '/admin/products' ? 'bg-gray-600' : ''
              }`}
            >
              Product Management
            </Link>
          </li>
          <li>
            <Link
              to="/admin/categories"
              className={`block py-2 px-4 rounded hover:bg-gray-700 ${
                currentPath === '/admin/categories' ? 'bg-gray-600' : ''
              }`}
            >
              Category Management
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content Section */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Admin Dashboard</h1>
            
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 p-6 overflow-auto">
        {/* Using the updated Cards component to display user and order counts */}

          <Cards />
          <Outlet /> {/* This renders the nested route components */}
        </main>
      </div>
    </div>
  );
}

export default AdminDashboard;
