import { createContext, useState } from 'react'

// Убедитесь, что эта переменная окружения точно совпадает с той, что вы добавили в Vercel
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
    setTimeout(() => {
      setResultData((prev) => prev + nextChar)
      if (index === fullResponse.length - 1) {
        setLoading(false)
      }
    }, 10 * index)
  }

  const onSent = async (prompt) => {
    setLoading(true)
    setShowResult(true)
    setResultData('')
    setRecentPrompt(prompt)

    // Добавляем новый запрос в историю
    const updatedHistory = [
      ...prevPrompts,
      {
        role: 'user',
        parts: [{ text: prompt }],
      },
    ]
    setPrevPrompts(updatedHistory)

    try {
      // ИЗМЕНЁННЫЙ URL ДЛЯ ПРЯМОГО ЗАПРОСА НА VERVEL
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
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

      const geminiResponse = {
        role: 'model',
        parts: [{ text: text }],
      }
      setPrevPrompts((prev) => [...prev, geminiResponse])

      for (let i = 0; i < text.length; i++) {
        delayTyping(i, text[i], text)
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
