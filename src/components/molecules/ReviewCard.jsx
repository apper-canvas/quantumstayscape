import { motion } from "framer-motion";
import { format, parseISO } from "date-fns";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

function ReviewCard({ review, onEdit, onDelete, showHotelName = false, currentUserId = null }) {
  const canModify = currentUserId && review.userId === currentUserId;
  
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <ApperIcon 
        key={i} 
        name="Star" 
        className={`w-4 h-4 ${i < rating ? 'text-amber-400 fill-current' : 'text-gray-300'}`} 
      />
    ));
  };

  const renderPhotos = () => {
    if (!review.photos || review.photos.length === 0) return null;
    
    return (
      <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-2">
        {review.photos.slice(0, 6).map((photo, index) => (
          <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
            <img 
              src={photo} 
              alt={`Review photo ${index + 1}`}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
            />
          </div>
        ))}
        {review.photos.length > 6 && (
          <div className="aspect-square rounded-lg bg-gray-100 flex items-center justify-center">
            <span className="text-gray-600 text-sm">+{review.photos.length - 6} more</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card p-6 hover:shadow-card-hover transition-shadow"
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          {review.userAvatar ? (
            <img 
              src={review.userAvatar} 
              alt={review.userName}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
              <ApperIcon name="User" className="w-5 h-5 text-primary-600" />
            </div>
          )}
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-semibold text-gray-900">{review.userName}</h4>
              {review.verified && (
                <Badge variant="success" className="text-xs">
                  <ApperIcon name="CheckCircle" className="w-3 h-3 mr-1" />
                  Verified Stay
                </Badge>
              )}
            </div>
            <div className="flex items-center space-x-2 mt-1">
              <div className="flex space-x-1">
                {renderStars(review.rating)}
              </div>
              <span className="text-sm text-gray-500">
                {format(parseISO(review.createdAt), 'MMM d, yyyy')}
              </span>
            </div>
          </div>
        </div>
        
        {canModify && (
          <div className="flex space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(review)}
              className="p-2"
            >
              <ApperIcon name="Edit2" className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(review.Id)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <ApperIcon name="Trash2" className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Review Content */}
      <div className="mb-4">
        <h3 className="font-semibold text-lg text-gray-900 mb-2">{review.title}</h3>
        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
      </div>

      {/* Photos */}
      {renderPhotos()}

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          {showHotelName && (
            <span>Stay Date: {format(parseISO(review.stayDate), 'MMM d, yyyy')}</span>
          )}
          {review.helpful > 0 && (
            <div className="flex items-center space-x-1">
              <ApperIcon name="ThumbsUp" className="w-4 h-4" />
              <span>{review.helpful} helpful</span>
            </div>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-gray-500 hover:text-gray-700"
        >
          <ApperIcon name="ThumbsUp" className="w-4 h-4 mr-1" />
          Helpful
        </Button>
      </div>
    </motion.div>
  );
}

export default ReviewCard;