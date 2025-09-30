import React, { useState, useEffect, useContext } from "react";
import { useOutletContext } from "react-router-dom";
import Header from "@/components/organisms/Header";
import MetricCard from "@/components/molecules/MetricCard";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import { leadService } from "@/services/api/leadService";
import { activityService } from "@/services/api/activityService";
import { dealService } from "@/services/api/dealService";
import { format, isToday, isAfter } from "date-fns";

const Dashboard = () => {
  const { toggleMobileSidebar } = useOutletContext();
  const [leads, setLeads] = useState([]);
  const [activities, setActivities] = useState([]);
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
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
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Calculate metrics
  const totalLeads = leads.length;
  const qualifiedLeads = leads.filter(l => l.status === "qualified").length;
  const activitiesDueToday = activities.filter(a => !a.completed && isToday(new Date(a.dueDate))).length;
  const overdueTasks = activities.filter(a => !a.completed && isAfter(new Date(), new Date(a.dueDate))).length;
  
  const totalDealValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const wonDeals = deals.filter(d => d.stage === "closed-won").reduce((sum, deal) => sum + deal.value, 0);
  const pipelineValue = deals.filter(d => !["closed-won", "closed-lost"].includes(d.stage)).reduce((sum, deal) => sum + deal.value, 0);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0
    }).format(amount);
  };

  // Get recent activities
  const recentActivities = activities
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  // Get upcoming activities
  const upcomingActivities = activities
    .filter(a => !a.completed)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, 5);

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <Header 
        title="Dashboard"
        onMobileMenuToggle={toggleMobileSidebar}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Total Leads"
          value={totalLeads}
          change="+12%"
          changeType="positive"
          icon="Users"
          gradient
        />
        <MetricCard
          title="Qualified Leads"
          value={qualifiedLeads}
          change="+8%"
          changeType="positive"
          icon="UserCheck"
          gradient
        />
        <MetricCard
          title="Due Today"
          value={activitiesDueToday}
          change={overdueTasks > 0 ? `${overdueTasks} overdue` : "On track"}
          changeType={overdueTasks > 0 ? "negative" : "positive"}
          icon="Calendar"
          gradient
        />
        <MetricCard
          title="Pipeline Value"
          value={formatCurrency(pipelineValue)}
          change="+23%"
          changeType="positive"
          icon="Target"
          gradient
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold gradient-text">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button variant="primary" className="p-4 h-auto flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="UserPlus" className="h-5 w-5" />
              <span className="font-medium">Add New Lead</span>
            </div>
            <span className="text-sm opacity-90">Start tracking a new prospect</span>
          </Button>
          <Button variant="secondary" className="p-4 h-auto flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="Calendar" className="h-5 w-5" />
              <span className="font-medium">Schedule Activity</span>
            </div>
            <span className="text-sm opacity-90">Plan your next follow-up</span>
          </Button>
          <Button variant="outline" className="p-4 h-auto flex-col items-start">
            <div className="flex items-center gap-3 mb-2">
              <ApperIcon name="Target" className="h-5 w-5" />
              <span className="font-medium">Create Deal</span>
            </div>
            <span className="text-sm opacity-90">Add a new opportunity</span>
          </Button>
        </div>
      </Card>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold gradient-text">Recent Activities</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => {
              const lead = leads.find(l => l.Id === activity.leadId);
              return (
                <div key={activity.Id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${
                    activity.completed ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary"
                  }`}>
                    <ApperIcon 
                      name={activity.type === "call" ? "Phone" : activity.type === "email" ? "Mail" : "Calendar"} 
                      className="h-4 w-4" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {activity.subject}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lead ? `${lead.firstName} ${lead.lastName}` : "No lead"} • {format(new Date(activity.createdAt), "MMM d")}
                    </p>
                  </div>
                  {activity.completed && (
                    <Badge variant="success" className="text-xs">Completed</Badge>
                  )}
                </div>
              );
            })}
          </div>
        </Card>

        {/* Upcoming Tasks */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold gradient-text">Upcoming Tasks</h2>
            <Button variant="ghost" size="sm">
              <ApperIcon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {upcomingActivities.map((activity) => {
              const lead = leads.find(l => l.Id === activity.leadId);
              const isOverdue = isAfter(new Date(), new Date(activity.dueDate));
              const isDueToday = isToday(new Date(activity.dueDate));
              
              return (
                <div key={activity.Id} className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg transition-colors">
                  <div className={`p-2 rounded-lg ${
                    isOverdue ? "bg-red-100 text-red-600" : 
                    isDueToday ? "bg-amber-100 text-amber-600" : 
                    "bg-primary/10 text-primary"
                  }`}>
                    <ApperIcon 
                      name={activity.type === "call" ? "Phone" : activity.type === "email" ? "Mail" : "Calendar"} 
                      className="h-4 w-4" 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-slate-900 truncate">
                      {activity.subject}
                    </p>
                    <p className="text-xs text-slate-500">
                      {lead ? `${lead.firstName} ${lead.lastName}` : "No lead"} • {format(new Date(activity.dueDate), "MMM d 'at' h:mm a")}
                    </p>
                  </div>
                  <Badge 
                    variant={isOverdue ? "danger" : isDueToday ? "warning" : "secondary"}
                    className="text-xs"
                  >
                    {isOverdue ? "Overdue" : isDueToday ? "Today" : "Upcoming"}
                  </Badge>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Pipeline Summary */}
      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold gradient-text">Pipeline Summary</h2>
          <Button variant="ghost" size="sm">
            View Pipeline
            <ApperIcon name="ArrowRight" className="h-4 w-4 ml-2" />
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {[
            { stage: "prospecting", name: "Prospecting", color: "primary" },
            { stage: "proposal", name: "Proposal", color: "warning" },
            { stage: "negotiation", name: "Negotiation", color: "secondary" },
            { stage: "closed-won", name: "Won", color: "success" },
            { stage: "closed-lost", name: "Lost", color: "danger" }
          ].map(({ stage, name, color }) => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const stageValue = stageDeals.reduce((sum, deal) => sum + deal.value, 0);
            
            return (
              <div key={stage} className="text-center p-4 border border-slate-200 rounded-lg">
                <Badge variant={color} className="mb-2">{stageDeals.length}</Badge>
                <h4 className="font-medium text-slate-900 mb-1">{name}</h4>
                <p className="text-lg font-bold gradient-text">{formatCurrency(stageValue)}</p>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;