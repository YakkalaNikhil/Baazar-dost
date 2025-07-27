import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MapPin,
  Phone,
  Star,
  Clock,
  Verified,
  Filter,
  Search,
  Navigation,
  Package,
  Truck,
  Award,
  Users,
  TrendingUp
} from 'lucide-react'
import { stores, storeTypes } from '../data/stores'

const SuppliersPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('')
  const [sortBy, setSortBy] = useState('rating')

  // Filter and sort suppliers
  const filteredSuppliers = stores
    .filter(store => {
      const matchesSearch = store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           store.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
      const matchesType = !selectedType || store.type === selectedType
      return matchesSearch && matchesType
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating
        case 'distance':
          return (a.distance || 0) - (b.distance || 0)
        case 'name':
          return a.name.localeCompare(b.name)
        default:
          return 0
      }
    })

  const SupplierCard = ({ supplier }) => (
    <div className="card hover:shadow-lg transition-all duration-300">
      {/* Supplier Image */}
      <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-4">
        <img
          src={supplier.image}
          alt={supplier.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop'
          }}
        />
      </div>

      {/* Supplier Info */}
      <div className="space-y-3">
        <div className="flex items-start justify-between">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white leading-tight">
            {supplier.name}
          </h3>
          {supplier.verified && (
            <div className="flex items-center space-x-1 bg-blue-100 dark:bg-blue-900/20 px-2 py-1 rounded-full">
              <Verified className="w-4 h-4 text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Verified</span>
            </div>
          )}
        </div>

        {/* Store Type */}
        <div className="flex items-center space-x-2">
          <span className="text-lg">{storeTypes[supplier.type]?.icon}</span>
          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
            {storeTypes[supplier.type]?.name}
          </span>
        </div>

        {/* Rating and Distance */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current" />
            <span className="text-sm font-medium">{supplier.rating}</span>
            <span className="text-xs text-gray-500">({Math.floor(Math.random() * 100) + 20} reviews)</span>
          </div>
          {supplier.distance && (
            <span className="text-sm text-gray-500">{supplier.distance} km away</span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start space-x-2">
          <MapPin className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
          <span className="text-sm text-gray-600 dark:text-gray-400 leading-tight line-clamp-2">
            {supplier.address}
          </span>
        </div>

        {/* Contact */}
        <div className="flex items-center space-x-2">
          <Phone className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{supplier.phone}</span>
        </div>

        {/* Hours */}
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm text-gray-600 dark:text-gray-400">{supplier.openHours}</span>
        </div>

        {/* Specialties */}
        <div className="flex flex-wrap gap-1">
          {supplier.specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300 text-xs rounded-full"
            >
              {t(`categories.${specialty}`, specialty)}
            </span>
          ))}
          {supplier.specialties.length > 3 && (
            <span className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-full">
              +{supplier.specialties.length - 3} more
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-2">
          <a
            href={`tel:${supplier.phone}`}
            className="flex-1 btn-secondary text-sm py-2 flex items-center justify-center space-x-1"
          >
            <Phone className="w-4 h-4" />
            <span>Call</span>
          </a>
          <Link
            to="/stores"
            className="flex-1 btn-primary text-sm py-2 flex items-center justify-center space-x-1"
          >
            <Navigation className="w-4 h-4" />
            <span>Locate</span>
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {t('suppliers.title')}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Connect with verified suppliers and wholesalers in your area
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">{stores.length}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Total Suppliers</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Verified className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {stores.filter(s => s.verified).length}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Verified</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Star className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {(stores.reduce((sum, s) => sum + s.rating, 0) / stores.length).toFixed(1)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Avg Rating</div>
          </div>

          <div className="card text-center">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Package className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">12</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Categories</div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search suppliers, locations, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>

            {/* Type Filter */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="">All Types</option>
                {Object.entries(storeTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="rating">Sort by Rating</option>
              <option value="distance">Sort by Distance</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>

        {/* Suppliers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSuppliers.map((supplier) => (
            <SupplierCard key={supplier.id} supplier={supplier} />
          ))}
        </div>

        {/* Empty State */}
        {filteredSuppliers.length === 0 && (
          <div className="text-center py-12">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-12 card bg-gradient-to-r from-primary-500 to-primary-600 text-white">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Want to become a supplier?</h3>
            <p className="mb-4 opacity-90">
              Join our network of trusted suppliers and reach thousands of street vendors
            </p>
            <button className="bg-white text-primary-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SuppliersPage
