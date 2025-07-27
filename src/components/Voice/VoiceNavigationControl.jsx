import React, { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mic, MicOff, Volume2, VolumeX, HelpCircle, X } from 'lucide-react'
import { toast } from 'react-toastify'
import useVoiceOrdering from '../../hooks/useVoiceOrdering'

const VoiceNavigationControl = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const location = useLocation()
  const [showHelp, setShowHelp] = useState(false)
  const [isSpeechEnabled, setIsSpeechEnabled] = useState(true)
  
  const {
    isListening,
    isSupported,
    isProcessing,
    lastCommand,
    confidence,
    startListening,
    stopListening,
    speakResponse
  } = useVoiceOrdering()

  // Voice navigation commands for different languages
  const navigationCommands = {
    en: {
      home: ['go home', 'home page', 'main page', 'dashboard'],
      products: ['show products', 'go to products', 'product page', 'browse products'],
      cart: ['show cart', 'go to cart', 'view cart', 'my cart'],
      orders: ['show orders', 'my orders', 'order history', 'view orders'],
      profile: ['show profile', 'my profile', 'account settings', 'user profile'],
      suppliers: ['find suppliers', 'supplier map', 'store locator', 'nearby suppliers'],
      help: ['help', 'voice commands', 'what can you do', 'show help'],
      search: ['search for', 'find', 'look for', 'show me']
    },
    hi: {
      home: ['होम जाएं', 'मुख्य पृष्ठ', 'डैशबोर्ड', 'घर'],
      products: ['उत्पाद दिखाएं', 'प्रोडक्ट्स', 'सामान दिखाएं'],
      cart: ['कार्ट दिखाएं', 'टोकरी', 'मेरा कार्ट'],
      orders: ['ऑर्डर दिखाएं', 'मेरे ऑर्डर', 'आर्डर हिस्ट्री'],
      profile: ['प्रोफाइल दिखाएं', 'मेरी प्रोफाइल', 'खाता'],
      suppliers: ['सप्लायर खोजें', 'दुकान खोजें', 'नजदीकी दुकान'],
      help: ['सहायता', 'मदद', 'आप क्या कर सकते हैं'],
      search: ['खोजें', 'ढूंढें', 'दिखाएं']
    },
    te: {
      home: ['హోమ్ కి వెళ్ళండి', 'ముఖ్య పేజీ', 'డాష్‌బోర్డ్'],
      products: ['ప్రొడక్ట్స్ చూపించండి', 'వస్తువులు', 'సామాను చూపించండి'],
      cart: ['కార్ట్ చూపించండి', 'బుట్ట', 'నా కార్ట్'],
      orders: ['ఆర్డర్లు చూపించండి', 'నా ఆర్డర్లు', 'ఆర్డర్ చరిత్ర'],
      profile: ['ప్రొఫైల్ చూపించండి', 'నా ప్రొఫైల్', 'ఖాతా'],
      suppliers: ['సప్లయర్లను కనుగొనండి', 'దుకాణం కనుగొనండి', 'సమీప దుకాణాలు'],
      help: ['సహాయం', 'మద్దతు', 'మీరు ఏమి చేయగలరు'],
      search: ['వెతకండి', 'కనుగొనండి', 'చూపించండి']
    },
    ta: {
      home: ['வீட்டிற்கு செல்லுங்கள்', 'முதன்மை பக்கம்', 'டாஷ்போர்டு'],
      products: ['தயாரிப்புகளைக் காட்டுங்கள்', 'பொருட்கள்', 'சாமான்களைக் காட்டுங்கள்'],
      cart: ['கார்ட்டைக் காட்டுங்கள்', 'கூடை', 'என் கார்ட்'],
      orders: ['ஆர்டர்களைக் காட்டுங்கள்', 'என் ஆர்டர்கள்', 'ஆர்டர் வரலாறு'],
      profile: ['சுயவிவரத்தைக் காட்டுங்கள்', 'என் சுயவிவரம்', 'கணக்கு'],
      suppliers: ['சப்ளையர்களைக் கண்டறியுங்கள்', 'கடையைக் கண்டறியுங்கள்', 'அருகிலுள்ள கடைகள்'],
      help: ['உதவி', 'ஆதரவு', 'நீங்கள் என்ன செய்ய முடியும்'],
      search: ['தேடுங்கள்', 'கண்டறியுங்கள்', 'காட்டுங்கள்']
    },
    kn: {
      home: ['ಮನೆಗೆ ಹೋಗಿ', 'ಮುಖ್ಯ ಪುಟ', 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್'],
      products: ['ಉತ್ಪಾದನೆಗಳನ್ನು ತೋರಿಸಿ', 'ವಸ್ತುಗಳು', 'ಸಾಮಾನುಗಳನ್ನು ತೋರಿಸಿ'],
      cart: ['ಕಾರ್ಟ್ ತೋರಿಸಿ', 'ಬುಟ್ಟಿ', 'ನನ್ನ ಕಾರ್ಟ್'],
      orders: ['ಆರ್ಡರ್‌ಗಳನ್ನು ತೋರಿಸಿ', 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು', 'ಆರ್ಡರ್ ಇತಿಹಾಸ'],
      profile: ['ಪ್ರೊಫೈಲ್ ತೋರಿಸಿ', 'ನನ್ನ ಪ್ರೊಫೈಲ್', 'ಖಾತೆ'],
      suppliers: ['ಸಪ್ಲೈಯರ್‌ಗಳನ್ನು ಹುಡುಕಿ', 'ಅಂಗಡಿಯನ್ನು ಹುಡುಕಿ', 'ಹತ್ತಿರದ ಅಂಗಡಿಗಳು'],
      help: ['ಸಹಾಯ', 'ಬೆಂಬಲ', 'ನೀವು ಏನು ಮಾಡಬಹುದು'],
      search: ['ಹುಡುಕಿ', 'ಕಂಡುಹಿಡಿ', 'ತೋರಿಸಿ']
    }
  }

  // Process navigation commands
  const processNavigationCommand = (transcript) => {
    const currentLang = i18n.language || 'en'
    const commands = navigationCommands[currentLang] || navigationCommands.en
    
    const lowerTranscript = transcript.toLowerCase()
    
    // Check for navigation commands
    for (const [action, phrases] of Object.entries(commands)) {
      for (const phrase of phrases) {
        if (lowerTranscript.includes(phrase)) {
          executeNavigation(action, lowerTranscript)
          return true
        }
      }
    }
    
    return false
  }

  // Execute navigation
  const executeNavigation = (action, transcript) => {
    let message = ''
    
    switch (action) {
      case 'home':
        navigate('/')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.home')
        break
      case 'products':
        navigate('/products')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.products')
        break
      case 'cart':
        navigate('/cart')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.cart')
        break
      case 'orders':
        navigate('/orders')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.orders')
        break
      case 'profile':
        navigate('/profile')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.profile')
        break
      case 'suppliers':
        navigate('/suppliers')
        message = t('voice.responses.navigatingTo') + ' ' + t('navigation.suppliers')
        break
      case 'help':
        setShowHelp(true)
        message = t('voice.responses.showingHelp')
        break
      case 'search':
        const searchTerm = transcript.replace(/search for|find|look for|show me|खोजें|ढूंढें|వెతకండి|தேடுங்கள்|ಹುಡುಕಿ/gi, '').trim()
        if (searchTerm) {
          navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
          message = `${t('voice.responses.searchingFor')} ${searchTerm}`
        } else {
          message = t('voice.responses.searchTermRequired')
        }
        break
      default:
        message = t('voice.responses.commandNotRecognized')
    }
    
    toast.success(message)
    if (isSpeechEnabled) {
      speakResponse(message)
    }
  }

  // Handle voice command
  useEffect(() => {
    if (lastCommand && confidence > 0.6) {
      const handled = processNavigationCommand(lastCommand)
      if (!handled) {
        // If not a navigation command, let the voice ordering system handle it
        console.log('Command not handled by navigation, passing to voice ordering')
      }
    }
  }, [lastCommand, confidence])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const toggleSpeech = () => {
    setIsSpeechEnabled(!isSpeechEnabled)
    const message = isSpeechEnabled ? 'Voice responses disabled' : 'Voice responses enabled'
    toast.info(message)
  }

  if (!isSupported) {
    return null
  }

  return (
    <>
      {/* Voice Control Button */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        {/* Speech Toggle */}
        <button
          onClick={toggleSpeech}
          className={`p-2 rounded-full shadow-lg transition-colors ${
            isSpeechEnabled
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-400 hover:bg-gray-500 text-white'
          }`}
          title={isSpeechEnabled ? 'Disable voice responses' : 'Enable voice responses'}
        >
          {isSpeechEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
        </button>

        {/* Help Button */}
        <button
          onClick={() => setShowHelp(true)}
          className="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-full shadow-lg transition-colors"
          title="Voice commands help"
        >
          <HelpCircle size={20} />
        </button>

        {/* Main Voice Button */}
        <button
          onClick={toggleListening}
          disabled={isProcessing}
          className={`p-4 rounded-full shadow-lg transition-all duration-300 ${
            isListening
              ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
              : isProcessing
              ? 'bg-yellow-600 text-white cursor-not-allowed'
              : 'bg-primary-600 hover:bg-primary-700 text-white'
          }`}
          title={isListening ? 'Stop listening' : 'Start voice command'}
        >
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </button>

        {/* Status Indicator */}
        {(isListening || isProcessing) && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 text-sm">
            {isListening && (
              <div className="text-red-600 font-medium">
                🎤 Listening...
              </div>
            )}
            {isProcessing && (
              <div className="text-yellow-600 font-medium">
                ⚡ Processing...
              </div>
            )}
            {lastCommand && (
              <div className="text-gray-600 dark:text-gray-400 text-xs mt-1">
                "{lastCommand}" ({Math.round(confidence * 100)}%)
              </div>
            )}
          </div>
        )}
      </div>

      {/* Help Modal */}
      {showHelp && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Voice Commands Help
                </h3>
                <button
                  onClick={() => setShowHelp(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Navigation Commands:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>• "Go home" / "होम जाएं"</div>
                    <div>• "Show products" / "उत्पाद दिखाएं"</div>
                    <div>• "View cart" / "कार्ट दिखाएं"</div>
                    <div>• "My orders" / "मेरे ऑर्डर"</div>
                    <div>• "Show profile" / "प्रोफाइल दिखाएं"</div>
                    <div>• "Find suppliers" / "सप्लायर खोजें"</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Ordering Commands:
                  </h4>
                  <div className="text-sm space-y-1">
                    <div>• "Add 5 panipuri kit to cart"</div>
                    <div>• "Order 2 kg rice"</div>
                    <div>• "Buy 10 pieces of onions"</div>
                    <div>• "Search for tomatoes"</div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                    Supported Languages:
                  </h4>
                  <div className="text-sm">
                    English, हिंदी, తెలుగు, தமிழ், ಕನ್ನಡ
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-300">
                    💡 <strong>Tip:</strong> Speak clearly and wait for the beep before giving your command. 
                    The system will automatically detect your language.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default VoiceNavigationControl
