// Import this component in your main App.jsx or router configuration
// Example: import Dashboard from './components/Dashboard.jsx'

import { useState } from 'react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  
  const summaryCards = [
    {
      title: 'Monthly Income',
      value: '$24,580',
      icon: '💰',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      title: 'Total Bills',
      value: '156',
      icon: '📄',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    // {
    //   title: 'Active Customers',
    //   value: '89',
    //   icon: '👥',
    //   bgColor: 'bg-purple-50',
    //   iconColor: 'text-purple-600',
    //   textColor: 'text-purple-900'
    // }
  ];

  const recentBills = [
    { id: 'INV-001', customer: 'John Smith', amount: '$1,250', date: '2024-01-15' },
    { id: 'INV-002', customer: 'Sarah Johnson', amount: '$890', date: '2024-01-14' },
    { id: 'INV-003', customer: 'Mike Davis', amount: '$2,150', date: '2024-01-13' },
    { id: 'INV-004', customer: 'Emma Wilson', amount: '$675', date: '2024-01-12' },
    { id: 'INV-005', customer: 'David Brown', amount: '$1,480', date: '2024-01-11' }
  ];

  const handleLogout = () => {
    // Replace with your actual logout logic
    console.log('Logging out...');
    window.location.href = '/';
  };

  const handleNavClick = (navName) => {
    setActiveNav(navName);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Dashboard Overview</span>
            </h2>
            <div className="text-gray-600 text-lg">
              Welcome back, Here’s a quick glance at your business today.
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
            {summaryCards.map((card, index) => (
              <div key={index} className={`${card.bgColor} rounded-lg p-6 border border-gray-200`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{card.title}</p>
                    <p className={`text-2xl font-bold ${card.textColor}`}>{card.value}</p>
                  </div>
                  <div className={`text-3xl ${card.iconColor}`}>
                    {card.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Recent Bills Table */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">Recent Bills</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Bill ID
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Amount
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentBills.map((bill, index) => (
                    <tr key={bill.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {bill.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {bill.customer}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                        {bill.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {bill.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div></>
  );
}