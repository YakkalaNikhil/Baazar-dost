import React from 'react';
import { useCart } from '../../contexts/CartContext';

const CartMathTest = () => {
  const { cartItems, getCartTotal, getItemTotal, getCartSummary } = useCart();

  // Only show in development
  if (import.meta.env.PROD) {
    return null;
  }

  if (cartItems.length === 0) {
    return null;
  }

  const summary = getCartSummary();

  return (
    <div className="fixed bottom-4 left-4 bg-purple-900 text-white p-4 rounded-lg shadow-lg max-w-md text-xs z-40">
      <h3 className="font-bold mb-2">🧮 Cart Math Debug</h3>
      
      <div className="space-y-2 max-h-60 overflow-y-auto">
        {cartItems.map((item, index) => {
          const itemTotal = getItemTotal(item);
          const manualTotal = item.bulkMultiplier > 1 && item.pricePerUnit 
            ? item.pricePerUnit * item.actualQuantity 
            : item.price * item.quantity;
          
          return (
            <div key={item.cartKey} className="border-b border-purple-700 pb-2">
              <div className="font-medium text-purple-200">{item.name}</div>
              <div className="text-purple-300 text-xs">
                <div>Type: {item.orderType}</div>
                <div>Price: ₹{item.price} | Qty: {item.quantity}</div>
                {item.bulkMultiplier > 1 && (
                  <>
                    <div>Bulk Multiplier: {item.bulkMultiplier}</div>
                    <div>Actual Qty: {item.actualQuantity}</div>
                    <div>Price/Unit: ₹{item.pricePerUnit?.toFixed(2) || 'N/A'}</div>
                  </>
                )}
                <div className="mt-1">
                  <div>Helper Total: ₹{itemTotal.toFixed(2)}</div>
                  <div>Manual Total: ₹{manualTotal.toFixed(2)}</div>
                  {Math.abs(itemTotal - manualTotal) > 0.01 && (
                    <div className="text-red-300">⚠️ Mismatch!</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 pt-2 border-t border-purple-700">
        <div className="font-medium">Cart Summary:</div>
        <div className="text-purple-300">
          <div>Subtotal: ₹{summary.subtotal.toFixed(2)}</div>
          <div>Tax (18%): ₹{summary.tax.toFixed(2)}</div>
          <div>Total: ₹{summary.total.toFixed(2)}</div>
          <div>Items: {summary.itemCount}</div>
        </div>
        
        {/* Manual verification */}
        <div className="mt-2 text-purple-200">
          <div>Manual Subtotal: ₹{cartItems.reduce((sum, item) => sum + getItemTotal(item), 0).toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default CartMathTest;
