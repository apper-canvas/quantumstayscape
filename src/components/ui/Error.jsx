import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry, type = "page" }) => {
  if (type === "inline") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-6 text-center border-error/20 bg-error/5"
      >
        <ApperIcon name="AlertTriangle" className="w-8 h-8 text-error mx-auto mb-3" />
        <p className="text-error font-medium mb-4">{message}</p>
        {onRetry && (
          <button onClick={onRetry} className="btn-accent text-sm px-4 py-2">
            <ApperIcon name="RefreshCw" className="w-4 h-4 mr-2" />
            Try Again
          </button>
        )}
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md"
      >
        <div className="w-24 h-24 bg-gradient-to-br from-error/20 to-error/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ApperIcon name="AlertTriangle" className="w-12 h-12 text-error" />
        </div>
        <h2 className="text-2xl font-display font-bold text-gray-900 mb-4">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-600 mb-8 leading-relaxed">
          {message || "We're having trouble loading this page. Please try again."}
        </p>
        <div className="space-x-4">
          {onRetry && (
            <button onClick={onRetry} className="btn-primary">
              <ApperIcon name="RefreshCw" className="w-5 h-5 mr-2" />
              Try Again
            </button>
          )}
          <button 
            onClick={() => window.location.href = "/"} 
            className="btn-secondary"
          >
            <ApperIcon name="Home" className="w-5 h-5 mr-2" />
            Go Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Error;