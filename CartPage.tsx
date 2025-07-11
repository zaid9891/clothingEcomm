import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';

const CartPage: React.FC = () => {
  const { items, total, updateQuantity, removeFromCart, clearCart, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      await removeFromCart(itemId);
    } else {
      await updateQuantity(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Please Login to View Cart</h2>
          <p className="text-gray-600 mb-6">You need to be logged in to access your shopping cart</p>
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <LoadingSpinner size="large" className="py-20" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added any items to your cart yet</p>
            <Link
              to="/products"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center space-x-2"
            >
              <span>Continue Shopping</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="mt-4 lg:mt-0 text-red-600 hover:text-red-800 transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">
                      <Link
                        to={`/products/${item.product._id}`}
                        className="hover:text-blue-600 transition-colors"
                      >
                        {item.product.name}
                      </Link>
                    </h3>
                    <p className="text-gray-600 text-sm mb-2">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    <p className="text-lg font-bold text-gray-900">
                      ${item.product.price.toFixed(2)}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Minus className="h-4 w-4 text-gray-600" />
                    </button>
                    
                    <span className="w-8 text-center font-semibold">
                      {item.quantity}
                    </span>
                    
                    <button
                      onClick={() => handleQuantityChange(item._id, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <Plus className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-red-600 hover:text-red-800 mt-2 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-semibold">${(total * 0.08).toFixed(2)}</span>
                </div>
                <div className="border-t pt-3">
                  <div className="flex justify-between">
                    <span className="text-lg font-bold">Total</span>
                    <span className="text-lg font-bold">
                      ${(total + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="h-5 w-5" />
              </button>

              <Link
                to="/products"
                className="block w-full text-center text-blue-600 hover:text-blue-800 mt-4 transition-colors"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;