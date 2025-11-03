import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const TestimonialsSection = () => {
  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      location: "San Francisco, CA",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b2e6da31?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "StayScape made our family vacation absolutely perfect! The booking process was so smooth, and the hotel recommendations were spot-on. We found the most amazing beachfront resort.",
      hotel: "Grand Ocean Resort"
    },
    {
      id: 2,
      name: "Michael Chen",
      location: "New York, NY",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "As a frequent business traveler, I need reliable accommodations. StayScape consistently delivers quality hotels with excellent amenities. The loyalty program is a great bonus!",
      hotel: "City Center Business Hotel"
    },
    {
      id: 3,
      name: "Emma Rodriguez",
      location: "Austin, TX",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "I love how easy it is to filter and find exactly what I'm looking for. The detailed photos and reviews helped me choose the perfect romantic getaway for our anniversary.",
      hotel: "Seaside Boutique Inn"
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: rating }, (_, i) => (
      <ApperIcon key={i} name="Star" className="w-4 h-4 text-amber-400 fill-current" />
    ));
  };

  return (
    <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            What Our Travelers Say
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied travelers who trust StayScape for their accommodation needs.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="card p-6 bg-white hover:shadow-card-hover transition-shadow duration-300"
            >
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-display font-semibold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">{testimonial.location}</p>
                </div>
              </div>

              <div className="flex items-center mb-4">
                <div className="flex space-x-1 mr-2">
                  {renderStars(testimonial.rating)}
                </div>
                <span className="text-sm text-gray-600">
                  Stayed at {testimonial.hotel}
                </span>
              </div>

              <blockquote className="text-gray-700 leading-relaxed">
                "{testimonial.text}"
              </blockquote>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center text-primary-500">
                  <ApperIcon name="CheckCircle" className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">Verified Stay</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Trust Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary-500 mb-2">
              50K+
            </div>
            <div className="text-gray-600">Happy Travelers</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary-500 mb-2">
              10K+
            </div>
            <div className="text-gray-600">Hotels Listed</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary-500 mb-2">
              4.8/5
            </div>
            <div className="text-gray-600">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-display font-bold text-primary-500 mb-2">
              24/7
            </div>
            <div className="text-gray-600">Customer Support</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;