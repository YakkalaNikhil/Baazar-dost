import { useState, useEffect, useCallback, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../contexts/CartContext'
import { toast } from 'react-toastify'
import { products, searchProducts } from '../data/products'

const useVoiceOrdering = () => {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const { addToCart, updateQuantity, removeFromCart } = useCart()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [lastCommand, setLastCommand] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [isProcessing, setIsProcessing] = useState(false)
  const timeoutRef = useRef(null)

  // Language mapping for speech recognition
  const languageMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN'
  }

  // Product name mappings for voice recognition in different languages
  const productVoiceMappings = {
    en: {
      // Panipuri supplies
      'panipuri': ['panipuri', 'pani puri', 'gol gappa', 'puchka'],
      'panipuri kit': ['panipuri kit', 'pani puri kit', 'complete panipuri kit'],
      'panipuri puris': ['panipuri puris', 'pani puri puris', 'puris', 'gol gappa puris'],
      'panipuri masala': ['panipuri masala', 'pani puri masala', 'masala powder'],
      
      // Waffle supplies
      'waffle mix': ['waffle mix', 'waffle batter', 'ready waffle mix'],
      'chocolate syrup': ['chocolate syrup', 'chocolate sauce', 'waffle syrup'],
      
      // Grains & cereals
      'rice': ['rice', 'basmati rice', 'premium rice'],
      'wheat flour': ['wheat flour', 'atta', 'flour'],
      'maida': ['maida', 'refined flour', 'all purpose flour'],
      
      // Vegetables
      'onions': ['onions', 'red onions', 'pyaz'],
      'tomatoes': ['tomatoes', 'tomato', 'tamatar'],
      'potatoes': ['potatoes', 'potato', 'aloo'],
      'green chillies': ['green chillies', 'green chili', 'hari mirch'],
      
      // Spices
      'turmeric': ['turmeric', 'turmeric powder', 'haldi'],
      'chili powder': ['chili powder', 'red chili powder', 'lal mirch'],
      'garam masala': ['garam masala', 'masala powder'],
      
      // Dairy
      'milk': ['milk', 'fresh milk', 'milk packets'],
      
      // Beverages
      'tea': ['tea', 'tea powder', 'chai'],
      
      // Packaging
      'paper plates': ['paper plates', 'disposable plates', 'plates'],
      'plastic cups': ['plastic cups', 'disposable cups', 'cups']
    },
    hi: {
      // Panipuri supplies
      'panipuri': ['पानीपूरी', 'पानी पूरी', 'गोल गप्पा', 'पुचका'],
      'panipuri kit': ['पानीपूरी किट', 'पानी पूरी किट', 'कम्प्लीट पानीपूरी किट'],
      'panipuri puris': ['पानीपूरी पूरी', 'पूरी', 'गोल गप्पा पूरी'],
      'panipuri masala': ['पानीपूरी मसाला', 'मसाला पाउडर'],
      
      // Waffle supplies
      'waffle mix': ['वैफल मिक्स', 'वैफल बैटर'],
      'chocolate syrup': ['चॉकलेट सिरप', 'चॉकलेट सॉस'],
      
      // Grains & cereals
      'rice': ['चावल', 'बासमती चावल'],
      'wheat flour': ['गेहूं का आटा', 'आटा'],
      'maida': ['मैदा', 'रिफाइंड आटा'],
      
      // Vegetables
      'onions': ['प्याज', 'लाल प्याज'],
      'tomatoes': ['टमाटर'],
      'potatoes': ['आलू'],
      'green chillies': ['हरी मिर्च'],
      
      // Spices
      'turmeric': ['हल्दी', 'हल्दी पाउडर'],
      'chili powder': ['लाल मिर्च पाउडर', 'मिर्च पाउडर'],
      'garam masala': ['गरम मसाला'],
      
      // Dairy
      'milk': ['दूध', 'ताजा दूध'],
      
      // Beverages
      'tea': ['चाय', 'चाय पाउडर'],
      
      // Packaging
      'paper plates': ['पेपर प्लेट', 'डिस्पोजेबल प्लेट'],
      'plastic cups': ['प्लास्टिक कप', 'डिस्पोजेबल कप']
    },
    te: {
      // Panipuri supplies
      'panipuri': ['పానీపూరీ', 'పానీ పూరీ', 'గోల్ గప్పా'],
      'panipuri kit': ['పానీపూరీ కిట్', 'కంప్లీట్ పానీపూరీ కిట్'],
      'panipuri puris': ['పానీపూరీ పూరీలు', 'పూరీలు'],
      'panipuri masala': ['పానీపూరీ మసాలా', 'మసాలా పౌడర్'],
      
      // Waffle supplies
      'waffle mix': ['వాఫిల్ మిక్స్', 'రెడీ వాఫిల్ మిక్స్'],
      'chocolate syrup': ['చాక్లెట్ సిరప్', 'చాక్లెట్ సాస్'],
      
      // Grains & cereals
      'rice': ['బియ్యం', 'బాస్మతి బియ్యం'],
      'wheat flour': ['గోధుమ పిండి', 'పిండి'],
      'maida': ['మైదా', 'రిఫైన్డ్ పిండి'],
      
      // Vegetables
      'onions': ['ఉల్లిపాయలు', 'ఎర్ర ఉల్లిపాయలు'],
      'tomatoes': ['టమాటాలు'],
      'potatoes': ['బంగాళాదుంపలు', 'ఆలూ'],
      'green chillies': ['పచ్చి మిర్చి'],
      
      // Spices
      'turmeric': ['పసుపు', 'పసుపు పౌడర్'],
      'chili powder': ['ఎర్ర మిర్చి పౌడర్', 'మిర్చి పౌడర్'],
      'garam masala': ['గరం మసాలా'],
      
      // Dairy
      'milk': ['పాలు', 'తాజా పాలు'],
      
      // Beverages
      'tea': ['టీ', 'టీ పౌడర్', 'చాయ్'],
      
      // Packaging
      'paper plates': ['పేపర్ ప్లేట్లు', 'డిస్పోజబుల్ ప్లేట్లు'],
      'plastic cups': ['ప్లాస్టిక్ కప్పులు', 'డిస్పోజబుల్ కప్పులు']
    },
    ta: {
      // Panipuri supplies
      'panipuri': ['பானிபூரி', 'பானி பூரி', 'கோல் கப்பா'],
      'panipuri kit': ['பானிபூரி கிட்', 'கம்ப்ளீட் பானிபூரி கிட்'],
      'panipuri puris': ['பானிபூரி பூரிகள்', 'பூரிகள்'],
      'panipuri masala': ['பானிபூரி மசாலா', 'மசாலா பவுடர்'],
      
      // Waffle supplies
      'waffle mix': ['வாஃபிள் மிக்ஸ்', 'ரெடி வாஃபிள் மிக்ஸ்'],
      'chocolate syrup': ['சாக்லேட் சிரப்', 'சாக்லேட் சாஸ்'],
      
      // Grains & cereals
      'rice': ['அரிசி', 'பாஸ்மதி அரிசி'],
      'wheat flour': ['கோதுமை மாவு', 'மாவு'],
      'maida': ['மைதா', 'ரிஃபைன்ட் மாவு'],
      
      // Vegetables
      'onions': ['வெங்காயம்', 'சிவப்பு வெங்காயம்'],
      'tomatoes': ['தக்காளி'],
      'potatoes': ['உருளைக்கிழங்கு', 'ஆலு'],
      'green chillies': ['பச்சை மிளகாய்'],
      
      // Spices
      'turmeric': ['மஞ்சள்', 'மஞ்சள் பவுடர்'],
      'chili powder': ['சிவப்பு மிளகாய் பவுடர்', 'மிளகாய் பவுடர்'],
      'garam masala': ['கரம் மசாலா'],
      
      // Dairy
      'milk': ['பால்', 'புதிய பால்'],
      
      // Beverages
      'tea': ['தேநீர்', 'தேநீர் பவுடர்', 'சாய்'],
      
      // Packaging
      'paper plates': ['பேப்பர் பிளேட்கள்', 'டிஸ்போசபிள் பிளேட்கள்'],
      'plastic cups': ['பிளாஸ்டிக் கப்கள்', 'டிஸ்போசபிள் கப்கள்']
    },
    kn: {
      // Panipuri supplies
      'panipuri': ['ಪಾನಿಪೂರಿ', 'ಪಾನಿ ಪೂರಿ', 'ಗೋಲ್ ಗಪ್ಪಾ'],
      'panipuri kit': ['ಪಾನಿಪೂರಿ ಕಿಟ್', 'ಕಂಪ್ಲೀಟ್ ಪಾನಿಪೂರಿ ಕಿಟ್'],
      'panipuri puris': ['ಪಾನಿಪೂರಿ ಪೂರಿಗಳು', 'ಪೂರಿಗಳು'],
      'panipuri masala': ['ಪಾನಿಪೂರಿ ಮಸಾಲಾ', 'ಮಸಾಲಾ ಪೌಡರ್'],
      
      // Waffle supplies
      'waffle mix': ['ವಾಫಲ್ ಮಿಕ್ಸ್', 'ರೆಡಿ ವಾಫಲ್ ಮಿಕ್ಸ್'],
      'chocolate syrup': ['ಚಾಕ್ಲೆಟ್ ಸಿರಪ್', 'ಚಾಕ್ಲೆಟ್ ಸಾಸ್'],
      
      // Grains & cereals
      'rice': ['ಅಕ್ಕಿ', 'ಬಾಸ್ಮತಿ ಅಕ್ಕಿ'],
      'wheat flour': ['ಗೋಧಿ ಹಿಟ್ಟು', 'ಹಿಟ್ಟು'],
      'maida': ['ಮೈದಾ', 'ರಿಫೈನ್ಡ್ ಹಿಟ್ಟು'],
      
      // Vegetables
      'onions': ['ಈರುಳ್ಳಿ', 'ಕೆಂಪು ಈರುಳ್ಳಿ'],
      'tomatoes': ['ಟೊಮೇಟೊ'],
      'potatoes': ['ಆಲೂಗಡ್ಡೆ', 'ಆಲೂ'],
      'green chillies': ['ಹಸಿ ಮೆಣಸಿನಕಾಯಿ'],
      
      // Spices
      'turmeric': ['ಅರಿಶಿನ', 'ಅರಿಶಿನ ಪೌಡರ್'],
      'chili powder': ['ಕೆಂಪು ಮೆಣಸಿನ ಪೌಡರ್', 'ಮೆಣಸಿನ ಪೌಡರ್'],
      'garam masala': ['ಗರಂ ಮಸಾಲಾ'],
      
      // Dairy
      'milk': ['ಹಾಲು', 'ತಾಜಾ ಹಾಲು'],
      
      // Beverages
      'tea': ['ಚಹಾ', 'ಚಹಾ ಪೌಡರ್'],
      
      // Packaging
      'paper plates': ['ಪೇಪರ್ ಪ್ಲೇಟ್‌ಗಳು', 'ಡಿಸ್ಪೋಸಬಲ್ ಪ್ಲೇಟ್‌ಗಳು'],
      'plastic cups': ['ಪ್ಲಾಸ್ಟಿಕ್ ಕಪ್‌ಗಳು', 'ಡಿಸ್ಪೋಸಬಲ್ ಕಪ್‌ಗಳು']
    }
  }

  // Voice command patterns for different actions
  const commandPatterns = {
    en: {
      addToCart: ['add', 'buy', 'purchase', 'order', 'get me', 'i want', 'i need'],
      removeFromCart: ['remove', 'delete', 'cancel', 'take out'],
      updateQuantity: ['change quantity', 'update quantity', 'make it', 'change to'],
      search: ['search', 'find', 'look for', 'show me'],
      checkout: ['checkout', 'pay', 'complete order', 'finish order'],
      viewCart: ['show cart', 'view cart', 'cart', 'my cart'],
      help: ['help', 'what can you do', 'commands']
    },
    hi: {
      addToCart: ['जोड़ें', 'खरीदें', 'ऑर्डर करें', 'मुझे चाहिए', 'लेना है'],
      removeFromCart: ['हटाएं', 'निकालें', 'रद्द करें'],
      updateQuantity: ['मात्रा बदलें', 'संख्या बदलें', 'बनाएं'],
      search: ['खोजें', 'ढूंढें', 'दिखाएं'],
      checkout: ['चेकआउट', 'भुगतान', 'ऑर्डर पूरा करें'],
      viewCart: ['कार्ट दिखाएं', 'कार्ट देखें', 'मेरा कार्ट'],
      help: ['सहायता', 'मदद', 'आप क्या कर सकते हैं']
    },
    te: {
      addToCart: ['జోడించండి', 'కొనండి', 'ఆర్డర్ చేయండి', 'నాకు కావాలి', 'తీసుకోవాలి'],
      removeFromCart: ['తొలగించండి', 'తీసివేయండి', 'రద్దు చేయండి'],
      updateQuantity: ['పరిమాణం మార్చండి', 'సంఖ్య మార్చండి', 'చేయండి'],
      search: ['వెతకండి', 'కనుగొనండి', 'చూపించండి'],
      checkout: ['చెక్అవుట్', 'చెల్లింపు', 'ఆర్డర్ పూర్తి చేయండి'],
      viewCart: ['కార్ట్ చూపించండి', 'కార్ట్ చూడండి', 'నా కార్ట్'],
      help: ['సహాయం', 'మద్దతు', 'మీరు ఏమి చేయగలరు']
    },
    ta: {
      addToCart: ['சேர்க்கவும்', 'வாங்கவும்', 'ஆர்டர் செய்யவும்', 'எனக்கு வேண்டும்', 'எடுக்க வேண்டும்'],
      removeFromCart: ['அகற்றவும்', 'எடுத்துவிடவும்', 'ரத்து செய்யவும்'],
      updateQuantity: ['அளவு மாற்றவும்', 'எண்ணிக்கை மாற்றவும்', 'செய்யவும்'],
      search: ['தேடவும்', 'கண்டுபிடிக்கவும்', 'காட்டவும்'],
      checkout: ['செக்அவுட்', 'பணம் செலுத்தவும்', 'ஆர்டர் முடிக்கவும்'],
      viewCart: ['கார்ட் காட்டவும்', 'கார்ட் பார்க்கவும்', 'என் கார்ட்'],
      help: ['உதவி', 'ஆதரவு', 'நீங்கள் என்ன செய்ய முடியும்']
    },
    kn: {
      addToCart: ['ಸೇರಿಸಿ', 'ಖರೀದಿಸಿ', 'ಆರ್ಡರ್ ಮಾಡಿ', 'ನನಗೆ ಬೇಕು', 'ತೆಗೆದುಕೊಳ್ಳಬೇಕು'],
      removeFromCart: ['ತೆಗೆದುಹಾಕಿ', 'ತೆಗೆಯಿರಿ', 'ರದ್ದುಗೊಳಿಸಿ'],
      updateQuantity: ['ಪ್ರಮಾಣ ಬದಲಾಯಿಸಿ', 'ಸಂಖ್ಯೆ ಬದಲಾಯಿಸಿ', 'ಮಾಡಿ'],
      search: ['ಹುಡುಕಿ', 'ಕಂಡುಹಿಡಿ', 'ತೋರಿಸಿ'],
      checkout: ['ಚೆಕ್‌ಔಟ್', 'ಪಾವತಿ', 'ಆರ್ಡರ್ ಪೂರ್ಣಗೊಳಿಸಿ'],
      viewCart: ['ಕಾರ್ಟ್ ತೋರಿಸಿ', 'ಕಾರ್ಟ್ ನೋಡಿ', 'ನನ್ನ ಕಾರ್ಟ್'],
      help: ['ಸಹಾಯ', 'ಬೆಂಬಲ', 'ನೀವು ಏನು ಮಾಡಬಹುದು']
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
      recognitionInstance.maxAlternatives = 5
      
      // Set language based on current i18n language
      const currentLang = i18n.language || 'en'
      recognitionInstance.lang = languageMap[currentLang] || 'en-US'
      
      recognitionInstance.onstart = () => {
        setIsListening(true)
        setIsProcessing(false)
        console.log('Voice ordering started')
      }
      
      recognitionInstance.onresult = (event) => {
        const result = event.results[0]
        const transcript = result[0].transcript.toLowerCase().trim()
        const confidence = result[0].confidence
        
        setLastCommand(transcript)
        setConfidence(confidence)
        
        console.log('Voice command:', transcript, 'Confidence:', confidence)
        
        if (confidence > 0.5) {
          setIsProcessing(true)
          processVoiceOrder(transcript)
        } else {
          toast.error(t('voice.responses.commandNotRecognized'))
          speakResponse(t('voice.responses.commandNotRecognized'))
        }
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        setIsProcessing(false)
        
        if (event.error === 'no-speech') {
          toast.info('No speech detected. Please try again.')
        } else if (event.error === 'not-allowed') {
          toast.error('Microphone access denied. Please enable microphone permissions.')
        } else {
          toast.error(t('voice.responses.commandNotRecognized'))
        }
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
        setIsProcessing(false)
        console.log('Voice ordering ended')
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      console.warn('Speech recognition not supported')
    }
  }, [i18n.language, t])

  // Process voice orders
  const processVoiceOrder = useCallback((transcript) => {
    const currentLang = i18n.language || 'en'
    const patterns = commandPatterns[currentLang] || commandPatterns.en
    const productMappings = productVoiceMappings[currentLang] || productVoiceMappings.en

    let detectedAction = null
    let detectedProduct = null
    let detectedQuantity = 1

    // Detect action
    for (const [action, phrases] of Object.entries(patterns)) {
      for (const phrase of phrases) {
        if (transcript.includes(phrase)) {
          detectedAction = action
          break
        }
      }
      if (detectedAction) break
    }

    // Detect product
    for (const [productKey, variations] of Object.entries(productMappings)) {
      for (const variation of variations) {
        if (transcript.includes(variation)) {
          detectedProduct = findProductByVoiceName(productKey, currentLang)
          break
        }
      }
      if (detectedProduct) break
    }

    // Detect quantity
    const quantityMatch = transcript.match(/(\d+|one|two|three|four|five|six|seven|eight|nine|ten)/i)
    if (quantityMatch) {
      const quantityText = quantityMatch[1].toLowerCase()
      const numberMap = {
        'one': 1, 'two': 2, 'three': 3, 'four': 4, 'five': 5,
        'six': 6, 'seven': 7, 'eight': 8, 'nine': 9, 'ten': 10
      }
      detectedQuantity = numberMap[quantityText] || parseInt(quantityText) || 1
    }

    console.log('Detected:', { action: detectedAction, product: detectedProduct, quantity: detectedQuantity })

    executeVoiceOrder(detectedAction, detectedProduct, detectedQuantity, transcript)
  }, [i18n.language, addToCart, updateQuantity, removeFromCart, navigate])

  // Find product by voice name
  const findProductByVoiceName = (voiceKey, language) => {
    // Search through products to find matching ones
    const searchResults = searchProducts(voiceKey)
    if (searchResults.length > 0) {
      return searchResults[0] // Return the first match
    }

    // Fallback: search by product name patterns
    const productKeyMappings = {
      'panipuri': 'panipuri-kit-complete',
      'panipuri kit': 'panipuri-kit-complete',
      'panipuri puris': 'panipuri-puris-fresh',
      'panipuri masala': 'panipuri-masala-powder',
      'waffle mix': 'waffle-mix-ready',
      'chocolate syrup': 'chocolate-syrup-waffle',
      'rice': 'rice-basmati-25kg',
      'wheat flour': 'wheat-flour-10kg',
      'onions': 'red-onions-fresh',
      'tomatoes': 'tomatoes-fresh',
      'potatoes': 'potatoes-fresh',
      'green chillies': 'green-chillies-fresh',
      'turmeric': 'turmeric-powder',
      'chili powder': 'chili-powder',
      'garam masala': 'garam-masala-powder',
      'milk': 'milk-packets',
      'tea': 'tea-powder',
      'paper plates': 'paper-plates',
      'plastic cups': 'plastic-cups-disposable'
    }

    const productId = productKeyMappings[voiceKey]
    return products.find(p => p.id === productId)
  }

  // Execute voice orders
  const executeVoiceOrder = useCallback((action, product, quantity, originalTranscript) => {
    console.log('Executing voice order:', { action, product, quantity })

    switch (action) {
      case 'addToCart':
        if (product) {
          addToCart(product, quantity)
          const message = `${t('voice.responses.addedToCart')}: ${quantity} ${product.name}`
          toast.success(message)
          speakResponse(message)
        } else {
          const errorMsg = t('voice.responses.productNotFound')
          toast.error(errorMsg)
          speakResponse(errorMsg)
        }
        break

      case 'removeFromCart':
        if (product) {
          removeFromCart(product.id)
          const message = `Removed ${product.name} from cart`
          toast.success(message)
          speakResponse(message)
        } else {
          const errorMsg = 'Product not found to remove'
          toast.error(errorMsg)
          speakResponse(errorMsg)
        }
        break

      case 'updateQuantity':
        if (product && quantity) {
          updateQuantity(product.id, quantity)
          const message = `Updated ${product.name} quantity to ${quantity}`
          toast.success(message)
          speakResponse(message)
        } else {
          const errorMsg = 'Could not update quantity'
          toast.error(errorMsg)
          speakResponse(errorMsg)
        }
        break

      case 'search':
        const searchTerm = originalTranscript.replace(/search|find|look for|show me/gi, '').trim()
        if (searchTerm) {
          navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
          const message = `${t('voice.responses.searchingFor')} ${searchTerm}`
          toast.success(message)
          speakResponse(message)
        }
        break

      case 'viewCart':
        navigate('/cart')
        const cartMessage = `${t('voice.responses.navigatingTo')} ${t('navigation.cart')}`
        toast.success(cartMessage)
        speakResponse(cartMessage)
        break

      case 'checkout':
        navigate('/cart')
        const checkoutMessage = `${t('voice.responses.navigatingTo')} ${t('cart.checkout')}`
        toast.success(checkoutMessage)
        speakResponse(checkoutMessage)
        break

      case 'help':
        const helpMessage = t('voice.responses.helpText')
        toast.info(helpMessage)
        speakResponse(helpMessage)
        break

      default:
        // Try to interpret as a search if no specific action detected
        if (originalTranscript.trim()) {
          navigate(`/products?search=${encodeURIComponent(originalTranscript)}`)
          const searchMessage = `${t('voice.responses.searchingFor')} ${originalTranscript}`
          toast.success(searchMessage)
          speakResponse(searchMessage)
        } else {
          const errorMsg = t('voice.responses.commandNotRecognized')
          toast.error(errorMsg)
          speakResponse(errorMsg)
        }
    }

    setIsProcessing(false)
  }, [addToCart, updateQuantity, removeFromCart, navigate, t])

  // Text-to-speech function
  const speakResponse = useCallback((text) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      const currentLang = i18n.language || 'en'

      // Set language for speech synthesis
      const speechLangMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'kn': 'kn-IN'
      }

      utterance.lang = speechLangMap[currentLang] || 'en-US'
      utterance.rate = 0.9
      utterance.pitch = 1
      utterance.volume = 0.8

      window.speechSynthesis.speak(utterance)
    }
  }, [i18n.language])

  // Start listening function
  const startListening = useCallback(() => {
    if (!recognition || !isSupported) {
      toast.error('Speech recognition not supported')
      return
    }

    if (isListening) {
      return
    }

    try {
      // Update language if changed
      const currentLang = i18n.language || 'en'
      recognition.lang = languageMap[currentLang] || 'en-US'

      recognition.start()

      // Auto-stop after 10 seconds
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognition.stop()
        }
      }, 10000)

    } catch (error) {
      console.error('Error starting voice recognition:', error)
      toast.error('Failed to start voice recognition')
    }
  }, [recognition, isSupported, isListening, i18n.language])

  // Stop listening function
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [recognition, isListening])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (recognition) {
        recognition.stop()
      }
    }
  }, [recognition])

  return {
    isListening,
    isSupported,
    isProcessing,
    lastCommand,
    confidence,
    startListening,
    stopListening,
    processVoiceOrder,
    speakResponse
  }
}

export default useVoiceOrdering
