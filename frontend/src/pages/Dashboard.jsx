import { useState, useEffect } from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import axios from 'axios';
import Navbar from '../components/Navbar';


export default function Dashboard() {
  const [dashboardStats, setDashboardStats] = useState(null);
  const [monthlyRevenue, setMonthlyRevenue] = useState([]);
  const [topServices, setTopServices] = useState({});
  const [recentBills, setRecentBills] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, revenueResponse, servicesResponse, billsResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/stats/`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/monthly-revenue/`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/top-services/`),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/dashboard/recent-bills/`)
      ]);

      setDashboardStats(statsResponse.data);
      setMonthlyRevenue(revenueResponse.data);
      setTopServices(servicesResponse.data);
      setRecentBills(billsResponse.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format monthly revenue data for charts
  const monthlyIncomeData = monthlyRevenue.map(item => ({
    month: item.month_name.split(' ')[0],
    income: item.revenue
  }));

  // Format top services for pie chart (top 5 by frequency)
  const billsCategoryData = topServices.by_frequency?.slice(0, 5).map((service, index) => ({
    name: service.particulars || 'Other',
    value: service.count,
    color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'][index] || '#6b7280'
  })) || [];

  // Create summary cards from dashboard stats
  const summaryCards = dashboardStats ? [
    {
      title: 'Today\'s Revenue',
      value: `₹${dashboardStats.today_revenue.toLocaleString('en-IN')}`,
      icon: '💰',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-900'
    },
    {
      title: 'Monthly Revenue',
      value: `₹${dashboardStats.month_revenue.toLocaleString('en-IN')}`,
      icon: '📊',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-900'
    },
    {
      title: 'Yearly Revenue',
      value: `₹${dashboardStats.year_revenue.toLocaleString('en-IN')}`,
      icon: '📈',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-900'
    },
    {
      title: 'Average Bill Value',
      value: `₹${dashboardStats.avg_bill_value.toLocaleString('en-IN')}`,
      icon: '📊',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600',
      textColor: 'text-orange-900'
    }
  ] : [];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50">
        <main className="p-4 md:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
                <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Dashboard Overview</span>
              </h2>
              <div className="text-gray-600 text-lg">
                Welcome back, Here's a quick glance at your business today.
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Monthly Revenue Trend */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Monthly Revenue Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={monthlyIncomeData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                    <Legend />
                    <Line type="monotone" dataKey="income" stroke="#3b82f6" strokeWidth={2} name="Monthly Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Top Services */}
              <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Top Services</h3>
                {billsCategoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={billsCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {billsCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-[300px] text-gray-500">
                    No service data available
              </div>
                )}
            </div>

            {/* Recent Bills Table */}
              <div className="bg-white rounded-lg shadow border border-gray-200 lg:col-span-2">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Recent Bills</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Bill No
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer Name
                      </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Vehicle No
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
                      {recentBills.length > 0 ? (
                        recentBills.map((bill, index) => (
                      <tr key={bill.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {bill.bill_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {bill.customer_name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                              {bill.vehicle_no}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                              ₹{bill.total_amount.toLocaleString('en-IN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(bill.date).toLocaleDateString('en-IN')}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                            No recent bills found
                        </td>
                      </tr>
                      )}
                  </tbody>
                </table>
              </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}