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
      lastContact: null
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
      Id: parseInt(id)
    };
    return { ...leads[index] };
  },

  async delete(id) {
    await delay(250);
    const index = leads.findIndex(l => l.Id === parseInt(id));
    if (index === -1) throw new Error("Lead not found");
    
    const deleted = leads.splice(index, 1)[0];
    return { ...deleted };
  }
};