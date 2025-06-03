import { useState, useEffect } from "react"
import founded from "../../assets/founded.jpg"
import innovation from "../../assets/innovation.jpg"
import { Star, Truck, Headphones, User, Heart, ShoppingBag, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const routes = {
  auth: {
    login: "/login"
  }
}

const Link = ({ to, children, className, ...props }) => (
  <a href={to} className={className} {...props}>{children}</a>
)

function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    
    setTimeout(() => setIsVisible(true), 100)
    
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className='w-full min-h-screen bg-gray-100'>
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between text-gray-300 shadow-lg z-50 transition-all duration-300">
        <div className="flex-shrink-0">
          <span className="font-bold text-2xl sm:text-3xl text-white">
            KZC
          </span>
        </div>
        
        <div className="hidden md:flex space-x-6 text-base lg:text-lg">
          <Link 
            to={routes.auth.login}
            className="bg-white text-gray-900 border-2 border-white px-4 lg:px-6 py-2 rounded-full hover:bg-gray-100 transition-all duration-300 hover:scale-105 transform shadow-lg"
          >
            Login
          </Link>
          <Link 
            to={routes.auth.login}
            className="bg-gray-900 border border-gray-700 px-4 lg:px-6 py-2 rounded-full hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-lg text-white"
          >
            Register
          </Link>
        </div>

        <button 
          className="md:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors duration-200"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <div className="w-6 h-6 flex flex-col justify-center space-y-1">
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></div>
            <div className={`w-full h-0.5 bg-white transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
          </div>
        </button>

        <div className={`absolute top-full left-0 w-full bg-gray-900/98 backdrop-blur-md md:hidden transition-all duration-300 ${isMobileMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
          <div className="px-4 py-6 space-y-4">
            <Link 
              to={routes.auth.login}
              className="block bg-white text-gray-900 border-2 border-white px-6 py-3 rounded-full hover:bg-gray-100 transition-all duration-300 text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Login
            </Link>
            <Link 
              to={routes.auth.login}
              className="block bg-gray-800 border border-gray-700 px-6 py-3 rounded-full hover:bg-gray-700 transition-all duration-300 text-white text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Register
            </Link>
          </div>
        </div>
      </nav>

      <section className="relative h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6">
        <div className="absolute inset-0">
          <div 
            className="absolute top-10 sm:top-20 left-5 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-gray-900/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          ></div>
          <div 
            className="absolute bottom-10 sm:bottom-20 right-5 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-gray-900/10 rounded-full blur-3xl animate-pulse"
            style={{ transform: `translateY(${scrollY * -0.3}px)` }}
          ></div>
        </div>

        <div className={`text-center z-10 px-4 sm:px-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold mb-4 sm:mb-6 text-gray-900">
            Welcome to KZC
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-700 mb-6 sm:mb-8 max-w-xs sm:max-w-2xl lg:max-w-3xl mx-auto leading-relaxed">
            Discover amazing products, unbeatable prices, and exceptional shopping experiences. 
            Your journey to finding everything you need starts here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
            <button className="w-full sm:w-auto bg-gray-900 text-gray-300 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-800 transition-all duration-300 hover:scale-105 transform shadow-xl active:scale-95">
              Start Shopping
            </button>
            <button className="w-full sm:w-auto border-2 border-gray-900 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full text-base sm:text-lg font-semibold hover:bg-gray-900 hover:text-gray-300 transition-all duration-300 hover:scale-105 transform active:scale-95">
              Learn More
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-5 sm:w-6 h-8 sm:h-10 border-2 border-gray-900/50 rounded-full flex justify-center">
            <div className="w-1 h-2 sm:h-3 bg-gray-900/70 rounded-full mt-1 sm:mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-300 transition-all duration-1000 ${scrollY > 200 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Why Choose KZC?
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                title: "Premium Quality",
                description: "Curated selection of high-quality products from trusted brands worldwide",
                delay: "delay-100",
                icon: Star
              },
              {
                title: "Fast Delivery",
                description: "Lightning-fast shipping with real-time tracking for all your orders",
                delay: "delay-200",
                icon: Truck
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock customer service to help you with any questions",
                delay: "delay-300",
                icon: Headphones
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className={`bg-gray-100/10 backdrop-blur-sm p-6 sm:p-8 rounded-2xl hover:bg-gray-100/20 transition-all duration-500 hover:scale-105 transform active:scale-95 ${scrollY > 300 ? `opacity-100 translate-y-0 ${feature.delay}` : 'opacity-0 translate-y-10'}`}
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16 mb-4 sm:mb-6 mx-auto bg-gray-300/20 rounded-full flex items-center justify-center">
                  <feature.icon 
                    size={32}
                    className="text-white"
                  />
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-gray-300 mb-3 sm:mb-4 text-center">{feature.title}</h3>
                <p className="text-sm sm:text-base text-gray-400 text-center leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center mb-12 sm:mb-16 lg:mb-20">
            <div className={`transition-all duration-1000 ${scrollY > 400 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Our Story</h3>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                Founded with a vision to revolutionize online shopping, KZC has grown from a small startup to a trusted e-commerce platform serving customers.
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                We believe that shopping should be simple, enjoyable, and accessible to everyone. That's why we've curated the finest selection of products and built a platform that prioritizes user experience above all else.
              </p>
            </div>
            <div className={`transition-all duration-1000 delay-200 ${scrollY > 400 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <img 
                src={founded}
                alt="Our Story - KZC Journey" 
                className="h-64 sm:h-80 w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 items-center">
            <div className={`lg:order-2 transition-all duration-1000 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h3 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">Innovation First</h3>
              <p className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6 leading-relaxed">
                At KZC, we're constantly pushing the boundaries of what's possible in e-commerce. 
              </p>
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed">
                Our commitment to technology and user-centric design ensures that every interaction with our platform is smooth, secure, and satisfying.
              </p>
            </div>
            <div className={`lg:order-1 transition-all duration-1000 delay-200 ${scrollY > 600 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <img 
                src={innovation}
                alt="Innovation - Technology and Design" 
                className="h-64 sm:h-80 w-full object-cover rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-300 transition-all duration-1000 ${scrollY > 800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Trusted by Thousands
          </h2>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {[
              { number: "50K+", label: "Happy Customers", delay: "delay-100" },
              { number: "100K+", label: "Products Sold", delay: "delay-200" },
              { number: "99.9%", label: "Uptime", delay: "delay-300" },
              { number: "24/7", label: "Support", delay: "delay-500" }
            ].map((stat, index) => (
              <div 
                key={index}
                className={`text-center transition-all duration-1000 ${scrollY > 900 ? `opacity-100 translate-y-0 ${stat.delay}` : 'opacity-0 translate-y-10'}`}
              >
                <div className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-300 mb-2 sm:mb-4">{stat.number}</div>
                <div className="text-sm sm:text-base lg:text-xl text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8 sm:mb-12 lg:mb-16 text-gray-900 transition-all duration-1000 ${scrollY > 1000 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            What Our Customers Say
          </h2>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {[
              {
                quote: "KZC has completely transformed my online shopping experience. The quality and service are unmatched!",
                name: "Sarah Johnson",
                role: "Verified Customer",
                delay: "delay-100",
                icon: User
              },
              {
                quote: "Fast delivery, great prices, and excellent customer support. I wouldn't shop anywhere else.",
                name: "Mike Chen",
                role: "Verified Customer", 
                delay: "delay-200",
                icon: Heart
              },
              {
                quote: "The user interface is so intuitive and the product selection is amazing. Highly recommended!",
                name: "Emily Rodriguez",
                role: "Verified Customer",
                delay: "delay-300",
                icon: ShoppingBag
              }
            ].map((testimonial, index) => (
              <div 
                key={index}
                className={`bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 hover:scale-105 transform active:scale-95 ${scrollY > 1100 ? `opacity-100 translate-x-0 ${testimonial.delay}` : `opacity-0 ${index % 2 === 0 ? '-translate-x-10' : 'translate-x-10'}`}`}
              >
                <div className="w-12 sm:w-16 h-12 sm:h-16 mb-4 sm:mb-6 mx-auto bg-gray-900/10 rounded-full flex items-center justify-center">
                  <testimonial.icon 
                    size={32}
                    className="text-gray-700"
                  />
                </div>
                <p className="text-sm sm:text-base text-gray-700 text-center mb-4 sm:mb-6 italic">"{testimonial.quote}"</p>
                <div className="text-center">
                  <div className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-gray-600 text-xs sm:text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <div className={`transition-all duration-1000 ${scrollY > 1300 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-300 mb-4 sm:mb-6">
              Stay Updated
            </h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 leading-relaxed">
              Get the latest updates on new products, exclusive deals, and special offers delivered straight to your inbox.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center max-w-sm sm:max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email"
                className="flex-1 px-4 sm:px-6 py-3 sm:py-4 rounded-full border border-gray-700 bg-gray-800 text-gray-300 placeholder-gray-500 focus:outline-none focus:border-gray-500 transition-colors duration-300 text-sm sm:text-base"
              />
              <button className="bg-gray-100 text-gray-900 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-gray-200 transition-all duration-300 hover:scale-105 transform active:scale-95 text-sm sm:text-base">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-gray-900 py-12 sm:py-16 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className={`text-center mb-8 sm:mb-12 transition-all duration-1000 ${scrollY > 1500 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <span className="font-bold text-3xl sm:text-4xl lg:text-5xl text-white mb-3 sm:mb-4 block">
              KZC
            </span>
            <p className="text-gray-400 text-sm sm:text-base lg:text-lg max-w-xl lg:max-w-2xl mx-auto leading-relaxed">
              Your premier destination for quality products and exceptional service. 
              Join our community of satisfied customers and experience the difference.
            </p>
          </div>

          <div className={`mb-8 sm:mb-12 transition-all duration-1000 delay-200 ${scrollY > 1500 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-300 text-center mb-6 sm:mb-8">Connect With Us</h3>
            <div className="flex justify-center space-x-4 sm:space-x-6 lg:space-x-8">
              {[
                { name: "Facebook", color: "hover:bg-blue-600", icon: Facebook },
                { name: "Twitter", color: "hover:bg-blue-400", icon: Twitter },
                { name: "Instagram", color: "hover:bg-pink-600", icon: Instagram },
                { name: "LinkedIn", color: "hover:bg-blue-700", icon: Linkedin }
              ].map((social, index) => (
                <div 
                  key={index}
                  className={`w-10 sm:w-12 h-10 sm:h-12 bg-gray-700 rounded-full flex items-center justify-center ${social.color} transition-all duration-300 hover:scale-110 transform cursor-pointer active:scale-95`}
                >
                  <social.icon 
                    size={20}
                    className="text-white"
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className={`sm:col-span-2 lg:col-span-2 transition-all duration-1000 delay-100 ${scrollY > 1600 ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
              <h4 className="text-gray-300 font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">About KZC</h4>
              <p className="text-gray-400 leading-relaxed mb-4 sm:mb-6 text-sm sm:text-base">
                We're passionate about delivering exceptional shopping experiences through innovative technology, 
                quality products, and outstanding customer service.
              </p>
              <div className="space-y-2 text-gray-400 text-sm sm:text-base">
                <p className="flex items-center">
                  <Mail size={16} className="text-gray-500 mr-3 flex-shrink-0" />
                  kzcorp@gmail.com
                </p>
                <p className="flex items-center">
                  <Phone size={16} className="text-gray-500 mr-3 flex-shrink-0" />
                  8-7000-KZ-CORP
                </p>
                <p className="flex items-center">
                  <MapPin size={16} className="text-gray-500 mr-3 flex-shrink-0" />
                  123 Sumakses, Village
                </p>
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-200 ${scrollY > 1600 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h4 className="text-gray-300 font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">Quick Links</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                {["New Arrivals", "Best Sellers", "Sale Items", "Gift Cards", "Size Guide"].map((link, index) => (
                  <p key={index} className="hover:text-gray-300 transition-colors duration-200 cursor-pointer hover:translate-x-1 transform">
                    {link}
                  </p>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-300 ${scrollY > 1600 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h4 className="text-gray-300 font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">Support</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                {["Contact Us", "FAQ", "Shipping Info", "Returns", "Track Order"].map((link, index) => (
                  <p key={index} className="hover:text-gray-300 transition-colors duration-200 cursor-pointer hover:translate-x-1 transform">
                    {link}
                  </p>
                ))}
              </div>
            </div>

            <div className={`transition-all duration-1000 delay-500 ${scrollY > 1600 ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
              <h4 className="text-gray-300 font-semibold mb-4 sm:mb-6 text-lg sm:text-xl">My Account</h4>
              <div className="space-y-2 sm:space-y-3 text-gray-400 text-sm sm:text-base">
                {["My Orders", "Wishlist", "Profile", "Addresses", "Payment Methods"].map((link, index) => (
                  <p key={index} className="hover:text-gray-300 transition-colors duration-200 cursor-pointer hover:translate-x-1 transform">
                    {link}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <div className={`mb-8 sm:mb-12 transition-all duration-1000 delay-300 ${scrollY > 1700 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-300 text-center mb-6 sm:mb-8">Trusted & Certified</h3>
            <div className="flex justify-center items-center space-x-6 sm:space-x-8 lg:space-x-12">
              {["SSL Secured", "ISO Certified", "Award Winner", "Verified Seller"].map((cert, index) => (
                <div key={index} className="text-center group">
                  <div className="w-12 sm:w-16 h-12 sm:h-16 bg-gray-700 rounded-full flex items-center justify-center mb-2 group-hover:bg-gray-600 transition-colors duration-300">
                    <span className="text-gray-300 font-bold text-sm sm:text-base">✓</span>
                  </div>
                  <p className="text-gray-400 text-xs sm:text-sm">{cert}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={`border-t border-gray-700 pt-6 sm:pt-8 transition-all duration-1000 delay-500 ${scrollY > 1800 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
              <p className="text-gray-400 text-xs sm:text-sm text-center lg:text-left">
                &copy; 2025 KZC. All rights reserved. Built with passion for great shopping experiences.
              </p>
              <div className="flex flex-wrap justify-center space-x-4 sm:space-x-6 text-gray-400 text-xs sm:text-sm">
                <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Privacy Policy</span>
                <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Terms of Service</span>
                <span className="hover:text-gray-300 transition-colors duration-200 cursor-pointer">Cookies</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage