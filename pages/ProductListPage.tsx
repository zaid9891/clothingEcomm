import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List, SortAsc } from 'lucide-react';
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

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [filterOpen, setFilterOpen] = useState(false);

  const category = searchParams.get('category');
  const search = searchParams.get('search');
  const featured = searchParams.get('featured');
  const page = searchParams.get('page') || '1';

  useEffect(() => {
    fetchProducts();
  }, [searchParams]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (search) params.append('search', search);
      if (featured) params.append('featured', featured);
      params.append('page', page);
      params.append('limit', '12');

      const response = await fetch(`/api/products?${params.toString()}`);
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams);
    params.set('page', newPage.toString());
    setSearchParams(params);
  };

  const handleCategoryFilter = (newCategory: string) => {
    const params = new URLSearchParams(searchParams);
    if (newCategory) {
      params.set('category', newCategory);
    } else {
      params.delete('category');
    }
    params.delete('page');
    setSearchParams(params);
  };

  const getPageTitle = () => {
    if (search) return `Search results for "${search}"`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}'s Clothing`;
    if (featured) return 'Featured Products';
    return 'All Products';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{getPageTitle()}</h1>
            {pagination && (
              <p className="text-gray-600">
                Showing {pagination.totalProducts} products
              </p>
            )}
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
            
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg ${
                  viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-500 hover:text-white transition-colors`}
              >
                <Grid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg ${
                  viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
                } hover:bg-blue-500 hover:text-white transition-colors`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filter */}
          <div className={`lg:w-64 ${filterOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-20">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={!category}
                      onChange={() => handleCategoryFilter('')}
                      className="mr-2"
                    />
                    All Categories
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'men'}
                      onChange={() => handleCategoryFilter('men')}
                      className="mr-2"
                    />
                    Men
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'women'}
                      onChange={() => handleCategoryFilter('women')}
                      className="mr-2"
                    />
                    Women
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'kids'}
                      onChange={() => handleCategoryFilter('kids')}
                      className="mr-2"
                    />
                    Kids
                  </label>
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Price Range</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Under $25
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    $25 - $50
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    $50 - $100
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" className="mr-2" />
                    Over $100
                  </label>
                </div>
              </div>

              {/* Sort Options */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sort By</h4>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {loading ? (
              <LoadingSpinner size="large" className="py-12" />
            ) : products.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products found</p>
              </div>
            ) : (
              <>
                <div className={`grid gap-6 ${
                  viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                    : 'grid-cols-1'
                }`}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-12 flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                        disabled={!pagination.hasPrevPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Previous
                      </button>
                      
                      {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((pageNum) => (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`px-4 py-2 text-sm font-medium rounded-lg ${
                            pageNum === pagination.currentPage
                              ? 'bg-blue-600 text-white'
                              : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      ))}
                      
                      <button
                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                        disabled={!pagination.hasNextPage}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListPage;