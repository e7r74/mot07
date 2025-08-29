import React, { useContext, useState } from 'react'
import './Sidebar.css'
import { assets } from '../../assets/assets'
import { Context } from '../../context/Contex' // Импортируем контекст

const Sidebar = () => {
  const [extended, setExtended] = useState(false)

  // Получаем данные из контекста
  const { onSent, prevPrompts, setRecentPrompt } = useContext(Context)

  const loadPrompt = async (prompt) => {
    setRecentPrompt(prompt)
    await onSent(prompt)
  }

  return (
    <div className="sidebar">
      <div className="top">
        <img
          onClick={() => setExtended((prev) => !prev)}
          className="menu"
          src={assets.icon_menu}
          alt="menu"
        />
        <div className="new-chat">
          <a href="/">
            <img src={assets.plus_icon} alt="" />
            {extended ? <p>New chat</p> : null}
          </a>
        </div>
        {extended ? (
          <div className="recent">
            <p className="recent-title">Recent</p>
            {/* Динамически выводим историю запросов */}
            {prevPrompts.map((item, index) => {
              // Отображаем только запросы пользователя
              if (item.role === 'user') {
                return (
                  <div
                    key={index}
                    onClick={() => loadPrompt(item.parts[0].text)}
                    className="recent-entry"
                  >
                    <img src={assets.message_icon} alt="message_icon" />
                    <p>{item.parts[0].text.slice(0, 18)}...</p>
                  </div>
                )
              }
              return null // Пропускаем ответы AI
            })}
          </div>
        ) : null}
      </div>
      <div className="bottom">
        <div className="bottom-item recent-entry">
          <a href="https://web.telegram.org/k/#@Joldassov">
            <img src={assets.question2} alt="" />
            {extended ? <p>Help</p> : null}
          </a>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
