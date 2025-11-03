import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import { useNavigate } from "react-router-dom";

const AboutPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "Shield",
      title: "Secure Booking",
      description: "Your personal and payment information is always protected with industry-leading security measures."
    },
    {
      icon: "Clock",
      title: "Instant Confirmation",
      description: "Get immediate booking confirmation and detailed reservation information sent directly to your email."
    },
    {
      icon: "Heart",
      title: "Best Price Guarantee",
      description: "We guarantee the lowest prices. Find a better deal elsewhere and we'll match it plus give you extra savings."
    },
    {
      icon: "Users",
      title: "24/7 Customer Support",
      description: "Our dedicated support team is available around the clock to assist you with any questions or concerns."
    },
    {
      icon: "Star",
      title: "Verified Reviews",
      description: "Read authentic reviews from real travelers to make informed decisions about your accommodation."
    },
    {
      icon: "Globe",
      title: "Global Network",
      description: "Access to over 10,000 hotels worldwide, from boutique properties to luxury resorts and budget-friendly options."
    }
  ];

  const team = [
    {
      name: "Sarah Chen",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1494790108755-2616b2e6da31?w=300&h=300&fit=crop&crop=face",
      bio: "Former travel industry executive with 15+ years of experience in hospitality and technology."
    },
    {
      name: "Michael Rodriguez",
      role: "CTO",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face",
      bio: "Technology leader specializing in scalable platforms and user experience design."
    },
    {
      name: "Emily Johnson",
      role: "Head of Customer Experience",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop&crop=face",
      bio: "Hospitality expert focused on creating exceptional customer journeys and satisfaction."
    }
  ];

  const stats = [
    { number: "50K+", label: "Happy Travelers" },
    { number: "10K+", label: "Hotel Partners" },
    { number: "4.8/5", label: "Average Rating" },
    { number: "24/7", label: "Customer Support" }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-primary-500 to-accent-500 text-white">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&h=1080&fit=crop"
            alt="About StayScape"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        
        <div className="relative container mx-auto px-4 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-display font-bold mb-6"
          >
            About StayScape
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed"
          >
            Connecting travelers with exceptional accommodations worldwide through 
            innovative technology and unparalleled service.
          </motion.p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-8"
            >
              Our Mission
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-lg text-gray-700 leading-relaxed mb-12"
            >
              At StayScape, we believe that finding the perfect accommodation shouldn't be complicated or stressful. 
              Our mission is to simplify the travel booking experience while ensuring you get the best value, 
              exceptional service, and memorable stays wherever your journey takes you.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-8"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-primary-500 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-600">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Why Choose StayScape?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              We've built our platform with travelers in mind, focusing on the features that matter most to you.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 text-center hover:shadow-card-hover transition-shadow duration-300"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <ApperIcon name={feature.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Meet Our Team
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The passionate people behind StayScape who are dedicated to making your travel dreams come true.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="card p-6 text-center hover:shadow-card-hover transition-shadow duration-300"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-4 border-white shadow-lg"
                />
                <h3 className="text-xl font-display font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-500 font-medium mb-4">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gradient-to-br from-primary-50 to-accent-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
                Our Values
              </h2>
              <p className="text-xl text-gray-600">
                The principles that guide everything we do at StayScape.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-primary-500 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Users" className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    Customer First
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  Every decision we make is guided by what's best for our travelers. Your satisfaction and experience are our top priority.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="card p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-accent-500 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Zap" className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    Innovation
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We continuously innovate and improve our platform to provide you with the latest features and the best booking experience.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="card p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-success rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Shield" className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    Trust & Transparency
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We believe in honest pricing, transparent policies, and building long-term relationships based on trust and reliability.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="card p-8"
              >
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <ApperIcon name="Heart" className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold text-gray-900">
                    Passion for Travel
                  </h3>
                </div>
                <p className="text-gray-600 leading-relaxed">
                  We're travelers too, and our passion for exploration drives us to create experiences that inspire and delight.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-500 to-accent-500 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
              Join thousands of travelers who trust StayScape for their accommodation needs.
              Your perfect stay is just a search away.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="bg-white text-primary-500 hover:bg-gray-100"
                onClick={() => navigate("/hotels")}
              >
                <ApperIcon name="Search" className="w-5 h-5 mr-2" />
                Find Hotels
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-white text-white hover:bg-white/10"
                onClick={() => navigate("/signup")}
              >
                <ApperIcon name="UserPlus" className="w-5 h-5 mr-2" />
                Join StayScape
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;