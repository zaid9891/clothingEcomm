import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight } from 'lucide-react';

const OrderSuccessPage: React.FC = () => {
  const location = useLocation();
  const order = location.state?.order;

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Not Found</h2>
          <Link
            to="/products"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
          <p className="text-gray-600">
            Thank you for your order. We'll send you a confirmation email shortly.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex items-center space-x-3 mb-6">
            <Package className="h-6 w-6 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Order Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Order Information</h3>
              <p className="text-sm text-gray-600">Order Number: <span className="font-medium">{order.orderNumber}</span></p>
              <p className="text-sm text-gray-600">Date: <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span></p>
              <p className="text-sm text-gray-600">Status: <span className="font-medium capitalize">{order.status}</span></p>
              <p className="text-sm text-gray-600">Total: <span className="font-medium">${order.totalAmount.toFixed(2)}</span></p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Shipping Address</h3>
              <p className="text-sm text-gray-600">{order.shippingAddress.street}</p>
              <p className="text-sm text-gray-600">
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
              </p>
              <p className="text-sm text-gray-600">{order.shippingAddress.country}</p>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Items Ordered</h3>
            <div className="space-y-3">
              {order.items.map((item: any) => (
                <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{item.product.name}</h4>
                    <p className="text-sm text-gray-600">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                  </div>
                  <span className="font-semibold text-gray-900">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/orders"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center space-x-2"
            >
              <span>View My Orders</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/products"
              className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
          
          <p className="text-sm text-gray-600">
            Need help? <Link to="/contact" className="text-blue-600 hover:text-blue-800">Contact our support team</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;