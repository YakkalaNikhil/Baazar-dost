import React, { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Mic, MicOff, Volume2, AlertCircle } from 'lucide-react'
import { toast } from 'react-toastify'

const VoiceSearchButton = ({ onResult, onError, disabled = false, className = '' }) => {
  const { t, i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [recognition, setRecognition] = useState(null)
  const [transcript, setTranscript] = useState('')
  const [confidence, setConfidence] = useState(0)
  const [error, setError] = useState(null)

  // Language mapping for speech recognition
  const languageMap = {
    'en': 'en-US',
    'hi': 'hi-IN',
    'te': 'te-IN',
    'ta': 'ta-IN',
    'kn': 'kn-IN'
  }

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognitionInstance = new SpeechRecognition()
      
      // Configure recognition settings
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.maxAlternatives = 3
      recognitionInstance.lang = languageMap[i18n.language] || 'en-US'
      
      // Event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true)
        setError(null)
        setTranscript('')
        setConfidence(0)
        toast.info(t('search.listening'), {
          autoClose: 1000,
          hideProgressBar: true
        })
      }
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        let maxConfidence = 0
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i]
          const transcript = result[0].transcript
          const confidence = result[0].confidence
          
          if (result.isFinal) {
            finalTranscript += transcript
            maxConfidence = Math.max(maxConfidence, confidence)
          } else {
            interimTranscript += transcript
          }
        }
        
        const currentTranscript = finalTranscript || interimTranscript
        setTranscript(currentTranscript)
        setConfidence(maxConfidence)
        
        // If we have a final result, process it
        if (finalTranscript) {
          handleVoiceResult(finalTranscript, maxConfidence)
        }
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        setIsListening(false)
        handleVoiceError(event.error)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      setError('Voice search not supported in this browser')
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [i18n.language])

  // Handle voice recognition results
  const handleVoiceResult = useCallback((transcript, confidence) => {
    if (!transcript.trim()) {
      toast.warning(t('search.noResults'))
      return
    }

    // Check confidence level
    if (confidence < 0.5) {
      toast.warning('Low confidence in voice recognition. Please try again.')
    }

    // Clean and process the transcript
    const cleanedTranscript = transcript.trim().toLowerCase()
    
    // Call the parent callback with the result
    if (onResult) {
      onResult({
        transcript: cleanedTranscript,
        confidence,
        language: i18n.language
      })
    }

    toast.success(`${t('search.searchResults')}: "${transcript}"`)
  }, [onResult, t, i18n.language])

  // Handle voice recognition errors
  const handleVoiceError = useCallback((errorType) => {
    let errorMessage = t('common.error')
    let userAction = ''

    switch (errorType) {
      case 'no-speech':
        errorMessage = 'No speech detected. Please try again.'
        userAction = 'Speak clearly into your microphone'
        break
      case 'audio-capture':
        errorMessage = 'Microphone not accessible.'
        userAction = 'Check microphone permissions and connection'
        break
      case 'not-allowed':
        errorMessage = 'Microphone access denied.'
        userAction = 'Enable microphone permissions in browser settings'
        break
      case 'network':
        errorMessage = 'Network error occurred.'
        userAction = 'Check your internet connection'
        break
      case 'service-not-allowed':
        errorMessage = 'Speech recognition service unavailable.'
        userAction = 'Try again later or use text search'
        break
      case 'bad-grammar':
        errorMessage = 'Speech not recognized.'
        userAction = 'Speak more clearly or try different words'
        break
      default:
        errorMessage = `Speech recognition error: ${errorType}`
        userAction = 'Please try again'
    }

    setError({ message: errorMessage, action: userAction })
    
    toast.error(errorMessage, {
      autoClose: 5000
    })

    if (onError) {
      onError({ type: errorType, message: errorMessage, action: userAction })
    }
  }, [onError, t])

  // Start voice recognition
  const startListening = useCallback(() => {
    if (!isSupported) {
      toast.error('Voice search not supported in this browser')
      return
    }

    if (!recognition) {
      toast.error('Voice recognition not initialized')
      return
    }

    if (isListening) {
      return
    }

    try {
      // Update language before starting
      recognition.lang = languageMap[i18n.language] || 'en-US'
      recognition.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      toast.error('Failed to start voice search')
    }
  }, [recognition, isSupported, isListening, i18n.language, languageMap])

  // Stop voice recognition
  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  // Get button appearance based on state
  const getButtonStyle = () => {
    if (disabled) {
      return 'bg-gray-300 dark:bg-gray-600 cursor-not-allowed'
    }
    if (isListening) {
      return 'bg-red-500 hover:bg-red-600 animate-pulse'
    }
    if (!isSupported) {
      return 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
    }
    return 'bg-primary-600 hover:bg-primary-700'
  }

  const getButtonText = () => {
    if (!isSupported) return 'Not Supported'
    if (isListening) return t('search.stopListening')
    return t('search.voiceSearch')
  }

  const getIcon = () => {
    if (!isSupported) return <AlertCircle size={20} />
    if (isListening) return <MicOff size={20} />
    return <Mic size={20} />
  }

  return (
    <div className="relative">
      <button
        onClick={isListening ? stopListening : startListening}
        disabled={disabled || !isSupported}
        className={`
          ${getButtonStyle()}
          text-white px-4 py-2 rounded-md transition-all duration-200 
          flex items-center space-x-2 font-medium
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          ${className}
        `}
        title={isSupported ? getButtonText() : 'Voice search not supported'}
      >
        {getIcon()}
        <span className="hidden sm:inline">{getButtonText()}</span>
      </button>

      {/* Live transcript display */}
      {isListening && transcript && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50">
          <div className="flex items-center space-x-2 mb-2">
            <Volume2 size={16} className="text-primary-600" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('search.listening')}...
            </span>
          </div>
          <p className="text-gray-900 dark:text-white font-medium">
            "{transcript}"
          </p>
          {confidence > 0 && (
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                <span>Confidence</span>
                <span>{Math.round(confidence * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1 mt-1">
                <div 
                  className="bg-primary-600 h-1 rounded-full transition-all duration-300"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Error display */}
      {error && !isListening && (
        <div className="absolute top-full left-0 right-0 mt-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md shadow-lg z-50">
          <div className="flex items-start space-x-2">
            <AlertCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                {error.message}
              </p>
              {error.action && (
                <p className="text-xs text-red-600 dark:text-red-300 mt-1">
                  {error.action}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default VoiceSearchButton
