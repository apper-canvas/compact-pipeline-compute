import mockActivities from "@/services/mockData/activities.json";

let activities = [...mockActivities];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
export const activityService = {
  async getAll() {
    await delay(300);
    return [...activities];
  },

  async getById(id) {
    await delay(200);
    const activity = activities.find(a => a.Id === parseInt(id));
    if (!activity) throw new Error("Activity not found");
    return { ...activity };
  },
async create(activityData) {
    await delay(400);
    const newActivity = {
      ...activityData,
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      leadId: activityData.leadId ? parseInt(activityData.leadId) : null,
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null,
      createdAt: new Date().toISOString(),
      completed: false,
      conversationId: activityData.conversationId || null,
      botGenerated: activityData.botGenerated || false
    };
    activities.push(newActivity);
    return { ...newActivity };
  },

  async createFromBotInteraction(interactionData) {
    await delay(300);
    const { conversationId, leadId, dealId, summary, activityType } = interactionData;
    
    const newActivity = {
      subject: `Bot Interaction - ${activityType || 'Chat'}`,
      type: 'Bot Interaction',
      status: 'Completed',
      priority: 'Medium',
      dueDate: new Date().toISOString().split('T')[0],
      description: summary || 'Automated activity from bot conversation',
      leadId: leadId ? parseInt(leadId) : null,
      dealId: dealId ? parseInt(dealId) : null,
      conversationId: conversationId,
      botGenerated: true,
      createdBy: 'Bot Assistant',
      Id: Math.max(...activities.map(a => a.Id)) + 1,
      createdAt: new Date().toISOString(),
      completed: true
    };
    
    activities.push(newActivity);
    return { ...newActivity };
  },

async update(id, activityData) {
    await delay(350);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    
    activities[index] = {
      ...activities[index],
      ...activityData,
      Id: parseInt(id),
      leadId: activityData.leadId ? parseInt(activityData.leadId) : null,
      dealId: activityData.dealId ? parseInt(activityData.dealId) : null
    };
    return { ...activities[index] };
  },

  async getActivitiesByConversation(conversationId) {
    await delay(200);
    return activities.filter(a => a.conversationId === conversationId).map(a => ({ ...a }));
  },

  async getBotGeneratedActivities() {
    await delay(200);
    return activities.filter(a => a.botGenerated === true).map(a => ({ ...a }));
  },

  async delete(id) {
    await delay(250);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    
    const deleted = activities.splice(index, 1)[0];
    return { ...deleted };
  },

async markComplete(id) {
    await delay(200);
    const index = activities.findIndex(a => a.Id === parseInt(id));
    if (index === -1) throw new Error("Activity not found");
    
    const activity = activities[index];
    activities[index].completed = true;
    
    // If this is a Phone Call activity with notes, trigger Edge function for follow-up creation
    if (activity.type === 'Phone Call' && activity.description && activity.description.trim()) {
      try {
        // This will be handled by the frontend to call the Edge function
        // We return the activity with a flag to trigger the Edge function
        return { 
          ...activities[index], 
          triggerFollowUp: true,
          notes: activity.description,
          dealId: activity.dealId || 1 // Default to deal ID 1 if not specified
        };
      } catch (error) {
        // Don't fail the completion if Edge function fails
        console.warn('Follow-up creation failed:', error);
      }
    }
    
    // If this is a bot-generated activity, check for additional follow-up
    if (activity.botGenerated && activity.conversationId) {
      return {
        ...activities[index],
        triggerBotAnalysis: true,
        conversationId: activity.conversationId
      };
    }
    
    return { ...activities[index] };
  }
};