import React, { useEffect, useState } from "react";
import SpeechRecognition, {
    useSpeechRecognition,
} from "react-speech-recognition";
import axios from "axios";
import { useSpeechSynthesis } from 'react-speech-kit';

const SpeechToTextConverter = () => {
    const [inputText, setInputText] = useState("");
    const [conversation, setConversation] = useState([]);
    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition,
    } = useSpeechRecognition();
	const { speak } = useSpeechSynthesis();
    const baseUrl = "http://127.0.0.1:8000";

    if (!browserSupportsSpeechRecognition) {
        return <span>Browser doesn't support speech recognition.</span>;
    }

    // Simulated response generator
    const generateResponse = async (msg) => {
        try {
            const response = await axios.post(`${baseUrl}/api/grok/`, {
                msg,
            });
            speak({text: response.data.data.text || "I'm sorry, I didn't understand that."} )
			
			return response.data.data.text || "I'm sorry, I didn't understand that.";
            
        } catch (error) {
            console.error("Error:", error.response?.data || error.message);
        }
    };

    useEffect(() => {
        if (!listening) {
            setInputText(transcript); // Set transcript text if not listening
        }
    }, [transcript, listening]);

    // Handler to send message
    const handleSendMessage =async() => {
        if (inputText.trim()) {
            // Add user message to the conversation
            const newMessage = { text: inputText, sender: "User" };
            setConversation((prev) => [...prev, newMessage]);

            // Generate and add the response
            const botResponse = await generateResponse(inputText);
            setTimeout(() => {
                setConversation((prev) => [
                    ...prev,
                    { text: botResponse, sender: "Bot" },
                ]);
            }, 1000); // 1 second delay to mimic a real chat response

            // Clear the input field
            setInputText("");
        }
    };

    return (
        <div className="flex items-center justify-center h-screen w-screen bg-gray-50">
            <div className="w-full max-w-3xl p-8 bg-white rounded-lg shadow-md">
                <h1 className="text-2xl font-bold text-center mb-2">
                    Speech to Text Converter
                </h1>
                <p className="text-center text-gray-600 mb-6">
                    Chat with the assistant by typing a message or using the
                    speech-to-text feature.
                </p>

                {/* Conversation Display Area */}
                <div className="border rounded-md p-4 mb-6 bg-gray-100 h-60 overflow-y-auto">
                    {conversation.map((message, index) => (
                        <p key={index} className="mb-2">
                            <strong>{message.sender}:</strong> {message.text}
                        </p>
                    ))}
                </div>

                {/* Text Input and Send Button */}

                <div className="flex mb-4">
                    <input
                        type="text"
                        value={inputText} // Control inputText state
                        onChange={(e) => setInputText(e.target.value)} // Update inputText when typing
                        className="flex-grow p-2 border rounded-l-md focus:outline-none"
                        placeholder="Type a message"
                    />{" "}
                    <button
                        onClick={handleSendMessage}
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                    >
                        Send
                    </button>
                </div>

                {/* Control Buttons for Speech-to-Text */}
                <div className="flex justify-center gap-2">
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={SpeechRecognition.startListening}
                    >
                        Start Listening
                    </button>
                    <button
                        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        onClick={SpeechRecognition.stopListening}
                    >
                        Stop Listening
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SpeechToTextConverter;
