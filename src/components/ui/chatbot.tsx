'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from './button';
import { Card } from './card';
import { Input } from './input';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { cn } from '@/lib/utils';
import { useChatbot } from '@/components/providers/chatbot-provider';
import { 
  MessageCircle, 
  X, 
  Send, 
  Bot, 
  User, 
  Minimize2,
  Maximize2,
  Sparkles,
  Zap,
  FileText,
  Star,
  Lightbulb,
  Target,
  TrendingUp,
  Clock,
  ArrowLeft
} from 'lucide-react';

interface ChatbotProps {
  className?: string;
}

const QUICK_ACTIONS = [
  { icon: FileText, text: "Analyze my resume", query: "Can you help me analyze my resume?" },
  { icon: Star, text: "Best practices", query: "What are the best resume practices?" },
  { icon: Lightbulb, text: "Improve sections", query: "How can I improve different sections of my resume?" },
  { icon: Target, text: "ATS optimization", query: "How do I optimize my resume for ATS?" },
  { icon: TrendingUp, text: "Career tips", query: "Give me some career advancement tips" },
];

export function Chatbot({ className }: ChatbotProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { 
    conversations,
    currentConversationId,
    currentMessages,
    addMessage, 
    startNewConversation,
    selectConversation,
    isTyping, 
    setIsTyping, 
    unreadCount, 
    markAsRead,
    showConversationList,
    setShowConversationList,
    isLoading,
    refreshConversations,
    setCurrentConversationId
  } = useChatbot();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages]);

  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
      markAsRead();
    }
  }, [isOpen, isMinimized, markAsRead]);

  const handleSendMessage = async (messageText?: string) => {
    const text = messageText || inputValue;
    if (!text.trim()) return;

    setInputValue('');
    setIsTyping(true);

    try {
      await addMessage({
        content: text,
        sender: 'user',
      });
    } catch (error) {
      console.error('Chatbot error:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setIsMinimized(false);
    if (!isOpen) {
      markAsRead();
    }
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
    if (!isMinimized) {
      markAsRead();
    }
  };

  const handleQuickAction = (query: string) => {
    if (showConversationList) {
      setCurrentConversationId(null);
      setShowConversationList(false);
    }
    handleSendMessage(query);
  };

  const formatMessage = (content: string) => {
    return content.split('\n').map((line, index) => (
      <span key={index}>
        {line}
        {index < content.split('\n').length - 1 && <br />}
      </span>
    ));
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className={cn("fixed bottom-6 right-6 z-50", className)}>
      {/* Chat Window */}
      {isOpen && (
        <Card className={cn(
          "mb-4 w-96 shadow-2xl border-0 bg-white/95 backdrop-blur-sm transition-all duration-300 transform",
          isMinimized ? "h-16" : "h-[600px]"
        )} data-chatbot-window>
          {/* Header */}
          <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Resume Assistant</h3>
                <p className="text-xs text-white/80">
                  {isTyping ? 'Thinking...' : 'Always here to help'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!showConversationList && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConversationList(true)}
                  className="h-8 w-8 text-white hover:bg-white/20"
                  title="Back to conversations"
                >
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMinimize}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleChat}
                className="h-8 w-8 text-white hover:bg-white/20"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {!isMinimized && (
            <div className="flex flex-col h-[536px]">
              {showConversationList ? (
                /* Conversation List */
                <>
                  <div className="flex-shrink-0 p-4 pb-2">
                    <div className="text-center">
                      <h4 className="font-medium text-gray-800 mb-2">Resume Assistant</h4>
                      <p className="text-sm text-gray-600 mb-4">How can I help you with your resume today?</p>
                    </div>
                  </div>
                  
                  <ScrollArea className="flex-1 px-4 chatbot-scroll">
                    <div className="space-y-4 pb-4">
                      {/* Quick Actions */}
                      <div className="space-y-2">
                        <p className="text-xs text-gray-500 px-2">Quick actions:</p>
                        <div className="grid grid-cols-1 gap-2">
                          {QUICK_ACTIONS.map((action, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickAction(action.query)}
                              className="justify-start gap-2 h-auto py-3 text-left hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 hover:scale-[1.02]"
                            >
                              <action.icon className="w-4 h-4 text-orange-500" />
                              <span className="text-sm">{action.text}</span>
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Previous Conversations */}
                      {conversations.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-xs text-gray-500 px-2">Previous conversations:</p>
                          {isLoading ? (
                            <div className="text-center py-4 text-gray-500">
                              <div className="w-6 h-6 mx-auto mb-2 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
                              <p className="text-xs">Loading...</p>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {conversations.slice(0, 3).map((conversation) => (
                                <div
                                  key={conversation.id}
                                  onClick={() => selectConversation(conversation.id)}
                                  className="p-3 rounded-lg border border-gray-200 hover:border-orange-200 hover:bg-orange-50 cursor-pointer transition-all duration-200 group"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1 min-w-0">
                                      <h5 className="font-medium text-sm text-gray-800 truncate group-hover:text-orange-600">
                                        {conversation.title}
                                      </h5>
                                      <div className="flex items-center gap-1 mt-1">
                                        <Clock className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500">
                                          {formatDate(conversation.updatedAt)}
                                        </span>
                                      </div>
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {conversation.messages.length}
                                    </Badge>
                                  </div>
                                </div>
                              ))}
                              {conversations.length > 3 && (
                                <div className="text-center py-2">
                                  <p className="text-xs text-gray-400">
                                    +{conversations.length - 3} more conversations
                                  </p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Text Input for Custom Questions - Anchored at bottom */}
                  <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
                    <div className="space-y-2">
                      <p className="text-xs text-gray-500">Or ask anything:</p>
                      <div className="flex gap-2">
                        <Input
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Ask me anything about resumes..."
                          className="flex-1 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                          disabled={isTyping}
                        />
                        <Button
                          onClick={() => handleSendMessage()}
                          disabled={!inputValue.trim() || isTyping}
                          size="icon"
                          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Messages */}
                  <ScrollArea className="flex-1 p-4 chatbot-scroll">
                    <div className="space-y-4">
                      {currentMessages.map((message, index) => (
                        <div
                          key={message.id}
                          className={cn(
                            "flex gap-3 max-w-[85%] message-enter",
                            message.sender === 'user' ? "ml-auto flex-row-reverse" : ""
                          )}
                          style={{ animationDelay: `${index * 50}ms` }}
                        >
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm",
                            message.sender === 'user' 
                              ? "bg-gradient-to-r from-orange-500 to-red-500 text-white" 
                              : "bg-gray-100 text-gray-600"
                          )}>
                            {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                          </div>
                          <div className="flex flex-col gap-1">
                            <div className={cn(
                              "rounded-2xl px-4 py-2 text-sm shadow-sm",
                              message.sender === 'user'
                                ? "bg-gradient-to-r from-orange-500 to-red-500 text-white"
                                : "bg-gray-100 text-gray-800"
                            )}>
                              {formatMessage(message.content)}
                            </div>
                            <span className="text-xs text-gray-400 px-2">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        </div>
                      ))}
                      
                      {isTyping && (
                        <div className="flex gap-3 max-w-[85%] message-enter">
                          <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div className="bg-gray-100 rounded-2xl px-4 py-2 shadow-sm">
                            <div className="flex items-center gap-2">
                              <div className="flex gap-1">
                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                                <div className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                              </div>
                              <span className="text-xs text-gray-500 ml-1">Thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Quick Actions */}
                      {!currentConversationId && currentMessages.length === 1 && (
                        <div className="space-y-2 message-enter" style={{ animationDelay: '300ms' }}>
                          <p className="text-xs text-gray-500 px-2">Quick actions:</p>
                          <div className="grid grid-cols-1 gap-2">
                            {QUICK_ACTIONS.map((action, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickAction(action.query)}
                                className="justify-start gap-2 h-auto py-2 text-left hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 hover:scale-[1.02]"
                                style={{ animationDelay: `${400 + index * 100}ms` }}
                              >
                                <action.icon className="w-4 h-4 text-orange-500" />
                                <span className="text-sm">{action.text}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <div ref={messagesEndRef} />
                  </ScrollArea>

                  {/* Input - Anchored at bottom */}
                  <div className="flex-shrink-0 p-4 bg-white border-t border-gray-100">
                    <div className="flex gap-2">
                      <Input
                        ref={inputRef}
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about resumes..."
                        className="flex-1 border-gray-200 focus:border-orange-500 focus:ring-orange-500 transition-all duration-200"
                        disabled={isTyping}
                      />
                      <Button
                        onClick={() => handleSendMessage()}
                        disabled={!inputValue.trim() || isTyping}
                        size="icon"
                        className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-200 hover:scale-105"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </Card>
      )}

      {/* Floating Action Button */}
      <Button
        onClick={toggleChat}
        className={cn(
          "w-14 h-14 rounded-full shadow-2xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-110 group relative overflow-hidden chatbot-float chatbot-glow",
          isOpen && "rotate-180"
        )}
        size="icon"
      >
        {/* Animated background effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300 chatbot-shimmer" />
        
        {/* Sparkle effects */}
        <Sparkles className="absolute top-1 right-1 w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" />
        <Zap className="absolute bottom-1 left-1 w-3 h-3 text-yellow-300 opacity-0 group-hover:opacity-100 transition-all duration-300 animate-pulse" style={{ animationDelay: '150ms' }} />
        
        {/* Main icon */}
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-300" />
        ) : (
          <MessageCircle className="w-6 h-6 transition-transform duration-300" />
        )}
        
        {/* Notification badge */}
        {!isOpen && unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold text-white animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </div>
        )}
        
        {/* Pulse animation for new messages */}
        {!isOpen && unreadCount > 0 && (
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-20" />
        )}
      </Button>
    </div>
  );
} 