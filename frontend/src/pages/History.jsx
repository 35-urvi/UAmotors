import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  MagnifyingGlassIcon,  // Search
  ChevronLeftIcon,      // ChevronLeft
  ChevronRightIcon,     // ChevronRight
  XMarkIcon,            // X
  ArrowsUpDownIcon      // ArrowUpDown
} from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';
const HistoryPage = () => {
  // Sample billing data
//   const [allBills] = useState([
//     {
//       id: 1,
//       billNo: '300-2025/2',
//       date: '2025-10-01',
//       customerName: 'Rajesh Kumar',
//       customerAddress: 'Satellite, Ahmedabad',
//       customerContact: '9876543210',
//       vehicleNo: 'GJ 01 AA 1234',
//       model: 'BMW 3 Series',
//       km: '45000',
//       nextServiceKm: '50000',
//       items: [
//         { particulars: 'Engine Oil Change', quantity: 1, rate: 2500, discount: 10 },
//         { particulars: 'Oil Filter', quantity: 1, rate: 800, discount: 0 },
//         { particulars: 'Air Filter', quantity: 1, rate: 1200, discount: 5 }
//       ],
//       total: 4155
//     },
//     {
//       id: 2,
//       billNo: '299-2025/2',
//       date: '2025-09-28',
//       customerName: 'Priya Shah',
//       customerAddress: 'Bodakdev, Ahmedabad',
//       customerContact: '9898765432',
//       vehicleNo: 'GJ 01 BC 5678',
//       model: 'Audi A4',
//       km: '32000',
//       nextServiceKm: '37000',
//       items: [
//         { particulars: 'Brake Pad Replacement', quantity: 4, rate: 1500, discount: 0 },
//         { particulars: 'Brake Fluid Top-up', quantity: 1, rate: 500, discount: 0 }
//       ],
//       total: 6500
//     },
//     {
//       id: 3,
//       billNo: '298-2025/2',
//       date: '2025-09-25',
//       customerName: 'Amit Patel',
//       customerAddress: 'Vastrapur, Ahmedabad',
//       customerContact: '9123456789',
//       vehicleNo: 'GJ 01 CD 9012',
//       model: 'Toyota Fortuner',
//       km: '68000',
//       nextServiceKm: '73000',
//       items: [
//         { particulars: 'Full Service', quantity: 1, rate: 5000, discount: 15 },
//         { particulars: 'Wheel Alignment', quantity: 1, rate: 800, discount: 0 },
//         { particulars: 'Tire Rotation', quantity: 1, rate: 600, discount: 0 }
//       ],
//       total: 5650
//     },
//     {
//       id: 4,
//       billNo: '297-2025/2',
//       date: '2025-09-20',
//       customerName: 'Neha Desai',
//       customerAddress: 'Thaltej, Ahmedabad',
//       customerContact: '9988776655',
//       vehicleNo: 'GJ 01 DE 3456',
//       model: 'Honda City',
//       km: '25000',
//       nextServiceKm: '30000',
//       items: [
//         { particulars: 'AC Service', quantity: 1, rate: 1800, discount: 10 },
//         { particulars: 'AC Filter', quantity: 1, rate: 400, discount: 0 }
//       ],
//       total: 2020
//     },
//     {
//       id: 5,
//       billNo: '296-2025/2',
//       date: '2025-09-15',
//       customerName: 'Vikram Singh',
//       customerAddress: 'Maninagar, Ahmedabad',
//       customerContact: '9887766554',
//       vehicleNo: 'GJ 01 EF 7890',
//       model: 'Hyundai Creta',
//       km: '15000',
//       nextServiceKm: '20000',
//       items: [
//         { particulars: 'First Service', quantity: 1, rate: 3500, discount: 20 },
//         { particulars: 'Underbody Coating', quantity: 1, rate: 2000, discount: 0 }
//       ],
//       total: 4800
//     },
//     {
//       id: 6,
//       billNo: '295-2025/2',
//       date: '2025-09-10',
//       customerName: 'Kavita Mehta',
//       customerAddress: 'CG Road, Ahmedabad',
//       customerContact: '9776655443',
//       vehicleNo: 'GJ 01 FG 2345',
//       model: 'Mahindra XUV700',
//       km: '42000',
//       nextServiceKm: '47000',
//       items: [
//         { particulars: 'Battery Replacement', quantity: 1, rate: 6500, discount: 5 },
//         { particulars: 'Engine Scanning', quantity: 1, rate: 800, discount: 0 }
//       ],
//       total: 6975
//     },
//     {
//       id: 7,
//       billNo: '294-2025/2',
//       date: '2025-09-05',
//       customerName: 'Suresh Joshi',
//       customerAddress: 'Gota, Ahmedabad',
//       customerContact: '9665544332',
//       vehicleNo: 'GJ 01 GH 6789',
//       model: 'Kia Seltos',
//       km: '28000',
//       nextServiceKm: '33000',
//       items: [
//         { particulars: 'Suspension Check', quantity: 1, rate: 1500, discount: 0 },
//         { particulars: 'Shock Absorber Replacement', quantity: 2, rate: 2500, discount: 10 }
//       ],
//       total: 6000
//     },
//     {
//       id: 8,
//       billNo: '293-2025/2',
//       date: '2025-09-01',
//       customerName: 'Anjali Sharma',
//       customerAddress: 'Prahlad Nagar, Ahmedabad',
//       customerContact: '9554433221',
//       vehicleNo: 'GJ 01 HI 0123',
//       model: 'Tata Nexon',
//       km: '18000',
//       nextServiceKm: '23000',
//       items: [
//         { particulars: 'General Service', quantity: 1, rate: 2800, discount: 0 },
//         { particulars: 'Wiper Blade Replacement', quantity: 2, rate: 300, discount: 0 }
//       ],
//       total: 3400
//     }
//   ]);

const [allBills, setAllBills] = useState([]);

// useEffect(() => {
//   axios.get("http://127.0.0.1:8000/api/billing/bills/")
//     .then(res => setAllBills(res.data))
//     .catch(err => console.error(err));
// }, []);
// useEffect(() => {
//   axios.get("http://127.0.0.1:8000/api/billing/bills/")
//     .then(res => {
//       const formatted = res.data.map(bill => ({
//         ...bill,
//         customerName: bill.customer_name,
//         vehicleNo: bill.vehicle_no,
//         billNo: bill.bill_no,
//         totalAmount: bill.total_amount,
//       }));
//       setAllBills(formatted);
//     })
//     .catch(err => console.error(err));
// }, []);
useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/billing/bills/")
    .then(res => {
      const formatted = res.data.map(bill => ({
        ...bill,
        customerName: bill.customer_name,
        customerContact: bill.customer_contact,
        customerAddress: bill.customer_address,
        vehicleNo: bill.vehicle_no,
        nextServiceKm: bill.next_service_km,
        billNo: bill.bill_no,
        totalAmount: bill.total_amount
      }));
      setAllBills(formatted);
    })
    .catch(err => console.error(err));
}, []);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  const [selectedBill, setSelectedBill] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const itemsPerPage = 5;

  // Filter bills based on search query
  const filteredBills = allBills.filter(bill => {
  const query = searchQuery.toLowerCase();
  return (
    (bill.customer_name || "").toLowerCase().includes(query) ||
    (bill.vehicle_no || "").toLowerCase().includes(query) ||
    (bill.model || "").toLowerCase().includes(query) ||
    (bill.bill_no || "").toLowerCase().includes(query)
  );
});

  // Sort bills
