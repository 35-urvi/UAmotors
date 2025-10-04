import React, { useState, useRef ,useEffect} from 'react';
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Navbar from '../components/Navbar';
import Logo from '../assets/Logo.png';
import QR from '../assets/QR.jpg';
import Audi from '../assets/Audi.png';
import Mg from '../assets/Mg.png';
import BMW from '../assets/BMW.png';
import Honda from '../assets/Honda.png';
import Volkswegan from '../assets/Volkswegan.jpg';
import Mahindra from '../assets/Mahindra.png';
import Kia from '../assets/Kia.png';
import Toyota from '../assets/Toyota.png';
import Hyundai from '../assets/hyundai.png';
import Tata from '../assets/Tata.png'
import Suzuki from '../assets/Suzuki.png';
import Mercedes from '../assets/Mercedes.png'

const BillingPage = () => {
  const [billNo, setBillNo] = useState("");
  const [billData, setBillData] = useState({
    date: new Date().toISOString().slice(0, 10),
    customerName: "",
    customerAddress: "",
    customerContact: "",
    vehicleNo: "",
    model: "",
    km: "",
    nextServiceKm: "",
  });

  
  const [items, setItems] = useState([
    { particulars: "", quantity: 1, rate: 0, discount: 0 },
  ]);

  const [message, setMessage] = useState("");

  // Fetch next bill number on page load
  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/billing/next-bill/")
      .then((res) => res.json())
      .then((data) => setBillNo(data.bill_no))
      .catch(() => setMessage("Error fetching bill number"));
  }, []);

  const handleItemChange = (index, field, value) => {
    const updated = [...items];
    updated[index][field] = value;
    setItems(updated);
  };

  const addRow = () => setItems([...items, { particulars: "", quantity: 1, rate: 0, discount: 0 }]);
  const removeRow = (index) => setItems(items.filter((_, i) => i !== index));

  const printRef = useRef();

  const addItem = () => {
    setItems([...items, { particulars: '', quantity: 1, rate: 0, discount: 0 }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  // const calculateAmount = (quantity, rate, discount) => {
  //   const gross = (parseFloat(quantity) || 0) * (parseFloat(rate) || 0);
  //   const discountAmount = gross * (parseFloat(discount) || 0) / 100;
  //   return gross - discountAmount;
  // };
  const calculateAmount = (q, r, d) => {
    let gross = q * r;
    return gross - (gross * d) / 100;
  };


  // const calculateTotal = () => {
  //   return items.reduce((total, item) => total + calculateAmount(item.quantity, item.rate, item.discount), 0);
  // };
  const calculateTotal = () =>
    items.reduce((sum, i) => sum + calculateAmount(i.quantity, i.rate, i.discount), 0);

  const numberToWords = (num) => {
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
    const teens = ['Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
    const thousands = ['', 'Thousand', 'Million', 'Billion'];

    if (num === 0) return 'Zero';

    const convertHundreds = (n) => {
      let result = '';
      if (n > 99) {
        result += ones[Math.floor(n / 100)] + ' Hundred ';
        n %= 100;
      }
      if (n >= 20) {
        result += tens[Math.floor(n / 10)] + ' ';
        n %= 10;
      } else if (n >= 10) {
        result += teens[n - 10] + ' ';
        return result;
      }
      if (n > 0) {
        result += ones[n] + ' ';
      }
      return result;
    };

    let result = '';
    let thousandIndex = 0;
    
    while (num > 0) {
      if (num % 1000 !== 0) {
        result = convertHundreds(num % 1000) + thousands[thousandIndex] + ' ' + result;
      }
      num = Math.floor(num / 1000);
      thousandIndex++;
    }

    result+="Only";
    return result.trim();
  };

  const handlePrint = () => {
    window.print();
  };

  // const handleDownloadPDF = () => {
  //   alert('Please install jsPDF package: npm install jspdf jspdf-autotable');
  // };
  // Convert image URL (imported file) to Base64

//  const handleDownloadPDF = () => {
//   const doc = new jsPDF("p", "pt", "a4");

//   // Header
//   doc.setFontSize(14);
//   doc.text("UA MOTORS", 40, 40);

//   // Example table
//   const tableColumn = ["No.", "Particulars", "Qty", "Rate", "Disc.%", "Amount"];
//   const tableRows = [];

//   items.forEach((item, index) => {
//     tableRows.push([
//       index + 1,
//       item.particulars || "-",
//       item.quantity,
//       item.rate,
//       item.discount,
//       Math.round(calculateAmount(item.quantity, item.rate, item.discount)),
//     ]);
//   });

//   tableRows.push([
//     { content: "TOTAL", colSpan: 5, styles: { halign: "right", fontStyle: "bold" } },
//     { content: Math.round(calculateTotal()), styles: { halign: "right", fontStyle: "bold" } },
//   ]);

//   // ✅ Correct usage
//   autoTable(doc, {
//     head: [tableColumn],
//     body: tableRows,
//     startY: 70,
//     theme: "grid",
//     styles: { fontSize: 9 },
//     headStyles: { fillColor: [66, 133, 244] },
//   });

//   // Save PDF
//   doc.save(`Bill-${billNo}.pdf`);
// };

const handleSave = async () => {
    const payload = {
      date: billData.date,
      customer_name: billData.customerName,
      customer_address: billData.customerAddress,
      customer_contact: billData.customerContact,
      vehicle_no: billData.vehicleNo,
      model: billData.model,
      km: billData.km,
      next_service_km: billData.nextServiceKm,
      total_amount: calculateTotal(),
      items: items.map((i) => ({
        particulars: i.particulars,
        quantity: i.quantity,
        rate: i.rate,
        discount: i.discount,
      })),
    };

    try {
      const res = await fetch("http://127.0.0.1:8000/api/billing/create/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(`✅ Bill saved successfully! Bill No: ${data.bill_no}`);
        setBillNo(data.bill_no); // refresh bill no
      } else {
        setMessage(`❌ Error: ${JSON.stringify(data)}`);
      }
    } catch (err) {
      setMessage("❌ Server error: " + err.message);
    }
  };

  const generateNewBill = () => {
    setBillNo(prev => prev + 1);
    setBillData({
      date: new Date().toISOString().split('T')[0],
      customerName: '',
      customerAddress: '',
      customerContact: '',
      vehicleNo: '',
      model: '',
      km: '',
      nextServiceKm: ''
    });
    setItems([{ particulars: '', quantity: 1, rate: 0, discount: 0 }]);
  };

  // Split items into chunks of 11 for pagination
  const itemsPerPage = 11;
  const totalPages = Math.ceil(items.length / itemsPerPage);
  
  const getPageItems = (pageNum) => {
    const start = (pageNum - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return items.slice(start, end);
  };

  // Header Component (reusable for each page)
  const BillHeader = () => (
    <div className="text-center mb-4">
      <div className="flex justify-between items-start text-xs mb-auto gap-2">
        {/* Left side */}
        <div className="text-left">
          <div>CASH MEMO/QUOTATION</div>
          <strong><div>VASU PATEL: 9427027343</div></strong>
        </div>

        {/* Right side - QR always top right */}
        <div className="text-right">
          <strong><div className="mb-1 text-center">SCAN QR AND PAY</div></strong>
          <img 
            src={QR} 
            alt="QR" 
            className="w-24 h-24 sm:w-32 sm:h-32 ml-auto"
          />
        </div>
      </div>

      
      {/* Logo and Company Name */}
      <div className="mb-2">
        <div className="w-32  sm:w-32  bg-white-600 rounded-full mx-auto flex items-center justify-center mb-auto">
          <img src={Logo} alt="Logo" className=" object-contain"/>
        </div>
        <p className="text-xs sm:text-sm font-semibold mt-2">Maintenance, Service And Repair The Only One Solution</p>
      </div>

      {/* Address */}
      <div className="text-xs mb-4 border-t border-b border-black py-2">
        <strong>
          <div>Shop No.1 Vishawas City-6, Styamev Vista Road, Near Gota Char Rasta</div>
          <div>Gota, Ahmedabad - 382481</div>
        </strong>
      </div>
    </div>
  );

  // Customer Details Component (reusable for each page)
  const CustomerDetails = () => (
    <div className="border border-black mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black">
        <div className="sm:border-r border-black p-3 border-b sm:border-b-0">
          {/* <div className="mb-2">
            <strong>Customer's Name:</strong>
            <input
              type="text"
              value={billData.customerName}
              onChange={(e) => setBillData({...billData, customerName: e.target.value})}
              className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            />
          </div> */}
          <div className="flex items-center gap-2 mb-2">
            <strong>Customer's Name:</strong>
            <input
              type="text"
              value={billData.customerName}
              onChange={(e) => setBillData({...billData, customerName: e.target.value})}
              className="flex-1 border-b border-gray-300 print:border-0 print:bg-transparent text-sm"
              placeholder="Enter name"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <strong>Address:</strong>
            <input
              type="text"
              value={billData.customerAddress}
              onChange={(e) => setBillData({...billData, customerAddress: e.target.value})}
              className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
              placeholder="Ahmedabad"
            />
          </div>
          <div className='flex items-center gap-2 mb-2'>
            <strong>Contact:</strong>
            <input
              type="text"
              value={billData.customerContact}
              onChange={(e) => setBillData({...billData, customerContact: e.target.value})}
              className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
              placeholder="0000000000"
            />
          </div>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <strong>Bill No:</strong>
            <span className="ml-2">{billNo}</span>
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
          </div>
          <div>
            <strong>Date:</strong>
            <input
              type="date"
              value={billData.date}
              onChange={(e) => setBillData({...billData, date: e.target.value})}
              className="ml-2 border border-gray-300 px-2 py-1 print:border-0 print:bg-transparent text-sm w-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Vehicle Details */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-3 p-3 text-sm">
        <div>
          <strong>Model:</strong>
          <input
            type="text"
            value={billData.model}
            onChange={(e) => setBillData({...billData, model: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="BMW 3 Series"
          />
        </div>
        <div>
          <strong>Reg. No.:</strong>
          <input
            type="text"
            value={billData.vehicleNo}
            onChange={(e) => setBillData({...billData, vehicleNo: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="GJ 01 AA 0000"
          />
        </div>
        <div>
          <strong>K.M.:</strong>
          <input
            type="number"
            value={billData.km}
            onChange={(e) => setBillData({...billData, km: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="10000"
          />
        </div>
        <div>
          <strong>Next Service KM:</strong>
          <input
            type="number"
            value={billData.nextServiceKm}
            onChange={(e) => setBillData({...billData, nextServiceKm: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="15000"
          />
        </div>
      </div>
    </div>
  );

  return (
      <>
      <div className="print:hidden">
        <Navbar />
      </div>
      <div className="min-h-screen bg-gray-100 p-2 sm:p-4">
      <div className="max-w-4xl mx-auto">
        {/* Control Buttons */}
        <div className="mb-4 flex flex-wrap gap-2 sm:gap-4 print:hidden">
          <button
            onClick={handlePrint}
            className="bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 text-sm flex-1 sm:flex-none"
          >
            Print Bill
          </button>
          <button
            onClick={handleSave}
            className="bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 text-sm flex-1 sm:flex-none"
          >
            Save Bill
          </button>
          <button
            onClick={generateNewBill}
            className="bg-purple-600 text-white px-3 py-2 rounded hover:bg-purple-700 text-sm flex-1 sm:flex-none"
          >
            New Bill
          </button>
        </div>

        {/* Bill - Screen View */}
        <div ref={printRef} className="bg-white p-3 sm:p-6 border border-gray-300 print:border-0 print:p-0 screen-view">
          <BillHeader />
          {/* <CustomerDetails /> */}
          <div className="border border-black mb-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 border-b border-black">
        <div className="sm:border-r border-black p-3 border-b sm:border-b-0">
          <div className="flex items-center gap-2 mb-2">
            <strong>Customer's Name:</strong>
            <input
              type="text"
              value={billData.customerName}
              onChange={(e) => setBillData({...billData, customerName: e.target.value})}
              className="flex-1 border-b border-gray-300 print:border-0 print:bg-transparent text-sm"
              placeholder="Enter name"
            />
          </div>

          <div className="flex items-center gap-2 mb-2">
            <strong>Address:</strong>
            <input
              type="text"
              value={billData.customerAddress}
              onChange={(e) => setBillData({...billData, customerAddress: e.target.value})}
              className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
              placeholder="Ahmedabad"
            />
          </div>
          <div className='flex items-center gap-2 mb-2'>
            <strong>Contact:</strong>
            <input
              type="text"
              value={billData.customerContact}
              onChange={(e) => setBillData({...billData, customerContact: e.target.value})}
              className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
              placeholder="0000000000"
            />
          </div>
        </div>
        <div className="p-3">
          <div className="mb-2">
            <strong>Bill No:</strong>
            <span className="ml-2">{billNo}</span>
            {message && <p className="mt-2 text-sm text-red-600">{message}</p>}
          </div>
          <div>
            <strong>Date:</strong>
            <input
              type="date"
              value={billData.date}
              onChange={(e) => setBillData({...billData, date: e.target.value})}
              className="ml-2 border border-gray-300 px-2 py-1 print:border-0 print:bg-transparent text-sm w-auto"
            />
          </div>
        </div>
      </div>
      
      {/* Vehicle Details */}
      <div className="grid grid-cols-1 sm:grid-cols-4 lg:grid-cols-4 gap-3 p-3 text-sm">
        <div>
          <strong>Model:</strong>
          <input
            type="text"
            value={billData.model}
            onChange={(e) => setBillData({...billData, model: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="BMW 3 Series"
          />
        </div>
        <div>
          <strong>Reg. No.:</strong>
          <input
            type="text"
            value={billData.vehicleNo}
            onChange={(e) => setBillData({...billData, vehicleNo: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="GJ 01 AA 0000"
          />
        </div>
        <div>
          <strong>K.M.:</strong>
          <input
            type="number"
            value={billData.km}
            onChange={(e) => setBillData({...billData, km: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="10000"
          />
        </div>
        <div>
          <strong>Next Service KM:</strong>
          <input
            type="number"
            value={billData.nextServiceKm}
            onChange={(e) => setBillData({...billData, nextServiceKm: e.target.value})}
            className="w-full border-b border-gray-300 mt-1 print:border-0 print:bg-transparent text-sm"
            placeholder="15000"
          />
        </div>
      </div>
    </div>

          {/* Items Table */}
          <div className="overflow-x-auto mb-4">
            <table className="w-full border-collapse border border-black min-w-[640px]">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-black p-2 w-12 text-sm">NO.</th>
                  <th className="border border-black p-2 text-sm">PARTICULARS</th>
                  <th className="border border-black p-2 w-16 text-sm">QTY.</th>
                  <th className="border border-black p-2 w-20 text-sm">RATE</th>
                  <th className="border border-black p-2 w-20 text-sm">DISC.%</th>
                  <th className="border border-black p-2 w-24 text-sm">AMOUNT</th>
                  <th className="border border-black p-2 w-16 print:hidden text-sm">Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="border border-black p-2 text-center text-sm">
                      {index + 1}
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="text"
                        value={item.particulars}
                        onChange={(e) => updateItem(index, 'particulars', e.target.value)}
                        className="w-full bg-transparent print:border-0 text-sm"
                        placeholder="Enter service/part details" />
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-center print:border-0 text-sm"
                        min="1" />
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="number"
                        value={item.rate}
                        onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-right print:border-0 text-sm"
                        step="0.01" />
                    </td>
                    <td className="border border-black p-2">
                      <input
                        type="number"
                        value={item.discount}
                        onChange={(e) => updateItem(index, 'discount', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent text-center print:border-0 text-sm"
                        step="0.01"
                        max="100"
                        min="0" />
                    </td>
                    <td className="border border-black p-2 text-right font-semibold text-sm">
                      {Math.round(calculateAmount(item.quantity, item.rate, item.discount))}
                    </td>
                    <td className="border border-black p-2 text-center print:hidden">
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 text-xs"
                        disabled={items.length === 1}
                      >
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Empty rows for spacing */}
                {[...Array(Math.max(0, 8 - items.length))].map((_, index) => (
                  <tr key={`empty-${index}`} className="h-8">
                    <td className="border border-black p-2 text-center text-sm">{items.length + index + 1}</td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2"></td>
                    <td className="border border-black p-2 print:hidden"></td>
                  </tr>
                ))}

                {/* Total Row */}
                <tr>
                  <td colSpan="5" className="border border-black p-2 text-right font-bold">TOTAL</td>
                  <td className="border border-black p-2 text-right font-bold text-sm">
                    {Math.round(calculateTotal())}
                  </td>
                  <td className="border border-black p-2 print:hidden"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Add Item Button */}
          <div className="mb-4 print:hidden">
            <button
              onClick={addItem}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm w-full sm:w-auto"
            >
              Add Item
            </button>
          </div>

          {/* Amount in Words */}
          <div className="mb-4 border border-black p-3">
            <strong>Rupees</strong> {numberToWords(Math.floor(calculateTotal()))}
          </div>

          {/* Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="text-xs w-full sm:w-auto">
              {/* Car Brand Logos */}
              <div className="flex flex-wrap gap-2 mt-4">

                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mercedes} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Audi} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={BMW} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Volkswegan} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mg} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mahindra} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Toyota} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Kia} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Hyundai} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Tata} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Suzuki} alt="Logo" className="w-full h-full object-contain" /></div>
                <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Honda} alt="Logo" className="w-full h-full object-contain" /></div>
              </div>
            </div>

            <div className="text-right w-full sm:w-auto">
              <p className="font-semibold mb-16">FOR, UA MOTORS</p>
              <div className="border-t border-black w-32 pt-2 ml-auto">
                <p className="text-xs">Authorized Signature</p>
              </div>
            </div>
          </div>

          {/* Page indicator */}
          <div className="text-right mt-4 text-xs">
            Page 1 of 1
          </div>
        </div>

        {/* Print View - Multiple Pages */}
        <div className="print-view" style={{ display: 'none' }}>
          {Array.from({ length: totalPages }, (_, pageIndex) => {
            const pageItems = getPageItems(pageIndex + 1);
            const isLastPage = pageIndex === totalPages - 1;
            const startIndex = pageIndex * itemsPerPage;

            return (
              // <div key={pageIndex} className="print-page" style={{ pageBreakAfter: isLastPage ? 'auto' : 'always' }}>
              <div 
                key={pageIndex} 
                className="print-page" 
                style={{ pageBreakAfter: isLastPage ? 'auto' : 'always', minHeight: "100%" }}
              >
                <BillHeader />
                <CustomerDetails />

                {/* Items Table for this page */}
                <div className="mb-4">
                  <table className="w-full border-collapse border border-black">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-black p-2 w-12 text-sm">NO.</th>
                        <th className="border border-black p-2 text-sm">PARTICULARS</th>
                        <th className="border border-black p-2 w-16 text-sm">QTY.</th>
                        <th className="border border-black p-2 w-20 text-sm">RATE</th>
                        <th className="border border-black p-2 w-20 text-sm">DISC.%</th>
                        <th className="border border-black p-2 w-24 text-sm">AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pageItems.map((item, index) => (
                        <tr key={index}>
                          <td className="border border-black p-2 text-center text-sm">
                            {startIndex + index + 1}
                          </td>
                          <td className="border border-black p-2 text-sm">
                            {item.particulars || 'Enter service/part details'}
                          </td>
                          <td className="border border-black p-2 text-center text-sm">
                            {item.quantity}
                          </td>
                          <td className="border border-black p-2 text-right text-sm">
                            {item.rate}
                          </td>
                          <td className="border border-black p-2 text-center text-sm">
                            {item.discount}
                          </td>
                          <td className="border border-black p-2 text-right font-semibold text-sm">
                            {Math.round(calculateAmount(item.quantity, item.rate, item.discount))}
                          </td>
                        </tr>
                      ))}

                      {/* Show total only on last page */}
                      {isLastPage && (
                        <tr>
                          <td colSpan="5" className="border border-black p-2 text-right font-bold">TOTAL</td>
                          <td className="border border-black p-2 text-right font-bold text-sm">
                            {Math.round(calculateTotal())}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Show footer only on last page */}
                {isLastPage && (
                  <>
                    {/* Amount in Words */}
                    <div className="mb-4 border border-black p-3">
                      <strong>Rupees</strong> {numberToWords(Math.floor(calculateTotal()))}
                    </div>

                    {/* Footer */}
                    <div className="flex justify-between items-end gap-4">
                      <div className="text-xs">
                        {/* Car Brand Logos */}
                        <div className="flex flex-wrap gap-2 mt-4">
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mercedes} alt="Logo" className="w-full h-full bg-white object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Audi} alt="Logo" className="w-full h-full bg-white object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={BMW} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Volkswegan} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mg} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Mahindra} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Toyota} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Kia} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Hyundai} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Tata} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Suzuki} alt="Logo" className="w-full h-full object-contain" /></div>
                          <div className="w-8 h-6  rounded flex items-center justify-center text-xs"><img src={Honda} alt="Logo" className="w-full h-full object-contain" /></div>
                        </div>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold mb-16">FOR, UA MOTORS</p>
                        <div className="border-t border-black w-32 pt-2 ml-auto">
                          <p className="text-xs">Authorized Signature</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Page indicator */}
                <div className="text-right mt-4 text-xs">
                  Page {pageIndex + 1} of {totalPages}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Print Styles */}
      <style>{`
        @media print {
          body { margin: 0; }
          .print\\:hidden { display: none !important; }
          .print\\:border-0 { border: none !important; }
          .print\\:p-0 { padding: 0 !important; }
          .print\\:bg-transparent { background: transparent !important; }
          @page { 
            size: A4; 
            margin: 0.5in; 
          }
          
          /* Hide screen view, show print view */
          .screen-view {
            display: none !important;
          }
          
          .print-view {
            display: block !important;
          }
          
          .print-page {
            page-break-inside: avoid;
          }
          
          /* Ensure proper spacing */
          table {
            width: 100%;
            border-collapse: collapse;
          }
        }
        
        @media screen {
          .print-view {
            display: none;
          }
          
          .screen-view {
            display: block;
          }
        }
      `}</style>
    </div></>
    
  );
};

export default BillingPage;