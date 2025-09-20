import { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Send, Mic, MicOff, Bot, User, BookOpen, AlertTriangle, MessageCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface InteractiveQAProps {
  userData: any;
  onBack: () => void;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  category?: 'safe' | 'warning' | 'risk' | 'neutral';
}

export const InteractiveQA = ({ userData, onBack }: InteractiveQAProps) => {
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: `Hello ${userData.name || 'there'}! I'm your AI legal assistant. I'm here to help you understand Indian law and answer your legal questions. How can I assist you today?`,
      timestamp: new Date(),
      category: 'safe'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const commonQuestions = [
    "What are my rights as a tenant in India?",
    "How to register a property in my state?",
    "What documents are needed for marriage registration?",
    "Consumer protection laws in India",
    "Employment rights and labor laws",
    "How to file a complaint in consumer court?"
  ];

  const simulateAIResponse = (question: string): { content: string; category: 'safe' | 'warning' | 'risk' | 'neutral' } => {
    const responses = [
      {
        content: "Based on Indian law, you have several important rights in this situation. Let me explain the key legal provisions that apply to your case. According to the relevant acts and regulations, you should be aware of the following protections and procedures.",
        category: 'safe' as const
      },
      {
        content: "This is an important legal matter that requires careful attention. There are specific timelines and procedures you must follow under Indian law. I recommend taking action within the prescribed time limits to protect your interests.",
        category: 'warning' as const
      },
      {
        content: "This situation involves significant legal risks that need immediate attention. I strongly recommend consulting with a qualified lawyer who specializes in this area of law. The legal implications could be serious if not handled properly.",
        category: 'risk' as const
      },
      {
        content: "This is a common legal question in India. The law provides specific guidelines for this situation. Let me break down the key points you need to understand, including the applicable legal provisions and your options moving forward.",
        category: 'neutral' as const
      }
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate AI processing
    setTimeout(() => {
      const aiResponse = simulateAIResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        category: aiResponse.category
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 2000);
  };

  const handleVoiceToggle = () => {
    if (!isListening) {
      // Start voice recognition
      setIsListening(true);
      toast({
        title: "Voice Recording Started",
        description: "Speak your question clearly. Tap the microphone again to stop.",
      });
      
      // Simulate voice recognition
      setTimeout(() => {
        setIsListening(false);
        setInputValue("What are the legal requirements for starting a business in India?");
        toast({
          title: "Voice Recognized",
          description: "Your question has been converted to text. You can edit it before sending.",
        });
      }, 3000);
    } else {
      setIsListening(false);
      toast({
        title: "Voice Recording Stopped",
        description: "Recording has been stopped.",
      });
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInputValue(question);
  };

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const getCategoryColor = (category?: string) => {
    switch (category) {
      case 'safe': return 'bg-safe-bg text-safe border-safe';
      case 'warning': return 'bg-warning-bg text-warning border-warning';
      case 'risk': return 'bg-risk-bg text-risk border-risk';
      default: return 'bg-neutral-bg text-neutral border-neutral';
    }
  };

  return (
    <div className="min-h-screen bg-primary flex flex-col">
      {/* Header */}
      <header className="bg-primary border-b border-primary-foreground/20 flex-shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Button 
              variant="ghost" 
              onClick={onBack}
              className="text-primary-foreground hover:bg-primary-foreground/10 mr-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center">
              <MessageCircle className="h-6 w-6 text-primary-foreground mr-2" />
              <h1 className="text-xl font-bold text-primary-foreground">Interactive Q&A</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        <div className="grid lg:grid-cols-4 gap-6 flex-1">
          {/* Chat Area */}
          <div className="lg:col-span-3 flex flex-col">
            <Card className="card-shadow flex-1 flex flex-col">
              <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  AI Legal Assistant
                </CardTitle>
                <CardDescription>
                  Ask questions about Indian law in your preferred language
                </CardDescription>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg p-4 ${
                            message.type === 'user'
                              ? 'bg-primary text-primary-foreground'
                              : `bg-card border ${message.category ? getCategoryColor(message.category) : ''}`
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {message.type === 'assistant' && (
                              <Bot className="h-4 w-4 mt-1 flex-shrink-0" />
                            )}
                            {message.type === 'user' && (
                              <User className="h-4 w-4 mt-1 flex-shrink-0" />
                            )}
                            <div className="flex-1">
                              <p className="body-text">{message.content}</p>
                              <p className="text-xs opacity-70 mt-2">
                                {message.timestamp.toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-card border rounded-lg p-4 max-w-[80%]">
                          <div className="flex items-center gap-2">
                            <Bot className="h-4 w-4" />
                            <div className="flex space-x-1">
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
                
                {/* Input Area */}
                <div className="p-6 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask your legal question..."
                      onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleVoiceToggle}
                      variant={isListening ? "destructive" : "outline"}
                      size="icon"
                    >
                      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                    </Button>
                    <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Questions */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Common Questions</CardTitle>
                <CardDescription>Click to ask quickly</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                {commonQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="ghost"
                    className="w-full text-left justify-start h-auto p-3 text-wrap"
                    onClick={() => handleQuickQuestion(question)}
                  >
                    <BookOpen className="h-4 w-4 mr-2 flex-shrink-0" />
                    <span className="body-text text-sm">{question}</span>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Risk Legend */}
            <Card className="card-shadow">
              <CardHeader>
                <CardTitle className="text-lg">Response Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-safe-bg text-safe border-safe">Safe</Badge>
                  <span className="body-text text-xs">Low risk information</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-warning-bg text-warning border-warning">Attention</Badge>
                  <span className="body-text text-xs">Requires attention</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-risk-bg text-risk border-risk">High Risk</Badge>
                  <span className="body-text text-xs">Needs legal counsel</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-neutral-bg text-neutral border-neutral">Neutral</Badge>
                  <span className="body-text text-xs">General information</span>
                </div>
              </CardContent>
            </Card>

            {/* Disclaimer */}
            <Card className="card-shadow border-warning/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-warning text-lg">
                  <AlertTriangle className="h-5 w-5" />
                  Legal Notice
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="legal-disclaimer">
                  AI responses are for informational purposes only. For specific legal matters, 
                  consult with a qualified attorney licensed to practice in your jurisdiction.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};