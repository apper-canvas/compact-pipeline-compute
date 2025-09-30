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
      completed: false
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
    
    return { ...activities[index] };
  }
};