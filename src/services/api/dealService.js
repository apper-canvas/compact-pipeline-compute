import mockDeals from "@/services/mockData/deals.json";

let deals = [...mockDeals];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

export const dealService = {
  async getAll() {
    await delay(300);
    return [...deals];
  },

  async getById(id) {
    await delay(200);
    const deal = deals.find(d => d.Id === parseInt(id));
    if (!deal) throw new Error("Deal not found");
    return { ...deal };
  },

  async create(dealData) {
    await delay(400);
    const newDeal = {
      ...dealData,
      Id: Math.max(...deals.map(d => d.Id)) + 1,
      leadId: dealData.leadId ? parseInt(dealData.leadId) : null,
      createdAt: new Date().toISOString()
    };
    deals.push(newDeal);
    return { ...newDeal };
  },

  async update(id, dealData) {
    await delay(350);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    deals[index] = {
      ...deals[index],
      ...dealData,
      Id: parseInt(id),
      leadId: dealData.leadId ? parseInt(dealData.leadId) : null
    };
    return { ...deals[index] };
  },

  async delete(id) {
    await delay(250);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    const deleted = deals.splice(index, 1)[0];
    return { ...deleted };
  },

  async moveStage(id, newStage) {
    await delay(300);
    const index = deals.findIndex(d => d.Id === parseInt(id));
    if (index === -1) throw new Error("Deal not found");
    
    deals[index].stage = newStage;
    
    // Update probability based on stage
    const probabilityMap = {
      "prospecting": 20,
      "proposal": 50,
      "negotiation": 75,
      "closed-won": 100,
      "closed-lost": 0
    };
    
    deals[index].probability = probabilityMap[newStage] || deals[index].probability;
    
    return { ...deals[index] };
  }
};