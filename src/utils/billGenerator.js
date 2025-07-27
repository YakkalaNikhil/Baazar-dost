import jsPDF from 'jspdf'
import 'jspdf-autotable'

export const generateBill = (order, userProfile) => {
  try {
    const doc = new jsPDF()
    
    // Company Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('BAAZAR DOST', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Your Trusted Local Marketplace', 105, 28, { align: 'center' })
    doc.text('Email: support@baazardost.com | Phone: +91-9876543210', 105, 35, { align: 'center' })
    
    // Line separator
    doc.line(20, 40, 190, 40)
    
    // Invoice Details
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('INVOICE', 20, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Invoice Info - Left Side
    doc.text(`Invoice No: INV-${order.id.slice(-8).toUpperCase()}`, 20, 60)
    doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : new Date().toLocaleDateString()}`, 20, 67)
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, 74)
    doc.text(`Payment: ${order.paymentMethod?.replace('_', ' ').toUpperCase() || 'CASH ON DELIVERY'}`, 20, 81)
    
    // Customer Info - Right Side
    doc.text('BILL TO:', 120, 60)
    doc.text(`Customer ID: ${order.userId.slice(-8).toUpperCase()}`, 120, 67)
    doc.text(`Email: ${order.userEmail || 'N/A'}`, 120, 74)
    doc.text(`Address: ${order.deliveryAddress || 'Default Address'}`, 120, 81)
    
    // Items Table
    const tableStartY = 95
    
    // Prepare table data
    const tableData = order.items.map(item => [
      item.name,
      item.quantity.toString(),
      item.unit || 'piece',
      `₹${item.price.toFixed(2)}`,
      `₹${(item.price * item.quantity).toFixed(2)}`
    ])
    
    // Add table
    doc.autoTable({
      startY: tableStartY,
      head: [['Product', 'Qty', 'Unit', 'Rate', 'Amount']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      columnStyles: {
        0: { cellWidth: 70 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 25, halign: 'center' },
        3: { cellWidth: 30, halign: 'right' },
        4: { cellWidth: 35, halign: 'right' }
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 10
    
    // Summary box
    doc.rect(120, finalY, 70, 35)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`Subtotal: ₹${order.summary.subtotal.toFixed(2)}`, 125, finalY + 8)
    doc.text(`Tax (${((order.summary.tax / order.summary.subtotal) * 100).toFixed(1)}%): ₹${order.summary.tax.toFixed(2)}`, 125, finalY + 16)
    
    doc.setFont('helvetica', 'bold')
    doc.text(`Total: ₹${order.summary.total.toFixed(2)}`, 125, finalY + 28)
    
    // Footer
    const footerY = finalY + 50
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Thank you for choosing Baazar Dost!', 105, footerY, { align: 'center' })
    doc.text('Terms: Payment due within 30 days. Late payments may incur charges.', 105, footerY + 7, { align: 'center' })
    doc.text('For support, contact us at support@baazardost.com', 105, footerY + 14, { align: 'center' })
    
    return doc
  } catch (error) {
    console.error('Error generating bill:', error)
    return null
  }
}

export const downloadBill = (order, userProfile) => {
  try {
    const doc = generateBill(order, userProfile)
    if (!doc) {
      return false
    }
    
    const fileName = `Invoice_${order.id.slice(-8)}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    return true
  } catch (error) {
    console.error('Error downloading bill:', error)
    return false
  }
}

export const previewBill = (order, userProfile) => {
  try {
    const doc = generateBill(order, userProfile)
    if (!doc) {
      return false
    }
    
    // Open in new window
    const pdfBlob = doc.output('blob')
    const pdfUrl = URL.createObjectURL(pdfBlob)
    window.open(pdfUrl, '_blank')
    return true
  } catch (error) {
    console.error('Error previewing bill:', error)
    return false
  }
}

