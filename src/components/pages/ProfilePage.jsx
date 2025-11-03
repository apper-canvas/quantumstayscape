import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import userService from "@/services/api/userService";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  const loadUser = async () => {
    try {
      setError(null);
      setLoading(true);
      const data = await userService.getCurrentUser();
      setUser(data);
      setEditData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const updatedUser = await userService.updateProfile(user.Id, editData);
      setUser(updatedUser);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData(user);
    setIsEditing(false);
  };

  const getLoyaltyStatusInfo = (status) => {
    switch (status) {
      case "gold":
        return { color: "bg-amber-100 text-amber-800", icon: "Crown" };
      case "silver":
        return { color: "bg-gray-100 text-gray-800", icon: "Medal" };
      case "bronze":
        return { color: "bg-orange-100 text-orange-800", icon: "Award" };
      default:
        return { color: "bg-blue-100 text-blue-800", icon: "Star" };
    }
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadUser} />;
  if (!user) return <Error message="User not found" />;

  const loyaltyInfo = getLoyaltyStatusInfo(user.loyaltyStatus);

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              My Profile
            </h1>
            <p className="text-xl text-gray-600">
              Manage your account information and preferences.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="card p-6 text-center"
              >
                <div className="relative mb-6">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-24 h-24 rounded-full object-cover mx-auto border-4 border-white shadow-lg"
                  />
                  <button className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-2 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                    <ApperIcon name="Camera" className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  {user.name}
                </h2>
                <p className="text-gray-600 mb-4">{user.email}</p>

                <div className="space-y-3 mb-6">
                  <Badge variant="default" className={loyaltyInfo.color}>
                    <ApperIcon name={loyaltyInfo.icon} className="w-3 h-3 mr-1" />
                    {user.loyaltyStatus} Member
                  </Badge>
                  
                  <div className="text-sm text-gray-600">
                    Member since {new Date(user.memberSince).getFullYear()}
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">{user.totalBookings}</div>
                    <div className="text-sm text-gray-600">Total Bookings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-500">12</div>
                    <div className="text-sm text-gray-600">Countries Visited</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2 space-y-8">
              {/* Personal Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="card p-6"
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    Personal Information
                  </h3>
                  {!isEditing ? (
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                      <ApperIcon name="Edit" className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        loading={saving}
                      >
                        Save Changes
                      </Button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    label="First Name"
                    value={editData.firstName || ""}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Last Name"
                    value={editData.lastName || ""}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Email Address"
                    type="email"
                    value={editData.email || ""}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    disabled={!isEditing}
                  />
                  <Input
                    label="Phone Number"
                    value={editData.phone || ""}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              </motion.div>

              {/* Travel Preferences */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="card p-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
                  Travel Preferences
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="label">Preferred Room Type</label>
                    <select
                      value={editData.preferences?.roomType || ""}
                      onChange={(e) => handlePreferenceChange("roomType", e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="standard">Standard Room</option>
                      <option value="deluxe">Deluxe Room</option>
                      <option value="suite">Suite</option>
                      <option value="penthouse">Penthouse</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Bed Preference</label>
                    <select
                      value={editData.preferences?.bedType || ""}
                      onChange={(e) => handlePreferenceChange("bedType", e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="twin">Twin Beds</option>
                      <option value="queen">Queen Bed</option>
                      <option value="king">King Bed</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Smoking Preference</label>
                    <select
                      value={editData.preferences?.smokingPreference || ""}
                      onChange={(e) => handlePreferenceChange("smokingPreference", e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="non-smoking">Non-smoking</option>
                      <option value="smoking">Smoking</option>
                    </select>
                  </div>

                  <div>
                    <label className="label">Floor Preference</label>
                    <select
                      value={editData.preferences?.floorPreference || ""}
                      onChange={(e) => handlePreferenceChange("floorPreference", e.target.value)}
                      disabled={!isEditing}
                      className="input"
                    >
                      <option value="any">No Preference</option>
                      <option value="low">Lower Floors (1-5)</option>
                      <option value="high">Higher Floors (6+)</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editData.preferences?.newsletter || false}
                      onChange={(e) => handlePreferenceChange("newsletter", e.target.checked)}
                      disabled={!isEditing}
                      className="mr-3 rounded"
                    />
                    <span className="text-gray-700">Subscribe to newsletter for deals and travel tips</span>
                  </label>
                </div>
              </motion.div>

              {/* Account Security */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="card p-6"
              >
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-6">
                  Account Security
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Last updated 3 months ago</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Add an extra layer of security</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Enable 2FA
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Danger Zone */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="card p-6 border-error/20"
              >
                <h3 className="text-xl font-display font-semibold text-error mb-4">
                  Danger Zone
                </h3>
                <p className="text-gray-600 mb-6">
                  Once you delete your account, there is no going back. Please be certain.
                </p>
                <Button variant="danger" size="sm">
                  <ApperIcon name="Trash2" className="w-4 h-4 mr-2" />
                  Delete Account
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;