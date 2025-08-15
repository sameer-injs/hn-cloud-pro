import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, ChevronUp, Truck, CreditCard, Package,
  CheckCircle, Clock, XCircle, MapPin, ArrowLeft, X, DollarSign
} from 'lucide-react';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const UserOrdersPage = () => {
  // Order data
  const orders = [
    { 
      id: '#ORD-1001', date: 'Oct 15, 2023', amount: 1250, 
      payment: 'online', status: 'delivered', address: '123 Main St, New York, NY 10001',
      books: [
        { title: 'The Silent Echo', category: 'Mystery', quantity: 1, price: 205 },
        { title: 'Digital Fortress', category: 'Thriller', quantity: 1, price: 190 }
      ]
    },
    // Other orders...
  ];

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Status options
  const statusOptions = [
    { value: 'pending', label: 'Pending', icon: Clock, color: 'bg-yellow-100 text-yellow-800', iconColor: 'text-yellow-500' },
    { value: 'processing', label: 'Processing', icon: Package, color: 'bg-blue-100 text-blue-800', iconColor: 'text-blue-500' },
    { value: 'shipped', label: 'Shipped', icon: Truck, color: 'bg-indigo-100 text-indigo-800', iconColor: 'text-indigo-500' },
    { value: 'delivered', label: 'Delivered', icon: CheckCircle, color: 'bg-green-100 text-green-800', iconColor: 'text-green-500' },
    { value: 'cancelled', label: 'Cancelled', icon: XCircle, color: 'bg-red-100 text-red-800', iconColor: 'text-red-500' },
  ];

  // Sorting logic
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Memoized sorted orders
  const sortedOrders = useMemo(() => {
    return [...orders].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];
      
      if (sortConfig.key === 'date') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.date) - new Date(b.date) 
          : new Date(b.date) - new Date(a.date);
      }
      
      return sortConfig.direction === 'asc' 
        ? aVal > bVal ? 1 : -1 
        : aVal < bVal ? 1 : -1;
    });
  }, [orders, sortConfig]);

  // Status badge component
  const StatusBadge = ({ status }) => {
    const option = statusOptions.find(opt => opt.value === status);
    if (!option) return null;
    const Icon = option.icon;
    return (
      <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${option.color}`}>
        <Icon className={`w-4 h-4 ${option.iconColor}`} />
        <span>{option.label}</span>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br pt-28 from-[#43C6AC]/90 to-[#2B5876]/90 py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center mb-8">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center text-[#1A237E] hover:text-[#43C6AC] transition-colors"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-center flex-1 bg-white bg-clip-text text-transparent">
              My Orders
            </h1>
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white">
                  <tr>
                    {[
                      { key: 'id', label: 'Order ID' },
                      { key: 'date', label: 'Date' },
                      { key: 'amount', label: 'Amount' },
                      { key: null, label: 'Payment' },
                      { key: null, label: 'Status' },
                      { key: null, label: 'Actions' }
                    ].map((col) => (
                      <th 
                        key={col.key || col.label}
                        className="px-6 py-4 text-left cursor-pointer"
                        onClick={() => col.key && handleSort(col.key)}
                      >
                        <div className="flex items-center">
                          {col.label}
                          {col.key && sortConfig.key === col.key && (
                            sortConfig.direction === 'asc' 
                              ? <ChevronUp className="ml-1" /> 
                              : <ChevronDown className="ml-1" />
                          )}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedOrders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {order.date}
                      </td>
                      <td className="px-6 py-4 font-medium text-gray-900">
                        ₹{order.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                          order.payment === 'online' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {order.payment === 'online' ? (
                            <CreditCard className="w-4 h-4" />
                          ) : (
                            <DollarSign className="w-4 h-4" />
                          )}
                          <span>{order.payment === 'online' ? 'Online' : 'COD'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg text-xs hover:opacity-90 transition-opacity"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Empty State */}
              {!sortedOrders.length && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <Package className="text-gray-400 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No orders found</h3>
                  <p className="text-gray-500 text-sm">You haven't placed any orders yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="border-b p-6 flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold text-gray-800">
                    Order Details: {selectedOrder.id}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Ordered on {selectedOrder.date}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Shipping Information */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Shipping Information
                  </h3>
                  <div className="space-y-4">
                    <p className="text-gray-600">
                      {selectedOrder.address}
                    </p>
                    <div className="flex items-center">
                      <Truck className="w-5 h-5 text-gray-500 mr-3" />
                      <div>
                        <p className="font-medium">Standard Shipping</p>
                        <p className="text-gray-600 text-sm">Estimated 3-5 business days</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Order Summary */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Order Summary
                  </h3>
                  <div className="space-y-4">
                    {selectedOrder.books.map((book, i) => (
                      <div key={i} className="flex justify-between items-center border-b pb-3">
                        <div>
                          <p className="font-medium">{book.title}</p>
                          <p className="text-gray-600 text-sm">{book.category}</p>
                        </div>
                        <div className="text-right">
                          <p>Qty: {book.quantity}</p>
                          <p className="text-gray-500 text-sm">₹{book.price.toFixed(2)} each</p>
                        </div>
                      </div>
                    ))}
                    
                    <div className="pt-4 space-y-2">
                      {[
                        { label: 'Subtotal:', value: `₹${selectedOrder.amount.toFixed(2)}` },
                        { label: 'Shipping:', value: 'Free', className: 'text-green-600' },
                        { label: 'Tax (5%):', value: `₹${(selectedOrder.amount * 0.05).toFixed(2)}` },
                        { 
                          label: 'Total:', 
                          value: `₹${(selectedOrder.amount * 1.05).toFixed(2)}`,
                          className: 'font-bold text-lg text-[#1A237E] pt-2 border-t' 
                        }
                      ].map((item, i) => (
                        <div key={i} className={`flex justify-between ${item.className || ''}`}>
                          <span className="text-gray-600">{item.label}</span>
                          <span>{item.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Payment Information */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Payment Information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Method:</span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        selectedOrder.payment === 'online' 
                          ? 'bg-purple-100 text-purple-800' 
                          : 'bg-orange-100 text-orange-800'
                      }`}>
                        {selectedOrder.payment === 'online' ? 'Online Payment' : 'Cash on Delivery'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Status */}
                <div className="border rounded-xl p-5">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Order Status
                  </h3>
                  <div className="flex items-center">
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                </div>
              </div>

              <div className="border-t p-6 flex justify-end">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default UserOrdersPage;