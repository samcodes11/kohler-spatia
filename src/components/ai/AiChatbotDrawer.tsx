import React, { useState, useRef, useEffect } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { PRODUCTS, PRODUCT_MAP, ProductItem } from '../../data/products';
import { THEMES } from '../../data/themes';
import { Sparkles, Send, X, Bot, User, ArrowRight } from 'lucide-react';
import { useCartWishlist } from '../../context/CartWishlistContext';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  suggestedAction?: {
    label: string;
    action: () => void;
  };
  productRecommendations?: ProductItem[];
}

export const AiChatbotDrawer: React.FC = () => {
  const { 
    selectedTheme, 
    width, 
    length, 
    unit, 
    budget, 
    selections, 
    setSingleSelection, 
    setSelectedTheme 
  } = useConfigurator();

  const { addToCart } = useCartWishlist();

  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `Greetings. I am your Kohler Spatia architectural design advisor. I am currently monitoring your ${width}×${length} ${unit} space styled in ${THEMES[selectedTheme].name}. How can I assist your layout, hydraulic plumbing, or finish coordination today?`,
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const quickPrompts = [
    "Will a double-basin vanity fit my dimensions?",
    "Suggest optimal fixtures for Luxury Escape",
    "How can I cut ₹50,000 without losing aesthetics?",
    "Compare Steam Shower Cabin vs Rain Panel"
  ];

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      const reply = generateIntelligentResponse(query);
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
    }, 1200);
  };

  const generateIntelligentResponse = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const currentThemeDef = THEMES[selectedTheme];
    const roomArea = unit === 'ft' ? (width * length) : (width * length * 10.764);

    // 1. Double vanity space inquiry
    if (q.includes('double vanity') || q.includes('double-basin') || q.includes('two sink')) {
      if (roomArea < 50 || width < 8) {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Given your room's footprint (${width}×${length} ${unit}, approximately ${Math.round(roomArea)} sq ft), installing the 1600mm Double-Basin Vanity (₹72,000) will restrict standard passage clearance to under 650mm. Instead, I advise the Floating Vanity (₹38,000) paired with an extended LED Backlit Mirror to preserve expansive sightlines.`,
          timestamp: 'Just now',
          productRecommendations: [PRODUCT_MAP['vanity-floating'], PRODUCT_MAP['extra-mirror']]
        };
      } else {
        return {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: `Your ${width}×${length} ${unit} room comfortably accommodates the 1600mm Double-Basin Vanity (₹72,000). It requires at least 900mm front clearance, which your current floor plan readily permits.`,
          timestamp: 'Just now',
          productRecommendations: [PRODUCT_MAP['vanity-doublebasin']]
        };
      }
    }

    // 2. Steam Shower vs Rain Panel comparison
    if (q.includes('steam') || q.includes('rain panel') || q.includes('compare shower')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `The Steam Shower Cabin (₹1,85,000, 4.5kW) is an enclosed thermal sanctuary engineered for onsen-grade hydrotherapy requiring dedicated 10mm acoustic safety glazing and 230V rough-in. In contrast, the Rain Panel (₹58,000) is a flush ceiling installation that preserves an open walk-in wet area with 14L/min rainfall dispersion.`,
        timestamp: 'Just now',
        productRecommendations: [PRODUCT_MAP['shower-steam'], PRODUCT_MAP['shower-rainpanel']]
      };
    }

    // 3. Cut budget / cheaper alternatives
    if (q.includes('cut') || q.includes('cheaper') || q.includes('reduce') || q.includes('budget') || q.includes('save money')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `To calibrate within your budget of ₹${budget.toLocaleString('en-IN')}: switching from the Smart Commode (₹1,10,000) to the Wall-Hung Commode (₹48,000) immediately conserves ₹62,000 while maintaining a cantilevered architectural aesthetic. Would you like me to apply this substitution?`,
        timestamp: 'Just now',
        suggestedAction: {
          label: 'Switch to Wall-Hung Commode',
          action: () => setSingleSelection('toilet', 'toilet-wallhung')
        },
        productRecommendations: [PRODUCT_MAP['toilet-wallhung']]
      };
    }

    // 4. Luxury Escape styling
    if (q.includes('classic') || q.includes('luxury escape') || q.includes('french gold') || q.includes('bronze')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `Luxury Escape flourishes when anchored by warm bullion metallics. The Bridge Faucet in Vibrant French Gold (₹42,000) paired with Calacatta Gold Honed Marble (₹52,000) creates heirloom permanence. I can apply the Luxury Escape finish palette to your workspace now.`,
        timestamp: 'Just now',
        suggestedAction: {
          label: 'Switch to Luxury Escape Theme',
          action: () => setSelectedTheme('luxury-escape')
        },
        productRecommendations: [PRODUCT_MAP['faucet-bridge'], PRODUCT_MAP['floor-marble']]
      };
    }

    // 5. Nature Retreat inquiry
    if (q.includes('zen') || q.includes('nature retreat') || q.includes('black') || q.includes('titanium')) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: `For Nature Retreat tranquility, we pair Thermal Basalt Stone (₹34,000) with in-wall Matte Black Mixers (₹28,000) and indirect 2700K Cove Lighting (₹15,000). This removes visual clutter from horizontal vanity planes.`,
        timestamp: 'Just now',
        suggestedAction: {
          label: 'Switch to Nature Retreat Theme',
          action: () => setSelectedTheme('nature-retreat')
        },
        productRecommendations: [PRODUCT_MAP['faucet-wallmount'], PRODUCT_MAP['light-cove']]
      };
    }

    // Default intelligent contextual response
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: `Reflecting on your ${width}×${length} ${unit} layout in ${currentThemeDef.name}: your selected ${PRODUCT_MAP[selections.faucet]?.name || 'faucet'} harmonizes with the ${PRODUCT_MAP[selections.flooring]?.name || 'flooring'}. All hydraulic rough-in points comply with Kohler's global architectural engineering standards. Would you like me to optimize lighting placement or calculate exact water flow rates?`,
      timestamp: 'Just now',
      productRecommendations: [
        PRODUCT_MAP[selections.faucet],
        PRODUCT_MAP[selections.shower]
      ].filter(Boolean) as ProductItem[]
    };
  };

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-3 px-4 py-3 bg-ink text-porcelain shadow-luxury hover:bg-ink-muted border border-accent/40 transition-all duration-300 group rounded-full"
        aria-label="Ask the AI Designer"
      >
        <div className="relative">
          <Sparkles size={18} className="text-accent animate-pulse" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full"></span>
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-xs font-mono uppercase tracking-wider text-accent font-bold leading-none">AI Advisor</div>
          <div className="text-sm font-serif text-white tracking-wide font-bold mt-0.5">Ask the Designer</div>
        </div>
      </button>

      {/* Chat Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-ink/50 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-lg bg-porcelain h-full shadow-2xl flex flex-col border-l border-stone/20 animate-slide-left relative">
            {/* Header */}
            <div className="p-5 border-b border-stone/20 bg-porcelain-warm/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-ink text-accent flex items-center justify-center border border-accent/30 shadow-sm">
                  <Bot size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif text-xl font-bold text-ink">Ask the Designer</h3>
                    <span className="inline-block w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  </div>
                  <p className="text-xs font-mono font-medium text-stone-dark">
                    Backed by 25-item Kohler Spatia Catalog Engine
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-stone hover:text-ink transition-colors"
                aria-label="Close chat"
              >
                <X size={22} />
              </button>
            </div>

            {/* In-Progress Room Bar Context Indicator */}
            <div className="px-5 py-2.5 bg-porcelain border-b border-stone/20 text-xs font-mono font-semibold text-stone-dark flex items-center justify-between">
              <span>Room: {width}×{length} {unit} ({THEMES[selectedTheme].name})</span>
              <span className="text-accent font-bold">Budget: ₹{budget.toLocaleString('en-IN')}</span>
            </div>

            {/* Message Thread */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map(msg => (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'ai' && (
                    <div className="w-8 h-8 rounded-full bg-ink text-accent flex items-center justify-center shrink-0 mt-1">
                      <Sparkles size={14} />
                    </div>
                  )}
                  <div className={`max-w-[85%] rounded-sm p-4 text-sm font-medium leading-relaxed ${
                    msg.sender === 'user' 
                      ? 'bg-ink text-white' 
                      : 'bg-white border border-stone/20 text-ink shadow-sm'
                  }`}>
                    <p className="whitespace-pre-line">{msg.text}</p>

                    {/* Action button if suggested */}
                    {msg.suggestedAction && (
                      <button
                        onClick={() => {
                          msg.suggestedAction?.action();
                          setIsOpen(false);
                        }}
                        className="mt-3 flex items-center gap-2 px-3.5 py-2 bg-accent/15 hover:bg-accent/25 text-accent font-mono text-xs rounded-sm transition-colors border border-accent/40 font-bold"
                      >
                        <span>{msg.suggestedAction.label}</span>
                        <ArrowRight size={13} />
                      </button>
                    )}

                    {/* Inline product recommendations */}
                    {msg.productRecommendations && msg.productRecommendations.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone/20 space-y-2">
                        <span className="text-xs font-mono uppercase font-bold tracking-wider text-stone-dark block">Referenced Product:</span>
                        {msg.productRecommendations.map(prod => (
                          <div key={prod.id} className="flex items-center justify-between p-2.5 bg-porcelain-warm rounded-sm border border-stone/20">
                            <div>
                              <div className="font-bold text-ink text-xs">{prod.name}</div>
                              <div className="text-xs font-mono font-medium text-stone-dark">₹{prod.price.toLocaleString('en-IN')} · {prod.finishName}</div>
                            </div>
                            <button
                              onClick={() => addToCart(prod.id)}
                              className="px-3 py-1 bg-ink text-white text-xs uppercase tracking-wider font-mono font-bold hover:bg-accent transition-colors"
                            >
                              Add
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-porcelain-warm border border-stone/30 text-stone-dark flex items-center justify-center shrink-0 mt-1">
                      <User size={14} />
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start items-center">
                  <div className="w-8 h-8 rounded-full bg-ink text-accent flex items-center justify-center shrink-0">
                    <Sparkles size={14} />
                  </div>
                  <div className="p-3.5 bg-white border border-stone/20 rounded-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce"></span>
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 bg-accent rounded-full animate-bounce [animation-delay:0.4s]"></span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompts */}
            <div className="px-5 py-3 bg-porcelain-warm/50 border-t border-stone/20 flex gap-2 overflow-x-auto">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 rounded-full bg-white border border-stone/30 text-xs font-medium text-stone-dark hover:text-ink hover:border-accent transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Form */}
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="p-4 bg-porcelain border-t border-stone/20 flex gap-2 items-center"
            >
              <input
                type="text"
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder="Ask about water flow, finish pairing, or dimensions..."
                className="flex-1 px-4 py-2.5 text-sm font-medium text-ink bg-white border border-stone/40 focus:border-accent focus:outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim()}
                className="p-3 bg-ink text-white hover:bg-accent disabled:opacity-40 transition-colors shrink-0"
                aria-label="Send message"
              >
                <Send size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
