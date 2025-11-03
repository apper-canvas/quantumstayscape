import { motion } from "framer-motion";

const Loading = ({ type = "page" }) => {
  if (type === "hotels") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="card overflow-hidden"
          >
            <div className="h-48 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse" />
            <div className="p-4 space-y-3">
              <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
              <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-2/3" />
              <div className="flex justify-between items-center">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-20" />
                <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-16" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  if (type === "hero") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 animate-pulse">
        <div className="container mx-auto px-4 pt-32 pb-16">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="h-16 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded mx-auto" />
            <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded w-2/3 mx-auto" />
            <div className="card p-8 max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse rounded" />
                <div className="h-12 bg-gradient-to-r from-primary-200 to-primary-300 animate-pulse rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full mx-auto"
        />
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
};

export default Loading;