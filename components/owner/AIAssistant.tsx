'use client';

import { useState, useRef, useEffect } from 'react';
import { useApp } from '../../lib/store-context';
import type { ChatMessage } from '../../lib/types';

export default function AIAssistant() {
  const { chatMessages, addChatMessage, clearChat, ownerInventory, reservations } = useApp();
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [chatMessages, isTyping]);

  const handleSend = (text: string) => {
    if (!text.trim()) return;
    
    // Add user message
    addChatMessage({ id: `msg-${Date.now()}`, role: 'user', text, ts: Date.now() });
    setInput('');
    setIsTyping(true);

    // Mock AI Response Logic based on user's query
    setTimeout(() => {
      let response = "I'm not sure about that. Try asking about sales, stock, or revenue.";
      const lowerQ = text.toLowerCase();

      if (lowerQ.includes('low') && lowerQ.includes('stock')) {
        const low = ownerInventory.filter(p => p.stock <= (p.minThreshold || 10));
        response = `You have ${low.length} items running low on stock. ` + 
          (low.length > 0 ? `I'd recommend restocking ${low[0].name} soon, you only have ${low[0].stock} left.` : '');
      } else if (lowerQ.includes('best') || lowerQ.includes('top')) {
        response = "Based on this month's data, 'Classmate Notebook A4' is your best seller with 340 units sold.";
      } else if (lowerQ.includes('revenue') || lowerQ.includes('sales')) {
        response = "Your total revenue for this month is ₹84,320. That's up 12.4% compared to last month!";
      } else if (lowerQ.includes('margin') || lowerQ.includes('profit')) {
        response = "Your average profit margin is sitting at 38.5%. 'Scientific Calculator Casio fx-82MS' has the highest margin at 45%.";
      } else if (lowerQ.includes('restock') && lowerQ.includes('notebook')) {
        response = "Based on current sales velocity (about 12/day), your stock of 45 'Classmate Notebook A4' will run out in about 4 days. You should order more today.";
      } else if (lowerQ.includes('drop') || lowerQ.includes('why')) {
        response = "I noticed a slight drop in sales on Tuesday. This correlates with heavy rainfall in your area between 1 PM and 5 PM, leading to lower foot traffic.";
      } else if (lowerQ.includes('promote') || lowerQ.includes('offer')) {
        response = "You have a lot of 'A4 Paper Reams' (100 units). Setting up a 'Back to College' 10% discount could help move this inventory quickly.";
      }

      addChatMessage({ id: `msg-${Date.now() + 1}`, role: 'assistant', text: response, ts: Date.now() });
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div className="o-section active" style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 60px)', paddingBottom: 20 }}>
      <div className="o-header-row" style={{ marginBottom: 16 }}>
        <div>
          <h2 className="o-title" style={{ marginBottom: 4 }}>AI Business Assistant</h2>
          <p className="o-desc" style={{ marginBottom: 0 }}>Ask me anything about your shop's performance, inventory, or customers.</p>
        </div>
        {chatMessages.length > 0 && (
          <button className="btn-owner-outline" onClick={clearChat}>CLEAR CHAT</button>
        )}
      </div>

      <div className="chat-container">
        <div className="chat-history" ref={scrollRef}>
          {chatMessages.length === 0 ? (
            <div className="chat-empty-state">
              <div className="ce-icon">🤖</div>
              <h3>I'm your Nearbuy AI Assistant</h3>
              <p>I analyze your store's data to give you actionable insights.</p>
              
              <div className="chat-suggestions">
                {[
                  "Which products are running low?",
                  "What is my revenue this month?",
                  "When should I restock notebooks?",
                  "Which products should I promote?",
                ].map(q => (
                  <button key={q} className="sug-pill" onClick={() => handleSend(q)}>{q}</button>
                ))}
              </div>
            </div>
          ) : (
            <div className="chat-messages">
              {chatMessages.map(msg => (
                <div key={msg.id} className={`chat-bubble ${msg.role}`}>
                  {msg.role === 'assistant' && <div className="cb-avatar">🤖</div>}
                  <div className="cb-text">{msg.text}</div>
                </div>
              ))}
              {isTyping && (
                <div className="chat-bubble assistant">
                  <div className="cb-avatar">🤖</div>
                  <div className="cb-text typing-indicator"><span>.</span><span>.</span><span>.</span></div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="chat-input-area">
          <input 
            type="text" 
            className="chat-inp" 
            placeholder="Ask about your sales, stock, or revenue..." 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          />
          <button 
            className="chat-send-btn" 
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
          >
            SEND
          </button>
        </div>
      </div>
    </div>
  );
}
