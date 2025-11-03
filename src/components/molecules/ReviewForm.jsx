import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";

function ReviewForm({ onSubmit, onCancel, initialData = null, isLoading = false }) {
  const [formData, setFormData] = useState({
    rating: initialData?.rating || 0,
    title: initialData?.title || "",
    comment: initialData?.comment || "",
    photos: initialData?.photos || [],
    stayDate: initialData?.stayDate || ""
  });

  const [errors, setErrors] = useState({});

  const handleRatingClick = (rating) => {
    setFormData(prev => ({ ...prev, rating }));
    if (errors.rating) {
      setErrors(prev => ({ ...prev, rating: "" }));
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    const maxFiles = 6;
    
    if (formData.photos.length + files.length > maxFiles) {
      setErrors(prev => ({ ...prev, photos: `Maximum ${maxFiles} photos allowed` }));
      return;
    }
    
    // In a real app, you would upload these to a storage service
    // For now, we'll create placeholder URLs
    const newPhotos = files.map((file, index) => 
      `https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop&t=${Date.now() + index}`
    );
    
    setFormData(prev => ({
      ...prev,
      photos: [...prev.photos, ...newPhotos]
    }));
    
    if (errors.photos) {
      setErrors(prev => ({ ...prev, photos: "" }));
    }
  };

  const removePhoto = (index) => {
    setFormData(prev => ({
      ...prev,
      photos: prev.photos.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.rating === 0) {
      newErrors.rating = "Please select a rating";
    }
    
    if (!formData.title.trim()) {
      newErrors.title = "Please enter a title for your review";
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = "Please enter your review comment";
    }
    
    if (!formData.stayDate) {
      newErrors.stayDate = "Please enter your stay date";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    onSubmit(formData);
  };

  const renderStars = () => {
    return Array.from({ length: 5 }, (_, i) => {
      const rating = i + 1;
      return (
        <button
          key={i}
          type="button"
          onClick={() => handleRatingClick(rating)}
          className="focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
        >
          <ApperIcon 
            name="Star" 
            className={`w-8 h-8 transition-colors ${
              i < formData.rating 
                ? 'text-amber-400 fill-current' 
                : 'text-gray-300 hover:text-amber-200'
            }`} 
          />
        </button>
      );
    });
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Rating */}
      <div>
        <label className="label">Rating *</label>
        <div className="flex items-center space-x-2">
          {renderStars()}
          {formData.rating > 0 && (
            <span className="ml-3 text-sm text-gray-600">
              {formData.rating} star{formData.rating !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {errors.rating && (
          <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
        )}
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="label">Review Title *</label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          placeholder="Give your review a title"
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
      </div>

      {/* Comment */}
      <div>
        <label htmlFor="comment" className="label">Your Review *</label>
        <textarea
          id="comment"
          rows={4}
          value={formData.comment}
          onChange={(e) => handleInputChange('comment', e.target.value)}
          placeholder="Share your experience..."
          className={`input resize-none ${errors.comment ? 'border-red-500' : ''}`}
        />
        {errors.comment && (
          <p className="mt-1 text-sm text-red-600">{errors.comment}</p>
        )}
      </div>

      {/* Stay Date */}
      <div>
        <label htmlFor="stayDate" className="label">Stay Date *</label>
        <Input
          id="stayDate"
          type="date"
          value={formData.stayDate}
          onChange={(e) => handleInputChange('stayDate', e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          className={errors.stayDate ? 'border-red-500' : ''}
        />
        {errors.stayDate && (
          <p className="mt-1 text-sm text-red-600">{errors.stayDate}</p>
        )}
      </div>

      {/* Photos */}
      <div>
        <label className="label">Photos (Optional)</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-primary-500 transition-colors">
          <div className="text-center">
            <ApperIcon name="Upload" className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <div className="text-sm text-gray-600 mb-2">
              Upload photos from your stay (max 6 photos)
            </div>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
              id="photo-upload"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => document.getElementById('photo-upload').click()}
              disabled={formData.photos.length >= 6}
            >
              <ApperIcon name="Camera" className="w-4 h-4 mr-2" />
              Add Photos
            </Button>
          </div>
        </div>
        
        {formData.photos.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-4">
            {formData.photos.map((photo, index) => (
              <div key={index} className="relative group">
                <img 
                  src={photo} 
                  alt={`Upload ${index + 1}`}
                  className="w-full aspect-square object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <ApperIcon name="X" className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
        
        {errors.photos && (
          <p className="mt-1 text-sm text-red-600">{errors.photos}</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="min-w-[120px]"
        >
          {isLoading ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Submitting...
            </div>
          ) : (
            <>
              <ApperIcon name="Send" className="w-4 h-4 mr-2" />
              {initialData ? 'Update Review' : 'Submit Review'}
            </>
          )}
        </Button>
      </div>
    </motion.form>
  );
}

export default ReviewForm;