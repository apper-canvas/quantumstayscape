import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ 
  title = "No results found", 
  description = "Try adjusting your search criteria",
  action,
  actionText = "Clear Filters",
  icon = "Search",
  type = "search" 
}) => {
  const getEmptyContent = () => {
    switch (type) {
      case "bookings":
        return {
          icon: "Calendar",
          title: "No bookings yet",
          description: "Start your journey by booking your first stay with us!",
          actionText: "Browse Hotels"
        };
      case "favorites":
        return {
          icon: "Heart",
          title: "No saved hotels",
          description: "Save hotels you love to easily find them later.",
          actionText: "Explore Hotels"
        };
      case "search":
      default:
        return { icon, title, description, actionText };
    }
  };

  const content = getEmptyContent();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-24 h-24 bg-gradient-to-br from-primary/10 to-primary/20 rounded-full flex items-center justify-center mb-6">
        <ApperIcon name={content.icon} className="w-12 h-12 text-primary-500" />
      </div>
      
      <h3 className="text-xl font-display font-semibold text-gray-900 mb-3">
        {content.title}
      </h3>
      
      <p className="text-gray-600 mb-8 max-w-md leading-relaxed">
        {content.description}
      </p>
      
      {(action || type === "bookings") && (
        <button 
          onClick={action || (() => window.location.href = "/hotels")} 
          className="btn-primary"
        >
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          {content.actionText}
        </button>
      )}
    </motion.div>
  );
};

export default Empty;