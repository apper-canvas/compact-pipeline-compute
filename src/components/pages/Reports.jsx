import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import Card from "@/components/atoms/Card";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import ApperIcon from "@/components/ApperIcon";
import { leadService } from "@/services/api/leadService";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";
import { format, startOfWeek, endOfWeek, isWithinInterval } from "date-fns";

const Reports = () => {
  const { toggleMobileSidebar } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [leadsData, activitiesData, dealsData] = await Promise.all([
        leadService.getAll(),
        activityService.getAll(),
        dealService.getAll()
      ]);
      
      setLeads(leadsData);
      setActivities(activitiesData);
      setDeals(dealsData);
    } catch (err) {
      setError(err.message || "Failed to load report data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getThisWeekData = () => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);
    
    const thisWeekLeads = leads.filter(lead => 
      isWithinInterval(new Date(lead.createdAt), { start: weekStart, end: weekEnd })
    );
    
    const thisWeekActivities = activities.filter(activity => 
      isWithinInterval(new Date(activity.createdAt), { start: weekStart, end: weekEnd })
    );
    
    const thisWeekDeals = deals.filter(deal => 
      isWithinInterval(new Date(deal.createdAt), { start: weekStart, end: weekEnd })
    );
    
    return {
      leads: thisWeekLeads.length,
      activities: thisWeekActivities.length,
      deals: thisWeekDeals.length,
      dealsValue: thisWeekDeals.reduce((sum, deal) => sum + deal.value, 0)
    };
  };

  // Calculate metrics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
  const conversionRate = totalLeads > 0 ? Math.round((qualifiedLeads / totalLeads) * 100) : 0;
  
  const totalActivities = activities.length;
  const completedActivities = activities.filter(a => a.completed).length;
  const activityCompletionRate = totalActivities > 0 ? Math.round((completedActivities / totalActivities) * 100) : 0;
  
  const totalDealsValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(d => d.stage === "closed-won");
  const wonValue = wonDeals.reduce((sum, deal) => sum + deal.value, 0);
  const winRate = deals.filter(d => ["closed-won", "closed-lost"].includes(d.stage)).length > 0 
    ? Math.round((wonDeals.length / deals.filter(d => ["closed-won", "closed-lost"].includes(d.stage)).length) * 100) 
    : 0;
  
  const pipelineValue = deals.filter(d => !["closed-won", "closed-lost"].includes(d.stage))
    .reduce((sum, deal) => sum + deal.value, 0);

  const thisWeek = getThisWeekData();

  // Lead sources breakdown
  const leadSources = leads.reduce((acc, lead) => {
    acc[lead.source] = (acc[lead.source] || 0) + 1;
    return acc;
  }, {});

  // Deal stages breakdown
  const dealStages = deals.reduce((acc, deal) => {
    acc[deal.stage] = (acc[deal.stage] || 0) + 1;
    return acc;
  }, {});

  // Activity types breakdown
  const activityTypes = activities.reduce((acc, activity) => {
    acc[activity.type] = (acc[activity.type] || 0) + 1;
    return acc;
  }, {});

  // Top performing leads (by deal value)
  const leadsWithDealValue = leads.map(lead => {
    const leadDeals = deals.filter(deal => deal.leadId === lead.Id);
    const totalValue = leadDeals.reduce((sum, deal) => sum + deal.value, 0);
    return { ...lead, dealValue: totalValue, dealCount: leadDeals.length };
  }).sort((a, b) => b.dealValue - a.dealValue).slice(0, 5);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Reports & Analytics"
        onMobileMenuToggle={toggleMobileSidebar}
      />

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Pipeline Value"
          value={formatCurrency(pipelineValue)}
          change="+18%"
          changeType="positive"
          icon="TrendingUp"
          gradient
        />
        <MetricCard
          title="Win Rate"
          value={`${winRate}%`}
          change="+5%"
          changeType="positive"
          icon="Target"
          gradient
        />
        <MetricCard
          title="Lead Conversion"
          value={`${conversionRate}%`}
          change="+12%"
          changeType="positive"
          icon="Users"
          gradient
        />
        <MetricCard
          title="Activity Completion"
          value={`${activityCompletionRate}%`}
          change="+8%"
          changeType="positive"
          icon="CheckCircle"
          gradient
        />
      </div>

      {/* This Week Summary */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg">
            <ApperIcon name="Calendar" className="h-6 w-6 text-primary" />
          </div>
          <h2 className="text-xl font-bold gradient-text">This Week's Activity</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
            <div className="text-3xl font-bold gradient-text mb-2">{thisWeek.leads}</div>
            <div className="text-sm text-slate-600">New Leads</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
            <div className="text-3xl font-bold gradient-text mb-2">{thisWeek.activities}</div>
            <div className="text-sm text-slate-600">Activities Created</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
            <div className="text-3xl font-bold gradient-text mb-2">{thisWeek.deals}</div>
            <div className="text-sm text-slate-600">New Deals</div>
          </div>
          <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-slate-100 rounded-lg">
            <div className="text-3xl font-bold gradient-text mb-2">{formatCurrency(thisWeek.dealsValue)}</div>
            <div className="text-sm text-slate-600">Deal Value Added</div>
          </div>
        </div>
      </Card>

      {/* Breakdown Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lead Sources */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-accent/10 to-emerald-600/10 rounded-lg">
              <ApperIcon name="BarChart3" className="h-5 w-5 text-accent" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Lead Sources</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(leadSources).map(([source, count]) => (
              <div key={source} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={source === "website" ? "Globe" : source === "email" ? "Mail" : source === "phone" ? "Phone" : source === "referral" ? "Users" : "Share2"}
                    className="h-4 w-4 text-slate-400"
                  />
                  <span className="text-sm font-medium text-slate-900 capitalize">{source}</span>
                </div>
                <div className="text-sm font-semibold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Deal Stages */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-primary/10 to-blue-600/10 rounded-lg">
              <ApperIcon name="PieChart" className="h-5 w-5 text-primary" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Deal Stages</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(dealStages).map(([stage, count]) => (
              <div key={stage} className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-900 capitalize">
                  {stage.replace("-", " ")}
                </span>
                <div className="text-sm font-semibold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </Card>

        {/* Activity Types */}
        <Card>
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-lg">
              <ApperIcon name="Activity" className="h-5 w-5 text-amber-600" />
            </div>
            <h3 className="text-lg font-semibold gradient-text">Activity Types</h3>
          </div>
          <div className="space-y-3">
            {Object.entries(activityTypes).map(([type, count]) => (
              <div key={type} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ApperIcon 
                    name={type === "call" ? "Phone" : type === "email" ? "Mail" : type === "meeting" ? "Users" : type === "task" ? "CheckSquare" : "FileText"}
                    className="h-4 w-4 text-slate-400"
                  />
                  <span className="text-sm font-medium text-slate-900 capitalize">{type}</span>
                </div>
                <div className="text-sm font-semibold text-primary">{count}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Top Performing Leads */}
      <Card>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-accent/10 to-emerald-600/10 rounded-lg">
            <ApperIcon name="Trophy" className="h-6 w-6 text-accent" />
          </div>
          <h2 className="text-xl font-bold gradient-text">Top Performing Leads</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Lead</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Company</th>
                <th className="text-left py-3 px-4 font-semibold text-slate-900">Status</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Deals</th>
                <th className="text-right py-3 px-4 font-semibold text-slate-900">Total Value</th>
              </tr>
            </thead>
            <tbody>
              {leadsWithDealValue.map((lead) => (
                <tr key={lead.Id} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">
                      {lead.firstName} {lead.lastName}
                    </div>
                    <div className="text-sm text-slate-500">{lead.email}</div>
                  </td>
                  <td className="py-3 px-4 text-slate-900">{lead.company}</td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === "qualified" ? "bg-accent/10 text-accent" :
                      lead.status === "new" ? "bg-primary/10 text-primary" :
                      lead.status === "contacted" ? "bg-amber-100 text-amber-800" :
                      "bg-red-100 text-red-800"
                    }`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-medium text-slate-900">{lead.dealCount}</td>
                  <td className="py-3 px-4 text-right font-bold text-primary">{formatCurrency(lead.dealValue)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;