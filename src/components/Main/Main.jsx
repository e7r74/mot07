import React, { useContext } from 'react'
import { assets } from '../../assets/assets'
import './Main.css'
import { Context } from '../../context/Contex'

const Main = () => {
  const {
    onSent,
    recentPrompt,
    showResult,
    loading,
    resultData,
    setInput,
    input,
  } = useContext(Context)

  // Новая функция для обработки нажатия клавиш
  const handleKeyDown = (e) => {
    // Проверяем, была ли нажата клавиша "Enter"
    if (e.key === 'Enter' && input.trim() !== '') {
      onSent(input)
    }
  }

  return (
    <div className="main">
      <div className="nav">
        <p>Mot07</p>
        <img className="user_icon" src={assets.tree} alt="" />
      </div>
      <div className="main-container">
        {/* ИСПОЛЬЗУЕМ ТЕРНАРНЫЙ ОПЕРАТОР ЗДЕСЬ */}
        {!showResult ? (
          <>
            <div className="greet">
              <p>
                <span>Hello, Dev.</span>
                <br />
                How can I help you today?
              </p>
            </div>
            {/* <div className="cards">
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Suggest beautiful places to see on an upcoming road trip</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Brainstorm team bonding activities for our work retreat</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>Tell me about React js and React native</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div> */}
          </>
        ) : (
          <div className="result">
            <div className="result-title">
              <img className="user_icon" src={assets.tree} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              {/* <img src={assets.gemini_icon} alt="" /> */}
              {loading ? (
                <div className="loader">
                  <p>Loading...</p>
                </div>
              ) : (
                <p dangerouslySetInnerHTML={{ __html: resultData }}></p>
              )}
            </div>
          </div>
        )}
        <div className="main-bottom">
          <div className="search-box">
            <input
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown} // Добавлен обработчик события для клавиш
              value={input}
              type="text"
              placeholder="Enter a prompt here"
            />
            <div>
              {/* <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" /> */}
              {input ? (
                <img
                  onClick={() => onSent(input)}
                  src={assets.send_icon}
                  alt=""
                />
              ) : null}
            </div>
          </div>
          <div className="container"></div>
        </div>
      </div>
    </div>
  )
}

export default Main