// Generate supplier-specific bill (commission-based)
export const generateSupplierBill = (order, userProfile) => {
  try {
    const doc = new jsPDF()
    
    // Company Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text('BAAZAR DOST', 105, 20, { align: 'center' })
    
    doc.setFontSize(12)
    doc.setFont('helvetica', 'normal')
    doc.text('Supplier Commission Statement', 105, 28, { align: 'center' })
    
    // Line separator
    doc.line(20, 40, 190, 40)
    
    // Statement Details
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('COMMISSION STATEMENT', 20, 50)
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Statement Info
    doc.text(`Statement No: COMM-${order.id.slice(-8).toUpperCase()}`, 20, 60)
    doc.text(`Date: ${order.createdAt ? order.createdAt.toLocaleDateString() : new Date().toLocaleDateString()}`, 20, 67)
    doc.text(`Order ID: ${order.id.slice(-8).toUpperCase()}`, 20, 74)
    
    // Supplier Info
    doc.text('SUPPLIER:', 120, 60)
    doc.text(`Business: ${userProfile?.businessName || 'N/A'}`, 120, 67)
    doc.text(`Contact: ${userProfile?.phone || 'N/A'}`, 120, 74)
    doc.text(`Email: ${userProfile?.email || 'N/A'}`, 120, 81)
    
    // Filter items for this supplier
    const supplierItems = order.items.filter(item => 
      item.supplierId === userProfile?.uid || 
      item.supplierName === userProfile?.businessName
    )
    
    // Items Table
    const tableStartY = 95
    const commissionRate = 0.15 // 15% commission
    
    const tableData = supplierItems.map(item => {
      const itemTotal = item.price * item.quantity
      const commission = itemTotal * commissionRate
      const supplierEarning = itemTotal - commission
      
      return [
        item.name,
        item.quantity.toString(),
        `₹${item.price.toFixed(2)}`,
        `₹${itemTotal.toFixed(2)}`,
        `₹${commission.toFixed(2)}`,
        `₹${supplierEarning.toFixed(2)}`
      ]
    })
    
    // Add table
    doc.autoTable({
      startY: tableStartY,
      head: [['Product', 'Qty', 'Rate', 'Total', 'Commission (15%)', 'Your Earning']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [46, 125, 50],
        textColor: 255,
        fontStyle: 'bold'
      },
      styles: {
        fontSize: 9,
        cellPadding: 3
      }
    })
    
    // Summary
    const finalY = doc.lastAutoTable.finalY + 10
    const totalSales = supplierItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    const totalCommission = totalSales * commissionRate
    const totalEarning = totalSales - totalCommission
    
    // Summary box
    doc.rect(120, finalY, 70, 35)
    
    doc.setFont('helvetica', 'normal')
    doc.text(`Total Sales: ₹${totalSales.toFixed(2)}`, 125, finalY + 8)
    doc.text(`Commission: ₹${totalCommission.toFixed(2)}`, 125, finalY + 16)
    
    doc.setFont('helvetica', 'bold')
    doc.text(`Your Earning: ₹${totalEarning.toFixed(2)}`, 125, finalY + 28)
    
    // Footer
    const footerY = finalY + 50
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.text('Commission will be credited to your account within 3-5 business days.', 105, footerY, { align: 'center' })
    doc.text('For queries, contact us at suppliers@baazardost.com', 105, footerY + 7, { align: 'center' })
    
    return doc
  } catch (error) {
    console.error('Error generating supplier bill:', error)
    return null
  }
}

export const downloadSupplierBill = (order, userProfile) => {
  try {
    const doc = generateSupplierBill(order, userProfile)
    if (!doc) {
      return false
    }
    
    const fileName = `Commission_${order.id.slice(-8)}_${new Date().toISOString().split('T')[0]}.pdf`
    doc.save(fileName)
    return true
  } catch (error) {
    console.error('Error downloading supplier bill:', error)
    return false
  }
}
