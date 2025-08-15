import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CreditCard, DollarSign, MapPin, ShoppingCart, CheckCircle } from 'lucide-react';
import { useCart } from '../../CartContext/CartContext';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/Footer';

const Checkout = () => {
  const { cart, dispatch } = useCart();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', address: '',
    city: '', state: '', zip: '', paymentMethod: 'cod'
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const calculateTotal = () => cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  
  const subtotal = calculateTotal();
  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = (e) => {
    e.preventDefault();
    const newOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
    setOrderId(newOrderId);
    setOrderPlaced(true);
    dispatch({ type: 'CLEAR_CART' });
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#43C6AC] to-[#F8FFAE] py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#1A237E] to-[#43C6AC] bg-clip-text text-transparent mb-4">
              Order Confirmed!
            </h1>
            <p className="text-gray-600 text-lg mb-8">
              Thank you for your purchase. Your order has been placed successfully.
            </p>
            
            <div className="bg-gradient-to-r from-[#43C6AC]/10 to-[#F8FFAE]/10 rounded-xl p-6 mb-8 max-w-lg mx-auto">
              {[
                { label: 'Order ID:', value: orderId },
                { label: 'Payment Method:', value: formData.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment' },
                { label: 'Total Amount:', value: `₹${subtotal.toFixed(2)}`, className: 'text-xl font-bold text-[#1A237E]' }
              ].map((item, i) => (
                <div key={i} className={`flex justify-between items-center ${i < 2 ? 'mb-4' : ''}`}>
                  <span className="text-gray-700">{item.label}</span>
                  <span className={item.className || 'font-bold text-gray-900'}>{item.value}</span>
                </div>
              ))}
            </div>
            
            <p className="text-gray-600 mb-8">
              We've sent a confirmation email to <span className="font-medium">{formData.email}</span>. 
              Your order will be shipped to:
            </p>
            <div className="bg-white border border-gray-200 rounded-xl p-4 mb-8 max-w-lg mx-auto">
              <p className="text-gray-800">{formData.name}</p>
              <p className="text-gray-600">{formData.address}</p>
              <p className="text-gray-600">{formData.city}, {formData.state} {formData.zip}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/books" className="px-6 py-3 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white rounded-lg font-medium hover:opacity-90">
                Continue Shopping
              </Link>
              <Link to="/orders" className="px-6 py-3 bg-white border border-[#43C6AC] text-[#43C6AC] rounded-lg font-medium hover:bg-[#43C6AC]/10">
                View Order Details
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const paymentMethods = [
    { 
      id: 'cod', 
      label: 'Cash on Delivery', 
      description: 'Pay when you receive the order',
      icon: DollarSign,
      iconColor: 'text-orange-500'
    },
    { 
      id: 'online', 
      label: 'Online Payment', 
      description: 'Pay with credit/debit card',
      icon: CreditCard,
      iconColor: 'text-purple-500'
    }
  ];

  const formFields = [
    [
      { name: 'name', label: 'Full Name', type: 'text', required: true },
      { name: 'email', label: 'Email', type: 'email', required: true }
    ],
    [
      { name: 'phone', label: 'Phone Number', type: 'tel', required: true },
      { name: 'city', label: 'City', type: 'text', required: true }
    ],
    [
      { name: 'address', label: 'Street Address', type: 'text', required: true, fullWidth: true }
    ],
    [
      { name: 'state', label: 'State', type: 'text', required: true },
      { name: 'zip', label: 'ZIP Code', type: 'text', required: true }
    ]
  ];

  return (
    <>
      <Navbar/> 
      <div className="min-h-screen bg-gradient-to-br pt-28 from-[#43C6AC] to-[#F8FFAE] py-12">
        <div className="container mx-auto px-4">
          <Link to="/cart" className="inline-flex items-center text-[#1A237E] font-medium mb-6 hover:underline">
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Cart
          </Link>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {/* Left Column - Checkout Form */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Checkout Details</h2>
              <p className="text-gray-600 mb-6">Please enter your information to complete the order</p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Shipping Address
                  </h3>
                  
                  {formFields.map((row, rowIndex) => (
                    <div key={rowIndex} className={`grid grid-cols-1 ${row.some(field => field.fullWidth) ? '' : 'md:grid-cols-2'} gap-4 ${rowIndex > 0 ? 'mt-4' : ''}`}>
                      {row.map(field => (
                        <div key={field.name} className={field.fullWidth ? 'col-span-full' : ''}>
                          <label className="block text-gray-700 mb-2">{field.label}</label>
                          <input
                            type={field.type}
                            name={field.name}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#43C6AC] focus:border-transparent"
                            required={field.required}
                          />
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-[#43C6AC]" />
                    Payment Method
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {paymentMethods.map(method => (
                      <div key={method.id}>
                        <input
                          type="radio"
                          id={method.id}
                          name="paymentMethod"
                          value={method.id}
                          checked={formData.paymentMethod === method.id}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <label 
                          htmlFor={method.id} 
                          className={`block p-4 border-2 rounded-lg cursor-pointer ${
                            formData.paymentMethod === method.id
                              ? 'border-[#43C6AC] bg-[#43C6AC]/10'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="flex items-center">
                            <method.icon className={`w-6 h-6 mr-3 ${method.iconColor}`} />
                            <div>
                              <span className="block font-medium text-gray-900">{method.label}</span>
                              <span className="block text-sm text-gray-600">{method.description}</span>
                            </div>
                          </div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-[#1A237E] to-[#43C6AC] text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
                >
                  Place Order
                </button>
              </form>
            </div>
            
            {/* Right Column - Order Summary */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 h-fit">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <ShoppingCart className="w-6 h-6 mr-2 text-[#43C6AC]" />
                Order Summary
              </h2>
              
              <div className="border-b border-gray-200 pb-4 mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Items</h3>
                <div className="space-y-4">
                  {cart.items.length > 0 ? (
                    cart.items.map(item => (
                      <div key={item.id} className="flex items-center">
                        <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mr-4" />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{item.title}</h4>
                          <p className="text-gray-600 text-sm">by {item.author}</p>
                        </div>
                        <div className="ml-4 text-right">
                          <p className="font-medium text-gray-900">₹{item.price.toFixed(2)}</p>
                          <p className="text-gray-600 text-sm">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-600">Your cart is empty</p>
                  )}
                </div>
              </div>
              
              <div className="border-b border-gray-200 pb-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Order Details</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Subtotal', value: `₹${subtotal.toFixed(2)}` },
                    { label: 'Shipping', value: 'FREE' },
                    { label: 'Tax', value: `₹${tax.toFixed(2)}` }
                  ].map((item, i) => (
                    <div key={i} className="flex justify-between">
                      <span className="text-gray-600">{item.label}</span>
                      <span className="text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between items-center mb-8">
                <span className="text-lg font-bold text-gray-800">Total</span>
                <span className="text-xl font-bold text-[#1A237E]">₹{total.toFixed(2)}</span>
              </div>
              
              <div className="bg-gradient-to-r from-[#43C6AC]/10 to-[#F8FFAE]/10 rounded-xl p-4">
                <h3 className="font-medium text-gray-800 mb-2">Delivery Estimate</h3>
                <p className="text-gray-600">
                  Your order will be delivered within 3-5 business days after processing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  );
};

export default Checkout;