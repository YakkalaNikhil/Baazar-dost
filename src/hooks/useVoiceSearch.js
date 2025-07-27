import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'

export const useVoiceSearch = () => {
  const { i18n } = useTranslation()
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [recognition, setRecognition] = useState(null)
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Speech Recognition is supported
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    
    if (SpeechRecognition) {
      setIsSupported(true)
      
      const recognitionInstance = new SpeechRecognition()
      
      // Configure recognition settings
      recognitionInstance.continuous = false
      recognitionInstance.interimResults = true
      recognitionInstance.maxAlternatives = 1
      
      // Set language based on current i18n language
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'kn': 'kn-IN'
      }
      
      recognitionInstance.lang = languageMap[i18n.language] || 'en-US'
      
      // Event handlers
      recognitionInstance.onstart = () => {
        setIsListening(true)
        setTranscript('')
      }
      
      recognitionInstance.onresult = (event) => {
        let finalTranscript = ''
        let interimTranscript = ''
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript
          
          if (event.results[i].isFinal) {
            finalTranscript += transcript
          } else {
            interimTranscript += transcript
          }
        }
        
        setTranscript(finalTranscript || interimTranscript)
      }
      
      recognitionInstance.onend = () => {
        setIsListening(false)
      }
      
      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error)
        setIsListening(false)
        
        let errorMessage = 'Voice search failed'
        switch (event.error) {
          case 'no-speech':
            errorMessage = 'No speech detected. Please try again.'
            break
          case 'audio-capture':
            errorMessage = 'Microphone not accessible. Please check permissions.'
            break
          case 'not-allowed':
            errorMessage = 'Microphone access denied. Please enable microphone permissions.'
            break
          case 'network':
            errorMessage = 'Network error. Please check your connection.'
            break
          case 'service-not-allowed':
            errorMessage = 'Speech recognition service not available.'
            break
          default:
            errorMessage = `Speech recognition error: ${event.error}`
        }
        
        toast.error(errorMessage)
      }
      
      setRecognition(recognitionInstance)
    } else {
      setIsSupported(false)
      console.warn('Speech Recognition not supported in this browser')
    }
  }, [i18n.language])

  const startListening = useCallback(() => {
    if (!recognition || !isSupported) {
      toast.error('Voice search not supported in this browser')
      return
    }
    
    if (isListening) {
      return
    }
    
    try {
      recognition.start()
    } catch (error) {
      console.error('Error starting speech recognition:', error)
      toast.error('Failed to start voice search')
    }
  }, [recognition, isSupported, isListening])

  const stopListening = useCallback(() => {
    if (recognition && isListening) {
      recognition.stop()
    }
  }, [recognition, isListening])

  const resetTranscript = useCallback(() => {
    setTranscript('')
  }, [])

  // Update language when i18n language changes
  useEffect(() => {
    if (recognition) {
      const languageMap = {
        'en': 'en-US',
        'hi': 'hi-IN',
        'te': 'te-IN',
        'ta': 'ta-IN',
        'kn': 'kn-IN'
      }
      
      recognition.lang = languageMap[i18n.language] || 'en-US'
    }
  }, [i18n.language, recognition])

  return {
    isListening,
    transcript,
    isSupported,
    startListening,
    stopListening,
    resetTranscript
  }
}
