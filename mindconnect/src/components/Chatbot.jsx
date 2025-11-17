import React, { useState, useEffect, useRef } from 'react';

// --- API Configuration (Corrected) ---
// We set API_KEY to an empty string ("") as required by the execution environment.
// The platform will automatically inject the correct API key 
// into the 'key' parameter of the API_URL at runtime.
const API_KEY = ""; 
const MODEL_NAME = "gemini-2.5-flash-preview-09-2025"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

// Function to convert the component's message state into the API's 'contents' payload format
const formatMessagesForAPI = (messages) => {
    // The API expects 'user' and 'model' roles.
    return messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
};

function Chatbot() {
    const [userInput, setUserInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // Scroll to the latest message whenever messages state changes
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Function to send the message to the Gemini API
    const sendMessage = async () => {
        if (!userInput.trim() || isLoading) return;

        const currentInput = userInput;
        const userMessage = { text: currentInput, sender: 'user' };
        
        // Optimistic UI update: 
        // Create the new state array (current messages + user's new message)
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);

        setUserInput(''); // Clear the input field
        setIsLoading(true);

        // Prepare the full conversation history for the API call using the new state array
        const historyForApi = formatMessagesForAPI(newMessages);

        const payload = {
            contents: historyForApi
        };
        
        let response;
        let retries = 0;
        const MAX_RETRIES = 3;

        // Make the fetch request with exponential backoff
        while (retries < MAX_RETRIES) {
            try {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.ok) {
                    const result = await response.json();
                    const botResponseText = result.candidates?.[0]?.content?.parts?.[0]?.text || "No response received from the model.";
                    
                    const botMessage = { text: botResponseText, sender: 'bot' };
                    
                    // Add the bot's response to the chat history
                    setMessages(prevMessages => [...prevMessages, botMessage]);
                    break; // Exit loop on success
                } else {
                    // Read the error body for detailed diagnostics
                    const errorBody = await response.text();
                    // CRUCIAL: Log the actual API response to help the user debug the issue
                    console.error(`API response not OK (Status: ${response.status}) Body:`, errorBody);
                    // Throw an error to trigger the retry logic
                    throw new Error(`API Error: ${response.statusText}`);
                }
            } catch (error) {
                retries++;
                if (retries < MAX_RETRIES) {
                    const delay = Math.pow(2, retries) * 1000; // 2s, 4s, 8s
                    // Log retries silently
                    await new Promise(resolve => setTimeout(resolve, delay));
                } else {
                    console.error('Error fetching from Gemini API after max retries:', error);
                    const errorMessage = { text: "Sorry, I encountered an API error after multiple attempts. Check the console for API response details.", sender: 'bot' };
                    // Append the final error message to the state
                    setMessages(prevMessages => {
                        // Prevent duplicating the error message if the user retries without a new turn
                        if (prevMessages[prevMessages.length - 1]?.text !== errorMessage.text) {
                           return [...prevMessages, errorMessage];
                        }
                        return prevMessages;
                    });
                }
            }
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !isLoading) {
            sendMessage();
        }
    };

    return (
        <div className="flex flex-col h-screen antialiased bg-gray-50 text-gray-800">
            <div className="flex flex-col flex-auto h-full p-6">
                <div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl bg-white shadow-2xl h-full p-4 md:p-6">
                    <h2 className="text-xl font-bold text-center text-indigo-600 mb-4">MindConnect</h2>
                    <div className="flex flex-col h-full overflow-y-auto mb-4">
                        <div className="flex flex-col h-full">
                            <div className="grid grid-cols-12 gap-y-2">
                                
                                {messages.map((msg, index) => (
                                    <div key={index} className={`col-start-1 col-end-13 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'} flex`}>
                                        <div className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                                            <div className={`relative ${msg.sender === 'user' ? 'mr-3' : 'ml-3'} text-sm py-2 px-4 shadow rounded-xl ${msg.sender === 'user' ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-800'}`}>
                                                <div>{msg.text}</div>
                                            </div>
                                            <span className={`text-xs text-gray-500 mt-1 ${msg.sender === 'user' ? 'mr-3' : 'ml-3'}`}>
                                                {msg.sender === 'user' ? 'You' : 'EasePal'}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {isLoading && (
                                    <div className="col-start-1 col-end-13 justify-start flex">
                                        <div className="flex flex-col items-start">
                                            <div className="relative ml-3 text-sm bg-gray-200 py-2 px-4 shadow rounded-xl">
                                                <div className="flex items-center space-x-1">
                                                    {/* Simple loading animation (dots) */}
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-100"></div>
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-200"></div>
                                                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce delay-300"></div>
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1 ml-3">
                                                EasePal is typing...
                                            </span>
                                        </div>
                                    </div>
                                )}
                                
                                <div ref={messagesEndRef} />
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row items-center h-16 rounded-xl bg-white w-full px-4">
                        <div className="flex-grow ml-4">
                            <div className="relative w-full">
                                <input
                                    type="text"
                                    value={userInput}
                                    onChange={(e) => setUserInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    disabled={isLoading}
                                    className="flex w-full border rounded-xl focus:outline-none focus:border-indigo-300 pl-4 h-10"
                                />
                            </div>
                        </div>
                        <div className="ml-4">
                            <button 
                                onClick={sendMessage} 
                                disabled={isLoading}
                                className="flex items-center justify-center bg-indigo-500 hover:bg-indigo-600 rounded-xl text-white px-4 py-2 flex-shrink-0 transition duration-300 ease-in-out shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span>Send</span>
                                <span className="ml-2">
                                    {/* Send Icon */}
                                    <svg className="w-4 h-4 transform rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                                    </svg>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Chatbot;