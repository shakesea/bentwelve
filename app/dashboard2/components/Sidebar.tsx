// 'use client';
// import { useState } from 'react';

// export default function Sidebar() {
//   const [activeItem, setActiveItem] = useState('Dashboard');

//   const menuItems = [
//     'Dashboard',
//     'Dashboard 2',
//     'Frontend Pages',
//     'Utilities',
//     'Icons',
//     'Table',
//     'Form',
//     'Sample Page',
//     'Typography',
//     'Shadow',
//   ];

//   return (
//     <div className="w-60 bg-white p-4 shadow">
//       <h2 className="text-lg font-semibold mb-4">Spike Admin</h2>
//       <ul className="space-y-2">
//         {menuItems.map((item) => (
//           <li key={item}>
//             <button
//               className={`w-full text-left px-3 py-2 rounded ${activeItem === item ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
//               onClick={() => setActiveItem(item)}
//             >
//               {item}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }