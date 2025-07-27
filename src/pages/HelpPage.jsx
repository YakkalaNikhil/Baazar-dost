import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Search,
  Phone,
  Mail,
  MessageCircle,
  Book,
  Video,
  Download,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Clock,
  MapPin,
  Star
} from 'lucide-react'

const HelpPage = () => {
  const { t } = useTranslation()
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedFaq, setExpandedFaq] = useState(null)

  const faqs = [
    {
      id: 1,
      question: 'How do I place an order?',
      answer: 'To place an order, browse our products, add items to your cart, and proceed to checkout. You can pay online or choose cash on delivery.'
    },
    {
      id: 2,
      question: 'What are the delivery charges?',
      answer: 'Delivery charges vary based on location and order value. Orders above ₹500 get free delivery within 5km radius.'
    },
    {
      id: 3,
      question: 'How can I track my order?',
      answer: 'You can track your order in the Orders section of your account. You\'ll also receive SMS updates on your registered mobile number.'
    },
    {
      id: 4,
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, credit/debit cards, net banking, and cash on delivery. All online payments are secure and encrypted.'
    },
    {
      id: 5,
      question: 'Can I cancel or modify my order?',
      answer: 'You can cancel or modify your order within 30 minutes of placing it. After that, please contact our support team.'
    },
    {
      id: 6,
      question: 'Do you offer bulk discounts?',
      answer: 'Yes! We offer special pricing for bulk orders. Contact our sales team for custom quotes on large quantities.'
    },
    {
      id: 7,
      question: 'How do I become a verified vendor?',
      answer: 'To become verified, submit your business documents through your profile. Our team will review and verify within 2-3 business days.'
    },
    {
      id: 8,
      question: 'What if I receive damaged products?',
      answer: 'If you receive damaged products, contact us immediately with photos. We\'ll arrange for replacement or refund within 24 hours.'
    }
  ]

  const contactMethods = [
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our support team',
      contact: '+91 98765 43210',
      hours: '9 AM - 8 PM (Mon-Sat)',
      action: 'tel:+919876543210'
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp',
      description: 'Quick support via WhatsApp',
      contact: '+91 98765 43210',
      hours: '24/7 Available',
      action: 'https://wa.me/919876543210'
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'Send us your queries',
      contact: 'support@baazardost.com',
      hours: 'Response within 4 hours',
      action: 'mailto:support@baazardost.com'
    }
  ]

  const resources = [
    {
      icon: Video,
      title: 'Video Tutorials',
      description: 'Learn how to use Baazar Dost',
      items: [
        'How to place your first order',
        'Using the store locator',
        'Managing your profile',
        'Understanding bulk pricing'
      ]
    },
    {
      icon: Book,
      title: 'User Guide',
      description: 'Complete guide for vendors',
      items: [
        'Getting started guide',
        'Product catalog overview',
        'Payment and delivery',
        'Troubleshooting tips'
      ]
    },
    {
      icon: Download,
      title: 'Downloads',
      description: 'Useful documents and forms',
      items: [
        'Vendor registration form',
        'Product price list',
        'Terms and conditions',
        'Privacy policy'
      ]
    }
  ]

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Help & Support
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            We're here to help you succeed. Find answers, get support, and learn how to make the most of Baazar Dost.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for help articles, FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        {/* Quick Contact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {contactMethods.map((method, index) => {
            const Icon = method.icon
            return (
              <div key={index} className="card text-center hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {method.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {method.description}
                </p>
                <div className="space-y-1 mb-4">
                  <div className="font-medium text-gray-900 dark:text-white">
                    {method.contact}
                  </div>
                  <div className="text-sm text-gray-500 flex items-center justify-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {method.hours}
                  </div>
                </div>
                <a
                  href={method.action}
                  className="btn-primary w-full"
                  target={method.action.startsWith('http') ? '_blank' : undefined}
                  rel={method.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  Contact Now
                </a>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQs */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {filteredFaqs.map((faq) => (
                <div key={faq.id} className="card">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                      {faq.question}
                    </h3>
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="w-5 h-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-gray-500" />
                    )}
                  </button>
                  
                  {expandedFaq === faq.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filteredFaqs.length === 0 && (
              <div className="text-center py-8">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No results found
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Try different keywords or contact our support team
                </p>
              </div>
            )}
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Resources
            </h2>
            
            <div className="space-y-6">
              {resources.map((resource, index) => {
                const Icon = resource.icon
                return (
                  <div key={index} className="card">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-lg flex items-center justify-center">
                        <Icon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          {resource.title}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {resource.description}
                        </p>
                      </div>
                    </div>
                    
                    <ul className="space-y-2">
                      {resource.items.map((item, itemIndex) => (
                        <li key={itemIndex}>
                          <a
                            href="#"
                            className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                          >
                            <span>{item}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Support Hours */}
            <div className="card bg-gradient-to-r from-primary-500 to-primary-600 text-white mt-6">
              <h3 className="font-semibold mb-3">Support Hours</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Monday - Saturday</span>
                  <span>9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>Sunday</span>
                  <span>10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span>WhatsApp Support</span>
                  <span>24/7</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center">
          <div className="card bg-gray-100 dark:bg-gray-800">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Still need help?
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Our support team is ready to assist you with any questions or issues.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+919876543210"
                className="btn-primary"
              >
                <Phone className="w-4 h-4 mr-2" />
                Call Support
              </a>
              <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpPage
