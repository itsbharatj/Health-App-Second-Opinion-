
import { useState, useEffect, useRef } from 'react';
import { FiSend, FiPaperclip, FiMapPin } from 'react-icons/fi';
import { geminiService } from '../services/gemini';
import { storage } from '../services/storage';
import Markdown from '../components/Markdown';

interface Message {
  id: number;
  text: string;
  sender: 'ai' | 'me';
}

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI health companion. I'm here to help you understand your health better and answer any questions you have. I have access to your health data, medical documents, and daily activities. How are you feeling today?", sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { id: Date.now(), text: input, sender: 'me' };
    setMessages([...messages, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const healthData = storage.getHealthData();
      const userProfile = storage.getUserProfile();
      const documents = storage.getDocuments();
      const meals = storage.getMeals();
      const journalEntries = storage.getJournalEntries();

      const documentSummaries = documents
        .filter(doc => doc.summary)
        .map(doc => `${doc.name} (${doc.date}): ${doc.summary}`);

      const recentMeals = meals.slice(-3).map(meal => 
        `${meal.name} - ${meal.calories} cal (P:${meal.protein}g, C:${meal.carbs}g, F:${meal.fats}g)`
      );

      const recentJournal = journalEntries.slice(-2).map(entry =>
        `${entry.date}: Mood ${entry.mood}, ${entry.activities}, Sleep ${entry.sleep}h`
      );

      console.log('Sending message to Gemini:', userInput);
      console.log('Health Data:', healthData);
      console.log('User Profile:', userProfile);
      console.log('Documents:', documentSummaries);
      console.log('Recent Meals:', recentMeals);
      console.log('Recent Journal:', recentJournal);

      const contextData = {
        ...healthData,
        recentMeals: recentMeals.join('; '),
        recentJournal: recentJournal.join('; ')
      };

      const aiResponseText = await geminiService.chat(userInput, {
        healthData: contextData,
        userProfile,
        documents: documentSummaries
      });

      console.log('Received AI response:', aiResponseText);

      const aiResponse: Message = {
        id: Date.now() + 1,
        text: aiResponseText,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: `I apologize, but I'm having trouble connecting. Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please check your internet connection and make sure your API key is set up correctly.`,
        sender: 'ai',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <div className="flex items-center justify-between p-4 bg-white border-b">
        <button onClick={() => window.history.back()}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="text-center">
          <h1 className="text-lg font-semibold text-gray-800">AI Health Assistant</h1>
          <p className="text-sm text-gray-500">Always here to help</p>
        </div>
        <button>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex justify-center mb-4">
          <div className="bg-green-200 text-green-800 text-sm py-1 px-3 rounded-full">
            Today
          </div>
        </div>
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.sender === 'me' ? 'justify-end' : 'justify-start'} mb-4`}>
            {message.sender === 'ai' && (
              <div className="w-8 h-8 rounded-full mr-3 bg-green-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                AI
              </div>
            )}
            <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${message.sender === 'me' ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}>
              {message.sender === 'ai' ? (
                <Markdown content={message.text} />
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start mb-4">
            <div className="w-8 h-8 rounded-full mr-3 bg-green-500 flex items-center justify-center text-white font-bold">
              AI
            </div>
            <div className="bg-white text-gray-800 px-4 py-2 rounded-2xl">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 bg-white border-t flex items-center">
        <button className="mr-3 text-gray-500">
          <FiPaperclip size={24} />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Type message..."
          className="flex-1 bg-gray-100 rounded-full py-2 px-4 focus:outline-none text-gray-800"
        />
        <button className="ml-3 text-gray-500">
          <FiMapPin size={24} />
        </button>
        <button onClick={handleSend} className="ml-3 text-white bg-black rounded-full p-2 hover:bg-gray-800">
          <FiSend size={20} />
        </button>
      </div>
    </div>
  );
};

export default Chat;
