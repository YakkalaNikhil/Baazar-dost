import React from 'react'
import { useTranslation } from 'react-i18next'
import { Package, Calculator, TrendingDown } from 'lucide-react'

const BulkOrderSummary = ({ cartItems }) => {
  const { t } = useTranslation()

  // Calculate bulk order statistics
  const calculateBulkStats = () => {
    let totalBulkItems = 0
    let totalRegularItems = 0
    let totalBulkPieces = 0
    let totalSavings = 0
    let bulkOrdersCount = 0

    cartItems.forEach(item => {
      if (item.orderType === 'bulk' && item.bulkMultiplier > 1) {
        totalBulkItems += item.quantity
        totalBulkPieces += item.actualQuantity
        bulkOrdersCount++

        // Calculate potential savings (if we have unit price comparison)
        if (item.pricePerUnit && item.originalUnit) {
          const regularPrice = item.pricePerUnit * item.actualQuantity * 1.2 // Assume 20% markup for regular pricing
          const bulkPrice = item.price * item.quantity
          const savings = Math.max(0, regularPrice - bulkPrice)
          totalSavings += savings
        }
      } else {
        totalRegularItems += item.quantity
      }
    })

    return {
      totalBulkItems,
      totalRegularItems,
      totalBulkPieces,
      totalSavings,
      bulkOrdersCount,
      hasBulkOrders: bulkOrdersCount > 0
    }
  }

  const stats = calculateBulkStats()

  if (!stats.hasBulkOrders) {
    return null
  }

  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6">
      <div className="flex items-center space-x-2 mb-3">
        <Package className="text-green-600 dark:text-green-400" size={20} />
        <h3 className="font-semibold text-green-800 dark:text-green-300">
          Bulk Order Summary
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Bulk Orders Count */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Bulk Orders</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.bulkOrdersCount}
              </p>
            </div>
            <Package className="text-green-500" size={24} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {stats.totalBulkItems} packages ordered
          </p>
        </div>

        {/* Total Pieces */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Pieces</p>
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {stats.totalBulkPieces.toLocaleString()}
              </p>
            </div>
            <Calculator className="text-green-500" size={24} />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            From bulk orders
          </p>
        </div>

        {/* Estimated Savings */}
        {stats.totalSavings > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg p-3 border border-green-200 dark:border-green-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Est. Savings</p>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  ₹{stats.totalSavings.toFixed(0)}
                </p>
              </div>
              <TrendingDown className="text-green-500" size={24} />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              vs. regular pricing
            </p>
          </div>
        )}
      </div>

      {/* Bulk Order Details */}
      <div className="mt-4">
        <h4 className="text-sm font-medium text-green-800 dark:text-green-300 mb-2">
          Bulk Order Breakdown:
        </h4>
        <div className="space-y-2">
          {cartItems
            .filter(item => item.orderType === 'bulk' && item.bulkMultiplier > 1)
            .map(item => (
              <div
                key={item.cartKey}
                className="flex items-center justify-between text-sm bg-white dark:bg-gray-800 rounded p-2 border border-green-200 dark:border-green-700"
              >
                <div className="flex-1">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {item.name}
                  </span>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.quantity} × {item.unit} = {item.actualQuantity} pieces
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-green-600 dark:text-green-400">
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </div>
                  {item.pricePerUnit && (
                    <div className="text-xs text-gray-500">
                      ₹{item.pricePerUnit.toFixed(2)}/piece
                    </div>
                  )}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Benefits Note */}
      <div className="mt-4 p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
        <p className="text-sm text-green-800 dark:text-green-300">
          <strong>💡 Bulk Order Benefits:</strong> You're ordering in bulk quantities which typically offer better pricing per unit and ensure you have adequate stock for your business needs.
        </p>
      </div>
    </div>
  )
}

export default BulkOrderSummary
