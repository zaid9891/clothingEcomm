import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, TrendingUp, Shield, Truck, Headphones } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import LoadingSpinner from '../components/LoadingSpinner';

interface Product {
  _id: string;
  name: string;
  price: number;
  images: string[];
  category: string;
  featured: boolean;
  brand: string;
}

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products/featured/list');
      if (response.ok) {
        const data = await response.json();
        setFeaturedProducts(data);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    {
      name: 'Men',
      image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg',
      link: '/products?category=men',
      description: 'Stylish clothing for men',
    },
    {
      name: 'Women',
      image: 'https://images.pexels.com/photos/1126993/pexels-photo-1126993.jpeg',
      link: '/products?category=women',
      description: 'Fashionable outfits for women',
    },
    {
      name: 'Kids',
      image: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
      link: '/products?category=kids',
      description: 'Comfortable clothes for kids',
    },
  ];

  const features = [
    {
      icon: <Truck className="h-8 w-8 text-blue-600" />,
      title: 'Free Shipping',
      description: 'Free shipping on orders over $50',
    },
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'Secure Payment',
      description: 'Your payment information is secure',
    },
    {
      icon: <Headphones className="h-8 w-8 text-blue-600" />,
      title: '24/7 Support',
      description: 'Customer support available anytime',
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-blue-600" />,
      title: 'Best Quality',
      description: 'Premium quality clothing guaranteed',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold mb-6">
                Fashion That Fits Your{' '}
                <span className="text-blue-200">Lifestyle</span>
              </h1>
              <p className="text-xl text-blue-100 mb-8">
                Discover premium clothing for men, women, and kids. Quality materials, 
                modern designs, and affordable prices.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/products"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
                >
                  Shop Now
                  <ChevronRight className="ml-2 h-5 w-5" />
                </Link>
                <Link
                  to="/products?featured=true"
                  className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors inline-flex items-center justify-center"
                >
                  View Featured
                </Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg"
                alt="Fashion collection"
                className="rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover our carefully curated collections designed for every member of your family
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link
                key={category.name}
                to={category.link}
                className="group relative overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="aspect-w-16 aspect-h-12">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-30 transition-colors" />
                <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
                  <h3 className="text-2xl font-bold mb-2">{category.name}</h3>
                  <p className="text-center px-4">{category.description}</p>
                  <div className="mt-4 bg-white text-black px-6 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                    Shop Now
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Check out our handpicked selection of trending and popular items
            </p>
          </div>
          
          {loading ? (
            <LoadingSpinner size="large" className="py-12" />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link
              to="/products?featured=true"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-flex items-center"
            >
              View All Featured Products
              <ChevronRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We're committed to providing you with the best shopping experience
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Update Your Wardrobe?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who trust us for their fashion needs
          </p>
          <Link
            to="/products"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
          >
            Start Shopping
            <ChevronRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;