import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Header from "@/components/organisms/Header";
import Footer from "@/components/organisms/Footer";
import HomePage from "@/components/pages/HomePage";
import HotelsPage from "@/components/pages/HotelsPage";
import HotelDetailsPage from "@/components/pages/HotelDetailsPage";
import BookingPage from "@/components/pages/BookingPage";
import BookingsPage from "@/components/pages/BookingsPage";
import DashboardPage from "@/components/pages/DashboardPage";
import ProfilePage from "@/components/pages/ProfilePage";
import AboutPage from "@/components/pages/AboutPage";
import AuthPage from "@/components/pages/AuthPage";
import ReviewsPage from "@/components/pages/ReviewsPage";

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/hotels" element={<HotelsPage />} />
          <Route path="/hotels/:id" element={<HotelDetailsPage />} />
          <Route path="/booking" element={<BookingPage />} />
          <Route path="/bookings" element={<BookingsPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/signup" element={<AuthPage />} />
        </Routes>
      </main>

      <Footer />
      
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        style={{ zIndex: 9999 }}
      />
    </div>
  );
}

export default App;