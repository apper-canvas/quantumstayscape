import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import ReviewCard from "@/components/molecules/ReviewCard";
import ReviewForm from "@/components/molecules/ReviewForm";
import reviewService from "@/services/api/reviewService";
import hotelService from "@/services/api/hotelService";

function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRating, setFilterRating] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [hotels, setHotels] = useState([]);
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get hotel info from navigation state (if coming from hotel details)
  const prefilledHotel = location.state?.hotel;
  const [selectedHotelId, setSelectedHotelId] = useState(prefilledHotel?.Id || "");

  useEffect(() => {
    loadReviews();
    loadHotels();
  }, []);

  useEffect(() => {
    loadReviews();
  }, [searchTerm, filterRating, sortBy, selectedHotelId]);

  async function loadReviews() {
    try {
      setLoading(true);
      setError(null);
      
      const filters = {
        search: searchTerm,
        minRating: filterRating ? parseInt(filterRating) : undefined,
        sortBy,
        hotelId: selectedHotelId ? parseInt(selectedHotelId) : undefined
      };
      
      const reviewsData = await reviewService.getAll(filters);
      setReviews(reviewsData);
    } catch (err) {
      setError(err.message);
      toast.error("Failed to load reviews");
    } finally {
      setLoading(false);
    }
  }

  async function loadHotels() {
    try {
      const hotelsData = await hotelService.getAll();
      setHotels(hotelsData);
    } catch (err) {
      console.error("Failed to load hotels:", err);
    }
  }

  const handleNewReview = () => {
    setEditingReview(null);
    setShowForm(true);
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setShowForm(true);
  };

  const handleFormSubmit = async (formData) => {
    try {
      setFormLoading(true);
      
      // Add user info (in real app, this would come from auth context)
      const reviewData = {
        ...formData,
        hotelId: selectedHotelId || prefilledHotel?.Id,
        userId: 1, // Mock current user ID
        userName: "Current User", // Mock current user name
        userAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face"
      };
      
      if (editingReview) {
        await reviewService.update(editingReview.Id, reviewData);
        toast.success("Review updated successfully!");
      } else {
        await reviewService.create(reviewData);
        toast.success("Review submitted successfully!");
      }
      
      setShowForm(false);
      setEditingReview(null);
      await loadReviews();
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Are you sure you want to delete this review?")) {
      return;
    }
    
    try {
      await reviewService.delete(reviewId);
      toast.success("Review deleted successfully");
      await loadReviews();
    } catch (err) {
      toast.error("Failed to delete review");
    }
  };

  const filteredReviews = reviews;

  if (loading) {
    return <Loading message="Loading reviews..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadReviews} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Hotel Reviews</h1>
            <p className="text-gray-600 mt-2">
              Share your experiences and help other travelers
            </p>
          </div>
          <Button
            onClick={handleNewReview}
            className="mt-4 sm:mt-0"
          >
            <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
            Write Review
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div>
            <Input
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <select
              value={selectedHotelId}
              onChange={(e) => setSelectedHotelId(e.target.value)}
              className="input w-full"
            >
              <option value="">All Hotels</option>
              {hotels.map(hotel => (
                <option key={hotel.Id} value={hotel.Id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="input w-full"
            >
              <option value="">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4+ Stars</option>
              <option value="3">3+ Stars</option>
              <option value="2">2+ Stars</option>
              <option value="1">1+ Stars</option>
            </select>
          </div>
          
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input w-full"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="rating-high">Highest Rating</option>
              <option value="rating-low">Lowest Rating</option>
            </select>
          </div>
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <div className="bg-white rounded-lg shadow-elevated max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    {editingReview ? 'Edit Review' : 'Write a Review'}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowForm(false);
                      setEditingReview(null);
                    }}
                    className="p-2"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </Button>
                </div>
                
                <ReviewForm
                  onSubmit={handleFormSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingReview(null);
                  }}
                  initialData={editingReview}
                  isLoading={formLoading}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <Empty
            title="No reviews found"
            description="Be the first to write a review!"
            action={
              <Button onClick={handleNewReview}>
                <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
                Write First Review
              </Button>
            }
          />
        ) : (
          <motion.div layout className="space-y-6">
            <div className="text-sm text-gray-600 mb-4">
              Showing {filteredReviews.length} review{filteredReviews.length !== 1 ? 's' : ''}
            </div>
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.Id}
                review={review}
                onEdit={handleEditReview}
                onDelete={handleDeleteReview}
                showHotelName={!selectedHotelId}
                currentUserId={1} // Mock current user ID
              />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default ReviewsPage;