//   const sortedBills = [...filteredBills].sort((a, b) => {
//     if (sortField === 'date') {
//       const comparison = new Date(a.date) - new Date(b.date);
//       return sortDirection === 'asc' ? comparison : -comparison;
//     } else if (sortField === 'total') {
//       const comparison = a.total - b.total;
//       return sortDirection === 'asc' ? comparison : -comparison;
//     }
//     return 0;
//   });
const sortedBills = [...filteredBills].sort((a, b) => {
  if (sortField === 'date') {
    const comparison = new Date(a.date) - new Date(b.date);
    return sortDirection === 'asc' ? comparison : -comparison;
  } else if (sortField === 'total') {
    const comparison = parseFloat(a.total_amount || 0) - parseFloat(b.total_amount || 0);
    return sortDirection === 'asc' ? comparison : -comparison;
  }
  return 0;
});

  // Pagination
  const totalPages = Math.ceil(sortedBills.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedBills = sortedBills.slice(startIndex, startIndex + itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleViewDetails = (bill) => {
    // setSelectedBill(bill);
    setSelectedBill(bill)
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedBill(null);
  };

  const calculateAmount = (quantity, rate, discount) => {
    const gross = quantity * rate;
    const discountAmount = gross * discount / 100;
    return Math.round(gross - discountAmount);
  };

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
              {/* Header */}
              {/* <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing History</h1>
                  <p className="text-gray-600">View and manage all your billing records</p>
              </div> */}
            <div className="text-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
              <span className="bg-gradient-to-r from-blue-800 to-indigo-800 bg-clip-text text-transparent">Billing History</span>
            </h2>
            <div className="text-gray-600 text-lg">
              View and manage all your billing records
            </div>
          </div>

              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                  <div className="relative">
                      < MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                          type="text"
                          placeholder="Search by customer name, vehicle number, model, or bill number..."
                          value={searchQuery}
                          onChange={(e) => {
                              setSearchQuery(e.target.value);
                              setCurrentPage(1);
                          } }
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                  </div>
              </div>

              {/* Table Card */}
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="overflow-x-auto">
                      <table className="w-full">
                          <thead className="bg-gray-50 border-b border-gray-200">
                              <tr>
                                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Bill No.
                                  </th>
                                  <th
                                      className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                      onClick={() => handleSort('date')}
                                  >
                                      <div className="flex items-center gap-2">
                                          Date
                                          <ArrowsUpDownIcon className="w-4 h-4" />
                                      </div>
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Customer
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Vehicle
                                  </th>
                                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Model
                                  </th>
                                  <th
                                      className="px-6 py-4 text-right text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                                      onClick={() => handleSort('total')}
                                  >
                                      <div className="flex items-center justify-end gap-2">
                                          Amount
                                          <ArrowsUpDownIcon className="w-4 h-4" />
                                      </div>
                                  </th>
                                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Actions
                                  </th>
                              </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200">
                              {paginatedBills.length > 0 ? (
                                  paginatedBills.map((bill, index) => (
                                      <tr
                                          key={bill.id}
                                          className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                      >
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                              {bill.billNo}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                              {new Date(bill.date).toLocaleDateString('en-IN')}
                                          </td>
                                          <td className="px-6 py-4 text-sm text-gray-900">
                                              <div>{bill.customerName}</div>
                                              <div className="text-xs text-gray-500">{bill.customerContact}</div>
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-mono">
                                              {bill.vehicleNo}
                                          </td>
                                          <td className="px-6 py-4 text-sm text-gray-600">
                                              {bill.model}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                                              {bill.totalAmount ? bill.totalAmount.toLocaleString() : "0"}
                                          </td>
                                          <td className="px-6 py-4 whitespace-nowrap text-center">
                                              <button
                                                  onClick={() => handleViewDetails(bill)}
                                                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                                              >
                                                  View Details
                                              </button>
                                          </td>
                                      </tr>
                                  ))
                              ) : (
                                  <tr>
                                      <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                                          No billing records found
                                      </td>
                                  </tr>
                              )}
                          </tbody>
                      </table>
                  </div>

                  {/* Pagination */}
                  {sortedBills.length > 0 && (
                      <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t border-gray-200">
                          <div className="text-sm text-gray-600">
                              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, sortedBills.length)} of {sortedBills.length} results
                          </div>
                          <div className="flex gap-2">
                              <button
                                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                  disabled={currentPage === 1}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                  <ChevronLeftIcon className="w-4 h-4" />
                                  Previous
                              </button>
                              <button
                                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                  disabled={currentPage === totalPages}
                                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                              >
                                  Next
                                  <ChevronRightIcon className="w-4 h-4" />
                              </button>
                          </div>
                      </div>
                  )}
              </div>
          </div>

          {/* Modal */}
          {isModalOpen && selectedBill && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                  <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                      <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-gray-900">Bill Details</h2>
                          <button
                              onClick={closeModal}
                              className="text-gray-400 hover:text-gray-600"
                          >
                              <XMarkIcon className="w-6 h-6" />
                          </button>
                      </div>

                      <div className="p-6 space-y-6">
                          {/* Bill Info */}
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <p className="text-sm text-gray-600">Bill Number</p>
                                  <p className="font-semibold text-gray-900">{selectedBill.billNo}</p>
                              </div>
                              <div>
                                  <p className="text-sm text-gray-600">Date</p>
                                  <p className="font-semibold text-gray-900">
                                      {new Date(selectedBill.date).toLocaleDateString('en-IN')}
                                  </p>
                              </div>
                          </div>

                          {/* Customer Details */}
                          <div className="border-t border-gray-200 pt-4">
                              <h3 className="font-semibold text-gray-900 mb-3">Customer Information</h3>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                      <p className="text-sm text-gray-600">Name</p>
                                      <p className="font-medium text-gray-900">{selectedBill.customerName}</p>
                                  </div>
                                  <div>
                                      <p className="text-sm text-gray-600">Contact</p>
                                      <p className="font-medium text-gray-900">{selectedBill.customerContact}</p>
                                  </div>
                                  <div className="md:col-span-2">
                                      <p className="text-sm text-gray-600">Address</p>
                                      <p className="font-medium text-gray-900">{selectedBill.customerAddress}</p>
                                  </div>
                              </div>
                          </div>

                          {/* Vehicle Details */}
                          <div className="border-t border-gray-200 pt-4">
                              <h3 className="font-semibold text-gray-900 mb-3">Vehicle Information</h3>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div>
                                      <p className="text-sm text-gray-600">Model</p>
                                      <p className="font-medium text-gray-900">{selectedBill.model}</p>
                                  </div>
                                  <div>
                                      <p className="text-sm text-gray-600">Registration</p>
                                      <p className="font-medium text-gray-900 font-mono">{selectedBill.vehicleNo}</p>
                                  </div>
                                  <div>
                                      <p className="text-sm text-gray-600">Kilometers</p>
                                      <p className="font-medium text-gray-900">{selectedBill.km} km</p>
                                  </div>
                                  <div>
                                      <p className="text-sm text-gray-600">Next Service</p>
                                      <p className="font-medium text-gray-900">{selectedBill.nextServiceKm} km</p>
                                  </div>
                              </div>
                          </div>

                          {/* Items Table */}
                          <div className="border-t border-gray-200 pt-4">
                              <h3 className="font-semibold text-gray-900 mb-3">Service Details</h3>
                              <div className="overflow-x-auto">
                                  <table className="w-full border border-gray-200">
                                      <thead className="bg-gray-50">
                                          <tr>
                                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">No.</th>
                                              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border-b">Particulars</th>
                                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 border-b">Qty</th>
                                              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900 border-b">Rate</th>
                                              <th className="px-4 py-2 text-center text-sm font-semibold text-gray-900 border-b">Disc %</th>
                                              <th className="px-4 py-2 text-right text-sm font-semibold text-gray-900 border-b">Amount</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {selectedBill.items.map((item, index) => (
                                              <tr key={index} className="border-b">
                                                  <td className="px-4 py-2 text-sm text-gray-900">{index + 1}</td>
                                                  <td className="px-4 py-2 text-sm text-gray-900">{item.particulars}</td>
                                                  <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.quantity}</td>
                                                  <td className="px-4 py-2 text-sm text-gray-900 text-right">₹{item.rate}</td>
                                                  <td className="px-4 py-2 text-sm text-gray-900 text-center">{item.discount}%</td>
                                                  <td className="px-4 py-2 text-sm font-semibold text-gray-900 text-right">
                                                      ₹{calculateAmount(item.quantity, item.rate, item.discount).toLocaleString('en-IN')}
                                                  </td>
                                              </tr>
                                          ))}
                                          <tr className="bg-gray-50 font-bold">
                                              <td colSpan="5" className="px-4 py-3 text-sm text-right">TOTAL</td>
                                              {/* <td className="px-4 py-3 text-sm text-right">₹{selectedBill.total.toLocaleString('en-IN')}</td> */}
                                              <td className="px-4 py-3 text-sm text-right">₹{selectedBill.totalAmount ? selectedBill.totalAmount.toLocaleString() : "0"}</td>

                                          </tr>
                                      </tbody>
                                  </table>
                              </div>
                          </div>
                      </div>

                      <div className="border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
                          <button
                              onClick={closeModal}
                              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                          >
                              Close
                          </button>
                          <button
                            //   onClick={() => window.print()}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                              Delete
                          </button>
                      </div>
                  </div>
              </div>
          )}
      </div></>
  );
};

export default HistoryPage;