import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'

const useVoiceNavigation = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [lastCommand, setLastCommand] = useState('')
  const [confidence, setConfidence] = useState(0)
  const timeoutRef = useRef(null)

  // Language mapping for speech recognition
  const languageMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN'
  }

  // Voice commands mapping for each language
  const commandMappings = {
    en: {
      search: ['search', 'find', 'look for'],
      addToCart: ['add to cart', 'add cart', 'buy', 'purchase'],
      goToCart: ['go to cart', 'cart', 'shopping cart', 'view cart'],
      goHome: ['go home', 'home', 'main page'],
      showProducts: ['show products', 'products', 'items'],
      showOrders: ['show orders', 'orders', 'my orders'],
      checkout: ['checkout', 'pay', 'payment'],
      help: ['help', 'commands', 'what can you do']
    },
    hi: {
      search: ['खोजें', 'ढूंढें', 'तलाश करें'],
      addToCart: ['कार्ट में जोड़ें', 'खरीदें', 'लें'],
      goToCart: ['कार्ट में जाएं', 'कार्ट', 'शॉपिंग कार्ट'],
      goHome: ['होम पर जाएं', 'घर', 'मुख्य पृष्ठ'],
      showProducts: ['उत्पाद दिखाएं', 'सामान', 'चीजें'],
      showOrders: ['ऑर्डर दिखाएं', 'आर्डर', 'मेरे ऑर्डर'],
      checkout: ['चेकआउट', 'भुगतान', 'पेमेंट'],
      help: ['सहायता', 'मदद', 'कमांड']
    },
    te: {
      search: ['వెతకండి', 'కనుగొనండి', 'వెతుకులాట'],
      addToCart: ['కార్ట్‌కు జోడించండి', 'కొనండి', 'తీసుకోండి'],
      goToCart: ['కార్ట్‌కు వెళ్ళండి', 'కార్ట్', 'షాపింగ్ కార్ట్'],
      goHome: ['హోమ్‌కు వెళ్ళండి', 'ఇల్లు', 'మొదటి పేజీ'],
      showProducts: ['ఉత్పత్తులను చూపించండి', 'వస్తువులు', 'సామాను'],
      showOrders: ['ఆర్డర్లను చూపించండి', 'ఆర్డర్లు', 'నా ఆర్డర్లు'],
      checkout: ['చెక్అవుట్', 'చెల్లింపు', 'పేమెంట్'],
      help: ['సహాయం', 'మద్దతు', 'కమాండ్లు']
    },
    ta: {
      search: ['தேடு', 'கண்டுபிடி', 'தேடல்'],
      addToCart: ['கார்ட்டில் சேர்', 'வாங்கு', 'எடு'],
      goToCart: ['கார்ட்டிற்கு செல்', 'கார்ட்', 'ஷாப்பிங் கார்ட்'],
      goHome: ['முகப்பிற்கு செல்', 'வீடு', 'முதல் பக்கம்'],
      showProducts: ['பொருட்களைக் காட்டு', 'சாமான்', 'பொருள்கள்'],
      showOrders: ['ஆர்டர்களைக் காட்டு', 'ஆர்டர்கள்', 'என் ஆர்டர்கள்'],
      checkout: ['செக்அவுட்', 'பணம் செலுத்து', 'பேமெண்ட்'],
      help: ['உதவி', 'ஆதரவு', 'கட்டளைகள்']
    },
    kn: {
      search: ['ಹುಡುಕಿ', 'ಕಂಡುಹಿಡಿ', 'ಹುಡುಕಾಟ'],
      addToCart: ['ಕಾರ್ಟ್‌ಗೆ ಸೇರಿಸಿ', 'ಖರೀದಿಸಿ', 'ತೆಗೆದುಕೊಳ್ಳಿ'],
      goToCart: ['ಕಾರ್ಟ್‌ಗೆ ಹೋಗಿ', 'ಕಾರ್ಟ್', 'ಶಾಪಿಂಗ್ ಕಾರ್ಟ್'],
      goHome: ['ಮುಖ್ಯಪುಟಕ್ಕೆ ಹೋಗಿ', 'ಮನೆ', 'ಮೊದಲ ಪುಟ'],
      showProducts: ['ಉತ್ಪನ್ನಗಳನ್ನು ತೋರಿಸಿ', 'ಸಾಮಾನು', 'ವಸ್ತುಗಳು'],
      showOrders: ['ಆರ್ಡರ್‌ಗಳನ್ನು ತೋರಿಸಿ', 'ಆರ್ಡರ್‌ಗಳು', 'ನನ್ನ ಆರ್ಡರ್‌ಗಳು'],
      checkout: ['ಚೆಕ್‌ಔಟ್', 'ಪಾವತಿ', 'ಪೇಮೆಂಟ್'],
      help: ['ಸಹಾಯ', 'ಬೆಂಬಲ', 'ಕಮಾಂಡ್‌ಗಳು']
    }
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      const recognitionInstance = new SpeechRecognition()
      
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = false
      recognitionInstance.maxAlternatives = 3
      
      // Set language based on current i18n language
      const currentLang = i18n.language || 'en'
      recognitionInstance.lang = languageMap[currentLang] || 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
        console.log('Voice recognition started')
      }
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence
        
        setLastCommand(transcript)
        setConfidence(confidence)
        
        console.log('Voice command:', transcript, 'Confidence:', confidence)
        
        if (confidence > 0.6) {
          processVoiceCommand(transcript)
        } else {
          toast.error(t('voice.responses.commandNotRecognized'))
        }
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        if (event.error === 'no-speech') {
          toast.info(t('search.noResults'))
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.')
        } else {
          toast.error(t('voice.responses.commandNotRecognized'))
        }
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
        console.log('Voice recognition ended')
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      console.warn('Speech recognition not supported')
    }
  }, [i18n.language, t])

  // Process voice commands
  const processVoiceCommand = useCallback((transcript) => {
    const currentLang = i18n.language || 'en'
    const commands = commandMappings[currentLang] || commandMappings.en
    
    let matchedCommand = null
    let matchedAction = null
    
    // Find matching command
    for (const [action, phrases] of Object.entries(commands)) {
      for (const phrase of phrases) {
        if (transcript.includes(phrase)) {
          matchedCommand = phrase
          matchedAction = action
          break
        }
      }
      if (matchedCommand) break
    }
    
    if (matchedAction) {
      executeVoiceCommand(matchedAction, transcript, matchedCommand)
    } else {
      // Try to extract search terms
      const searchTerms = extractSearchTerms(transcript, currentLang)
      if (searchTerms) {
        executeVoiceCommand('search', searchTerms)
      } else {
        toast.error(t('voice.responses.commandNotRecognized'))
        speakResponse(t('voice.responses.helpText'))
      }
    }
  }, [i18n.language, t, navigate, addToCart])

  // Extract search terms from transcript
  const extractSearchTerms = (transcript, language) => {
    const searchPrefixes = {
      en: ['search for', 'find', 'look for', 'show me'],
      hi: ['खोजें', 'ढूंढें', 'दिखाएं'],
      te: ['వెతకండి', 'కనుగొనండి', 'చూపించండి'],
      ta: ['தேடு', 'கண்டுபிடி', 'காட்டு'],
      kn: ['ಹುಡುಕಿ', 'ಕಂಡುಹಿಡಿ', 'ತೋರಿಸಿ']
    }
    
    const prefixes = searchPrefixes[language] || searchPrefixes.en
    
    for (const prefix of prefixes) {
      if (transcript.includes(prefix)) {
        return transcript.replace(prefix, '').trim()
      }
    }
    
    return null
  }

  // Execute voice commands
  const executeVoiceCommand = useCallback((action, transcript, command) => {
    console.log('Executing voice command:', action, transcript)
    
    switch (action) {
      case 'search':
        const searchTerm = typeof transcript === 'string' ? transcript : command
        navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
        speakResponse(`${t('voice.responses.searchingFor')} ${searchTerm}`)
        toast.success(`${t('voice.responses.searchingFor')} ${searchTerm}`)
        break
        
      case 'goToCart':
        navigate('/cart')
        speakResponse(`${t('voice.responses.navigatingTo')} ${t('navigation.cart')}`)
        toast.success(`${t('voice.responses.navigatingTo')} ${t('navigation.cart')}`)
        break
        
      case 'goHome':
        navigate('/')
        speakResponse(`${t('voice.responses.navigatingTo')} ${t('navigation.home')}`)
        toast.success(`${t('voice.responses.navigatingTo')} ${t('navigation.home')}`)
        break
        
      case 'showProducts':
        navigate('/products')
        speakResponse(`${t('voice.responses.navigatingTo')} ${t('navigation.products')}`)
        toast.success(`${t('voice.responses.navigatingTo')} ${t('navigation.products')}`)
        break
        
      case 'showOrders':
        navigate('/orders')
        speakResponse(`${t('voice.responses.navigatingTo')} ${t('navigation.orders')}`)
        toast.success(`${t('voice.responses.navigatingTo')} ${t('navigation.orders')}`)
        break
        
      case 'checkout':
        navigate('/cart')
        speakResponse(`${t('voice.responses.navigatingTo')} ${t('cart.checkout')}`)
        toast.success(`${t('voice.responses.navigatingTo')} ${t('cart.checkout')}`)
        break
        
      case 'help':
        speakResponse(t('voice.responses.helpText'))
        toast.info(t('voice.responses.helpText'))
        break
        
      default:
        toast.error(t('voice.responses.commandNotRecognized'))
        speakResponse(t('voice.responses.commandNotRecognized'))
    }
  }, [navigate, addToCart, t])

  // Text-to-speech response
  const speakResponse = useCallback((text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text)
      const currentLang = i18n.language || 'en'
      
      // Set voice language
      utterance.lang = languageMap[currentLang] || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8
      
      speechSynthesis.speak(utterance)
    }
  }, [i18n.language])

  // Start listening
  const startListening = useCallback(() => {
    if (recognition && !isListening) {
      try {
        // Update language before starting
        const currentLang = i18n.language || 'en'
        recognition.lang = languageMap[currentLang] || 'en-US'
        
        recognition.start()
        
        // Auto-stop after 10 seconds
        timeoutRef.current = setTimeout(() => {
          if (isListening) {
            stopListening()
          }
        }, 10000)
      } catch (error) {
        console.error('Error starting voice recognition:', error)
        toast.error('Failed to start voice recognition')
      }
    }
  }, [recognition, isListening, i18n.language])

  // Stop listening
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [recognition, isListening])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return {
    isListening,
    isSupported,
    startListening,
    stopListening,
    lastCommand,
    confidence,
    speakResponse
  }
}

export default useVoiceNavigation
