import React, { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { conversationService } from "@/services/api/conversationService";
import { toast } from "react-toastify";

function BotpressChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [botLoaded, setBotLoaded] = useState(false);

useEffect(() => {
    // Initialize Botpress Web Chat when component mounts
    if (window.botpressWebChat) {
      initializeBot();
    } else {
      // Wait for Botpress script to load
      let attempts = 0;
      const maxAttempts = 100; // 10 seconds with 100ms intervals
      
      const checkBotpress = setInterval(() => {
        attempts++;
        if (window.botpressWebChat) {
          clearInterval(checkBotpress);
          initializeBot();
        } else if (attempts >= maxAttempts) {
          clearInterval(checkBotpress);
          console.warn("Botpress chat failed to load after 10 seconds");
          toast.error("Chat assistant failed to load. Please refresh the page.");
        }
      }, 100);

      // Cleanup function
      return () => clearInterval(checkBotpress);
    }
  }, []);

const initializeBot = async () => {
    try {
      // Validate Botpress environment configuration
      const requiredEnvVars = [
        'VITE_BOTPRESS_BOT_ID',
        'VITE_BOTPRESS_HOST_URL',
        'VITE_BOTPRESS_MESSAGING_URL',
        'VITE_BOTPRESS_CLIENT_ID'
      ];
      
      const missingVars = requiredEnvVars.filter(varName => !import.meta.env[varName]);
      
      if (missingVars.length > 0) {
        console.warn("Missing Botpress environment variables:", missingVars);
        toast.error("Chat assistant configuration incomplete");
        return;
      }

      // Verify Botpress API methods exist
      if (!window.botpressWebChat || typeof window.botpressWebChat.init !== 'function') {
        throw new Error("Botpress WebChat API is not properly loaded");
      }

      await window.botpressWebChat.init({
        botId: import.meta.env.VITE_BOTPRESS_BOT_ID,
        hostUrl: import.meta.env.VITE_BOTPRESS_HOST_URL,
        messagingUrl: import.meta.env.VITE_BOTPRESS_MESSAGING_URL,
        clientId: import.meta.env.VITE_BOTPRESS_CLIENT_ID,
        hideWidget: true, // We'll use custom UI
        disableAnimations: false,
        enableTranscriptDownload: false,
        className: 'botpress-chat-widget',
        containerWidth: '100%',
        layoutWidth: '100%'
      });

      setBotLoaded(true);

      // Listen for bot events if onEvent method exists
      if (typeof window.botpressWebChat.onEvent === 'function') {
        window.botpressWebChat.onEvent((event) => {
          handleBotEvent(event);
        });
      } else {
        console.warn("Botpress onEvent method not available");
      }

      toast.success("Chat assistant is ready!");
    } catch (error) {
      console.error("Failed to initialize Botpress:", error);
      toast.error("Failed to load chat assistant. Please check your configuration.");
      setBotLoaded(false);
    }
  };

  const handleBotEvent = async (event) => {
    try {
      switch (event.type) {
        case 'message':
          if (event.userId !== 'bot' && !isOpen) {
            setUnreadCount(prev => prev + 1);
          }
          
          // Save conversation to service
          await conversationService.saveMessage({
            conversationId: event.conversationId,
            message: event.message,
            userId: event.userId,
            timestamp: new Date().toISOString()
          });
          break;

        case 'conversation.started':
          toast.success("Chat conversation started");
          await conversationService.startConversation(event.conversationId);
          break;

        case 'conversation.ended':
          // Analyze conversation and potentially create lead
          await handleConversationEnd(event.conversationId);
          break;

        case 'webchat.opened':
          setIsOpen(true);
          setUnreadCount(0);
          break;

        case 'webchat.closed':
          setIsOpen(false);
          break;

        default:
          break;
      }
    } catch (error) {
      console.info(`apper_info: An error was received in bot event handling. The error is: ${error.message}`);
    }
  };

  const handleConversationEnd = async (conversationId) => {
    try {
      // Get conversation summary
      const conversation = await conversationService.getConversation(conversationId);
      
      if (conversation && conversation.messages.length > 2) {
        // Use Edge function to analyze conversation and potentially create lead
        const { ApperClient } = window.ApperSDK;
        const apperClient = new ApperClient({
          apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
          apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
        });

        const result = await apperClient.functions.invoke(
          import.meta.env.VITE_ANALYZE_CONVERSATION,
          {
            body: JSON.stringify({
              conversationId: conversationId,
              messages: conversation.messages
            }),
            headers: {
              'Content-Type': 'application/json'
            }
          }
        );

        if (result.success && result.data.leadCreated) {
          toast.success(`New lead created: ${result.data.leadName}`);
        }
      }
    } catch (error) {
      console.info(`apper_info: An error was received in conversation analysis. The error is: ${error.message}`);
    }
  };

const toggleChat = () => {
    if (!botLoaded) {
      toast.error("Chat assistant is still loading...");
      return;
    }

    // Verify Botpress API is available and has required methods
    if (!window.botpressWebChat) {
      toast.error("Chat assistant is not available");
      console.error("Botpress WebChat is not loaded");
      return;
    }

    try {
      if (isOpen) {
        if (typeof window.botpressWebChat.hide === 'function') {
          window.botpressWebChat.hide();
        } else {
          console.warn("Botpress hide method not available");
          setIsOpen(false); // Fallback to manual state management
        }
      } else {
        if (typeof window.botpressWebChat.show === 'function') {
          window.botpressWebChat.show();
        } else {
          console.warn("Botpress show method not available");
          setIsOpen(true); // Fallback to manual state management
        }
      }
    } catch (error) {
      console.error("Error toggling chat:", error);
      toast.error("Failed to toggle chat assistant");
    }
  };

  const minimizeChat = () => {
    setIsMinimized(!isMinimized);
  };

  if (!botLoaded) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg animate-pulse">
          <ApperIcon name="MessageCircle" size={24} className="text-white" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={toggleChat}
          className="relative w-14 h-14 rounded-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl transition-all duration-300 p-0 border-0"
          aria-label="Toggle chat assistant"
        >
          <ApperIcon 
            name={isOpen ? "X" : "MessageCircle"} 
            size={24} 
            className="text-white" 
          />
          {unreadCount > 0 && !isOpen && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Custom Chat Header Overlay (when chat is open) */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-80 z-40">
          <div className="bg-white rounded-t-lg shadow-lg border-b p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-full flex items-center justify-center">
                <ApperIcon name="Bot" size={16} className="text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sales Assistant</h3>
                <p className="text-xs text-green-600 flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Online
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                onClick={minimizeChat}
                variant="ghost"
                className="w-8 h-8 p-0 hover:bg-gray-100"
                aria-label="Minimize chat"
              >
                <ApperIcon name="Minus" size={16} />
              </Button>
              <Button
                onClick={toggleChat}
                variant="ghost"
                className="w-8 h-8 p-0 hover:bg-gray-100"
                aria-label="Close chat"
              >
                <ApperIcon name="X" size={16} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default BotpressChat;