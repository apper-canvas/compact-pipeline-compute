import React from "react";
import Card from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import { format, isAfter, isToday } from "date-fns";
import { toast } from "react-toastify";

const ActivityList = ({ activities, onMarkComplete, onEdit, onDelete }) => {
  const getActivityIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "call": return "Phone";
      case "email": return "Mail";
      case "meeting": return "Users";
      case "task": return "CheckSquare";
      case "note": return "FileText";
      default: return "Calendar";
    }
  };

  const getActivityVariant = (activity) => {
    if (activity.completed) return "success";
    const dueDate = new Date(activity.dueDate);
    if (isToday(dueDate)) return "warning";
    if (isAfter(new Date(), dueDate)) return "danger";
    return "primary";
  };

  const getPriorityColor = (dueDate, completed) => {
    if (completed) return "text-accent";
    const due = new Date(dueDate);
    if (isToday(due)) return "text-amber-600";
    if (isAfter(new Date(), due)) return "text-red-600";
    return "text-slate-600";
  };

  const handleMarkComplete = (activity) => {
    onMarkComplete(activity.Id);
    toast.success(`Activity "${activity.subject}" marked as complete`);
  };

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <Card key={activity.Id} className="hover:shadow-lg transition-shadow">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className={`p-2 rounded-lg ${
              activity.completed 
                ? "bg-accent/10 text-accent" 
                : "bg-primary/10 text-primary"
            }`}>
              <ApperIcon 
                name={getActivityIcon(activity.type)} 
                className="h-5 w-5" 
              />
            </div>

            {/* Content */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {activity.subject}
                  </h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant={getActivityVariant(activity)}>
                      {activity.type}
                    </Badge>
                    {activity.completed && (
                      <Badge variant="success">Completed</Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {!activity.completed && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkComplete(activity)}
                      className="text-accent border-accent hover:bg-accent hover:text-white"
                    >
                      <ApperIcon name="Check" className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(activity)}
                  >
                    <ApperIcon name="Edit2" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(activity.Id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Details */}
              <div className="space-y-1 text-sm">
                <div className={`font-medium ${getPriorityColor(activity.dueDate, activity.completed)}`}>
                  Due: {format(new Date(activity.dueDate), "MMM d, yyyy 'at' h:mm a")}
                </div>
                {activity.notes && (
                  <p className="text-slate-600">{activity.notes}</p>
                )}
                <div className="text-xs text-slate-500">
                  Created: {format(new Date(activity.createdAt), "MMM d, yyyy")}
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ActivityList;