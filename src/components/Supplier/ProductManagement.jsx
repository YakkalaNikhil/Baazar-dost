import React, { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Upload, 
  MapPin,
  Package,
  Image as ImageIcon
} from 'lucide-react'
import { collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query, where } from 'firebase/firestore'
import { db } from '../../config/firebase'
import { toast } from 'react-toastify'
import { getCurrentLocation } from '../../utils/location'

const ProductManagement = () => {
  const { user, userProfile } = useAuth()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [location, setLocation] = useState(null)
  const [locationLoading, setLocationLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    unitPrice: '',
    bulkPrice: '',
    unit: '',
    bulkUnit: '',
    minBulkQuantity: '',
    stockQuantity: '',
    image: '',
    imageFile: null,
    imageType: 'url',
    tags: '',
    gst: ''
  })

  const categories = [
    'fruits', 'vegetables', 'grains', 'spices', 'beverages', 
    'panipuri_supplies', 'waffle_supplies', 'packaging', 'cleaning'
  ]

  useEffect(() => {
    loadProducts()
    getLocation()
  }, [user])

  const getLocation = async () => {
    setLocationLoading(true)
    try {
      const locationData = await getCurrentLocation()
      setLocation(locationData)
      toast.success('Location detected successfully!')
    } catch (error) {
      console.error('Error getting location:', error)
      toast.error(error.message || 'Could not get your location. Please enable location services.')
    } finally {
      setLocationLoading(false)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      const productsRef = collection(db, 'supplier_products')
      const q = query(productsRef, where('supplierId', '==', user?.uid))
      const querySnapshot = await getDocs(q)
      
      const productsData = []
      querySnapshot.forEach((doc) => {
        productsData.push({ id: doc.id, ...doc.data() })
      })
      
      setProducts(productsData)
    } catch (error) {
      console.error('Error loading products:', error)
      toast.error('Failed to load products')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select an image file (JPG, PNG, GIF) or PDF')
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be less than 5MB')
        return
      }

      setFormData(prev => ({
        ...prev,
        imageFile: file,
        imageType: 'file',
        image: ''
      }))

      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            imagePreview: e.target.result
          }))
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const convertFileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.category || !formData.unitPrice) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!location) {
      toast.error('Location is required. Please enable location services.')
      return
    }

    try {
      let imageData = formData.image

      if (formData.imageFile) {
        try {
          imageData = await convertFileToBase64(formData.imageFile)
        } catch (error) {
          console.error('Error converting file:', error)
          toast.error('Failed to process image file')
          return
        }
      }

      const productData = {
        ...formData,
        unitPrice: parseFloat(formData.unitPrice),
        bulkPrice: parseFloat(formData.bulkPrice) || parseFloat(formData.unitPrice),
        minBulkQuantity: parseInt(formData.minBulkQuantity) || 1,
        stockQuantity: parseInt(formData.stockQuantity) || 0,
        gst: parseFloat(formData.gst) || 0,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        image: imageData,
        imageType: formData.imageType,
        fileName: formData.imageFile?.name || null,
        fileType: formData.imageFile?.type || null,
        supplierId: user.uid,
        supplierName: userProfile?.businessName || userProfile?.name,
        supplierLocation: location,
        createdAt: new Date(),
        updatedAt: new Date(),
        isActive: true,
        inStock: parseInt(formData.stockQuantity) > 0
      }

      delete productData.imageFile
      delete productData.imagePreview

      if (editingProduct) {
        await updateDoc(doc(db, 'supplier_products', editingProduct.id), {
          ...productData,
          updatedAt: new Date()
        })
        toast.success('Product updated successfully!')
      } else {
        await addDoc(collection(db, 'supplier_products'), productData)
        toast.success('Product added successfully!')
      }

      resetForm()
      loadProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      toast.error('Failed to save product')
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      unitPrice: product.unitPrice.toString(),
      bulkPrice: product.bulkPrice.toString(),
      unit: product.unit,
      bulkUnit: product.bulkUnit,
      minBulkQuantity: product.minBulkQuantity.toString(),
      stockQuantity: product.stockQuantity.toString(),
      image: product.image || '',
      imageFile: null,
      imageType: product.imageType || 'url',
      imagePreview: product.image || null,
      tags: product.tags?.join(', ') || '',
      gst: product.gst.toString()
    })
    setShowAddForm(true)
  }

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return
    }

    try {
      await deleteDoc(doc(db, 'supplier_products', productId))
      toast.success('Product deleted successfully!')
      loadProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      toast.error('Failed to delete product')
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      unitPrice: '',
      bulkPrice: '',
      unit: '',
      bulkUnit: '',
      minBulkQuantity: '',
      stockQuantity: '',
      image: '',
      imageFile: null,
      imageType: 'url',
      imagePreview: null,
      tags: '',
      gst: ''
    })
    setEditingProduct(null)
    setShowAddForm(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">My Products</h2>
          <p className="text-gray-600 dark:text-gray-400">Manage your product catalog</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className={`w-4 h-4 ${location ? 'text-green-500' : 'text-red-500'}`} />
            <span className={location ? 'text-green-600' : 'text-red-600'}>
              {locationLoading ? 'Getting location...' : location ? 'Location detected' : 'Location required'}
            </span>
            {!location && (
              <button
                onClick={getLocation}
                className="text-primary-600 hover:text-primary-700 underline"
                disabled={locationLoading}
              >
                Enable
              </button>
            )}
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="card">
            <div className="aspect-w-16 aspect-h-9 mb-4">
              {product.image ? (
                product.fileType === 'application/pdf' ? (
                  <div className="w-full h-48 bg-gray-100 dark:bg-gray-700 rounded-lg flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                    <div className="text-red-500 mb-2">
                      <svg className="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 text-center">PDF Document</p>
                    {product.fileName && (
                      <p className="text-xs text-gray-500 mt-1 text-center truncate max-w-full px-2">
                        {product.fileName}
                      </p>
                    )}
                  </div>
                ) : (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )
              ) : (
                <div className="w-full h-48 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
              
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-lg font-bold text-primary-600">₹{product.unitPrice}</span>
                  <span className="text-sm text-gray-500">/{product.unit}</span>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm text-gray-500">Stock: {product.stockQuantity}</span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {products.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products yet</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">Start by adding your first product to the catalog</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn-primary"
          >
            Add Your First Product
          </button>
        </div>
      )}

      {/* Add/Edit Product Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="input-field"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => handleInputChange('category', e.target.value)}
                      className="input-field"
                      required
                    >
                      <option value="">Select category</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="input-field"
                    rows="3"
                    placeholder="Describe your product"
                  />
                </div>

                {/* Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unit Price (₹) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.unitPrice}
                      onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                      className="input-field"
                      placeholder="0.00"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Unit
                    </label>
                    <input
                      type="text"
                      value={formData.unit}
                      onChange={(e) => handleInputChange('unit', e.target.value)}
                      className="input-field"
                      placeholder="kg, piece, liter"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={formData.stockQuantity}
                      onChange={(e) => handleInputChange('stockQuantity', e.target.value)}
                      className="input-field"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      GST (%)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.gst}
                      onChange={(e) => handleInputChange('gst', e.target.value)}
                      className="input-field"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Product Image/Document
                  </label>
                  <div className="space-y-3">
                    <div className="flex space-x-4">
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="imageType"
                          value="url"
                          checked={formData.imageType === 'url'}
                          onChange={(e) => handleInputChange('imageType', e.target.value)}
                          className="mr-2"
                        />
                        Image URL
                      </label>
                      <label className="flex items-center">
                        <input
                          type="radio"
                          name="imageType"
                          value="file"
                          checked={formData.imageType === 'file'}
                          onChange={(e) => handleInputChange('imageType', e.target.value)}
                          className="mr-2"
                        />
                        Upload File
                      </label>
                    </div>

                    {formData.imageType === 'url' ? (
                      <input
                        type="url"
                        value={formData.image}
                        onChange={(e) => handleInputChange('image', e.target.value)}
                        className="input-field"
                        placeholder="https://example.com/image.jpg"
                      />
                    ) : (
                      <div>
                        <input
                          type="file"
                          onChange={handleFileChange}
                          accept="image/*,.pdf"
                          className="input-field"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Supports: JPG, PNG, GIF, PDF (max 5MB)
                        </p>
                        {formData.imagePreview && (
                          <div className="mt-2">
                            <img
                              src={formData.imagePreview}
                              alt="Preview"
                              className="w-32 h-32 object-cover rounded-lg"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => handleInputChange('tags', e.target.value)}
                    className="input-field"
                    placeholder="organic, fresh, local"
                  />
                </div>

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex items-center space-x-2"
                  >
                    <Save className="w-4 h-4" />
                    <span>{editingProduct ? 'Update Product' : 'Add Product'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductManagement
