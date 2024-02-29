import {useState} from "react";


const App = () => {
    const [value, setValue] = useState("")
    const [error, setError] = useState("")
    const [chatHistory, setChathistory] = useState([])

    const surpriseOption = [
        "Who is king of cricket?",
        "Which is best android phone?",
        "What is LLM?",
        "What is special this day?",
        "Who is the president of India?"
    ]

    const surprise = () => {
        const randomValue = surpriseOption[Math.floor(Math.random() * surpriseOption.length)]
        setValue(randomValue)
    }

    const getResponse = async () => {
        if (!value) {
            setError("Error! Please ask a question?")
            return
        }
        try {
            const option = {
                method: "POST",
                body: JSON.stringify({
                    history: chatHistory,
                    message: value
                }),
                headers: {
                    'Content-Type': 'application/json'
                }
            }
            const response = await fetch('http://localhost:8000/gemini', option)
            const data = await response.text()
            console.log(data)
            setChathistory(oldChatHistory => [...oldChatHistory, {
                role: "user",
                parts: value

            },
                {
                    role: "model",
                    parts: data
                }

            ])
            setValue("")

        } catch (error) {
            console.error(error)
            setError("Something went wrong! Please try again later.")
        }
    }
    const clear = () => {
        setValue("")
        setError("")
        setChathistory([])
    }

    return (
        <div className="app">
            <p>
                What do you want to Know?
                <button className="Surprise" onClick={surprise} disabled={!chatHistory}>
                    Surprise Me
                </button>
            </p>
            <div className="input-container">
                <input
                    value={value}
                    placeholder="What is AI--?"
                    onChange={(e) => setValue(e.target.value)}
                />
                {!error && <button onClick={getResponse}>Ask Me</button>}
                {error && <button onClick={clear}>Clear</button>}
            </div>
            {error && <p>{error}</p>}
            <div className="search-result">
                {chatHistory.map((chatItem, _index) => <div key={_index}>
                    <p className="answer">{chatItem.role}:{chatItem.parts}
                    </p>
                </div>)}
            </div>
        </div>
    )
}

export default App;
