// Conversation Service for Botpress Chat Integration
let conversations = [];
let messages = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const conversationService = {
  async startConversation(conversationId) {
    await delay(100);
    const newConversation = {
      Id: conversations.length + 1,
      conversationId,
      startTime: new Date().toISOString(),
      endTime: null,
      leadCreated: false,
      leadId: null,
      status: 'active'
    };
    conversations.push(newConversation);
    return { ...newConversation };
  },

  async endConversation(conversationId) {
    await delay(100);
    const conversation = conversations.find(c => c.conversationId === conversationId);
    if (conversation) {
      conversation.endTime = new Date().toISOString();
      conversation.status = 'completed';
    }
    return conversation;
  },

  async saveMessage(messageData) {
    await delay(50);
    const newMessage = {
      Id: messages.length + 1,
      ...messageData,
      timestamp: messageData.timestamp || new Date().toISOString()
    };
    messages.push(newMessage);
    return { ...newMessage };
  },

  async getConversation(conversationId) {
    await delay(100);
    const conversation = conversations.find(c => c.conversationId === conversationId);
    if (!conversation) return null;

    const conversationMessages = messages.filter(m => m.conversationId === conversationId);
    return {
      ...conversation,
      messages: conversationMessages
    };
  },

  async getAllConversations() {
    await delay(200);
    return conversations.map(c => ({ ...c }));
  },

  async getConversationsByLeadId(leadId) {
    await delay(150);
    return conversations.filter(c => c.leadId === parseInt(leadId)).map(c => ({ ...c }));
  },

  async linkConversationToLead(conversationId, leadId) {
    await delay(100);
    const conversation = conversations.find(c => c.conversationId === conversationId);
    if (conversation) {
      conversation.leadId = parseInt(leadId);
      conversation.leadCreated = true;
    }
    return conversation;
  },

  async getConversationSummary(conversationId) {
    await delay(200);
    const conversation = await this.getConversation(conversationId);
    if (!conversation) return null;

    const messageCount = conversation.messages.length;
    const userMessages = conversation.messages.filter(m => m.userId !== 'bot');
    const botMessages = conversation.messages.filter(m => m.userId === 'bot');

    return {
      conversationId,
      totalMessages: messageCount,
      userMessages: userMessages.length,
      botMessages: botMessages.length,
      duration: conversation.endTime ? 
        new Date(conversation.endTime) - new Date(conversation.startTime) : 
        Date.now() - new Date(conversation.startTime),
      leadCreated: conversation.leadCreated,
      leadId: conversation.leadId
    };
  }
};