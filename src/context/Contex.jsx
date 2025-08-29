import { createContext, useState } from 'react'
import { marked } from 'marked'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

export const Context = createContext()

const ContextProvider = (props) => {
  const [input, setInput] = useState('')
  const [recentPrompt, setRecentPrompt] = useState('')
  const [prevPrompts, setPrevPrompts] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultData, setResultData] = useState('')

  const delayTyping = (index, nextChar, fullResponse) => {
    // Изменили на символы
    setTimeout(() => {
      setResultData((prev) => prev + nextChar)
      if (index === fullResponse.length - 1) {
        setLoading(false)
      }
    }, 10 * index) // Очень маленькая задержка на символ
  }

  const onSent = async (prompt) => {
    setLoading(true)
    setShowResult(true)
    setResultData('')
    setRecentPrompt(prompt)

    const updatedHistory = [
      ...prevPrompts,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]
    setPrevPrompts(updatedHistory)

    try {
      const response = await fetch(
        `/gemini/v1beta/models/gemini-2.0-flash:generateContent`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-goog-api-key': API_KEY,
          },
          body: JSON.stringify({
            contents: updatedHistory,
          }),
        }
      )

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No valid response from API.'

      if (text === 'No valid response from API.') {
        throw new Error('API returned an empty response.')
      }

      // ПРЕОБРАЗУЕМ MARKDOWN В HTML
      const htmlText = marked.parse(text)

      // Теперь выводим по символам, а не по словам
      for (let i = 0; i < htmlText.length; i++) {
        delayTyping(i, htmlText[i], htmlText)
      }
    } catch (error) {
      console.error('Ошибка:', error)
      setResultData(
        `An error occurred while fetching the response: ${error.message}.`
      )
      setLoading(false)
    }
  }

  const contextValue = {
    onSent,
    loading,
    resultData,
    input,
    setInput,
    recentPrompt,
    prevPrompts,
    showResult,
  }

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  )
}

export default ContextProvider
