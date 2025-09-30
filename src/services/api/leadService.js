import mockLeads from "@/services/mockData/leads.json";

let leads = [...mockLeads];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const leadService = {
  async getAll() {
    await delay(300);
    return [...leads];
  },

  async getById(id) {
    await delay(200);
    const lead = leads.find(l => l.Id === parseInt(id));
    if (!lead) throw new Error("Lead not found");
    return { ...lead };
  },

async create(leadData) {
    await delay(400);
    const newLead = {
      ...leadData,
      Id: Math.max(...leads.map(l => l.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastContact: null,
      source: leadData.source || 'Manual',
      conversationId: leadData.conversationId || null,
      botGenerated: leadData.botGenerated || false,
      chatSummary: leadData.chatSummary || null
    };
    leads.push(newLead);
    return { ...newLead };
  },

  async createFromConversation(conversationData) {
    await delay(400);
    const { messages, conversationId, extractedInfo } = conversationData;
    
    const newLead = {
      name: extractedInfo.name || 'Chat Lead',
      email: extractedInfo.email || null,
      phone: extractedInfo.phone || null,
      company: extractedInfo.company || null,
      status: extractedInfo.qualified ? 'Qualified' : 'New',
      source: 'Chat Bot',
      value: extractedInfo.estimatedValue || 0,
      notes: extractedInfo.summary || 'Lead generated from chat conversation',
      Id: Math.max(...leads.map(l => l.Id)) + 1,
      createdAt: new Date().toISOString(),
      lastContact: new Date().toISOString(),
      conversationId: conversationId,
      botGenerated: true,
      chatSummary: extractedInfo.summary
    };
    
    leads.push(newLead);
    return { ...newLead };
  },

async update(id, leadData) {
    await delay(350);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    leads[index] = {
      ...leads[index],
      ...leadData,
      Id: parseInt(id),
      lastContact: leadData.updateLastContact ? new Date().toISOString() : leads[index].lastContact
    };
    return { ...leads[index] };
  },

  async updateFromBotInteraction(id, interactionData) {
    await delay(300);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const updatedNotes = leads[index].notes 
      ? `${leads[index].notes}\n\nBot Interaction: ${interactionData.summary}`
      : `Bot Interaction: ${interactionData.summary}`;
    
    leads[index] = {
      ...leads[index],
      notes: updatedNotes,
      lastContact: new Date().toISOString(),
      status: interactionData.newStatus || leads[index].status,
      value: interactionData.updatedValue || leads[index].value
    };
    
    return { ...leads[index] };
  },

  async getLeadsByConversation(conversationId) {
    await delay(200);
    return leads.filter(l => l.conversationId === conversationId).map(l => ({ ...l }));
  },

  async delete(id) {
    await delay(250);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const deleted = leads.splice(index, 1)[0];
    return { ...deleted };
  }
};