import { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import ApperIcon from "@/components/ApperIcon";
import { format } from "date-fns";

const SearchWidget = ({ onSearch, className = "", size = "default" }) => {
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (destination.trim()) {
      onSearch({
        destination: destination.trim(),
        checkIn,
        checkOut,
        guests
      });
    }
  };

  const isLarge = size === "large";

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`card bg-white p-6 ${isLarge ? 'max-w-5xl' : 'max-w-4xl'} mx-auto shadow-elevated ${className}`}
    >
      <div className={`grid gap-4 ${isLarge ? 'grid-cols-1 md:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'}`}>
        <div className="relative">
          <label className="label">
            <ApperIcon name="MapPin" className="w-4 h-4 inline mr-2" />
            Where to?
          </label>
          <Input
            type="text"
            placeholder="Enter destination..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="pl-4"
          />
        </div>

        <div>
          <label className="label">
            <ApperIcon name="Calendar" className="w-4 h-4 inline mr-2" />
            Check-in
          </label>
          <Input
            type="date"
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        <div>
          <label className="label">
            <ApperIcon name="Calendar" className="w-4 h-4 inline mr-2" />
            Check-out
          </label>
          <Input
            type="date"
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
            min={checkIn || format(new Date(), "yyyy-MM-dd")}
          />
        </div>

        <div>
          <label className="label">
            <ApperIcon name="Users" className="w-4 h-4 inline mr-2" />
            Guests
          </label>
          <select 
            value={guests} 
            onChange={(e) => setGuests(parseInt(e.target.value))}
            className="input"
          >
            {[1,2,3,4,5,6,7,8].map(num => (
              <option key={num} value={num}>
                {num} {num === 1 ? 'Guest' : 'Guests'}
              </option>
            ))}
          </select>
        </div>

        <div className={`${isLarge ? 'md:col-span-4' : 'sm:col-span-2 lg:col-span-4'} flex justify-center mt-2`}>
          <Button type="submit" className="px-12" size={isLarge ? "lg" : "default"}>
            <ApperIcon name="Search" className="w-5 h-5 mr-2" />
            Search Hotels
          </Button>
        </div>
      </div>
    </motion.form>
  );
};

export default SearchWidget;