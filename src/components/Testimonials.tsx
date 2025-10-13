import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      review: "Kovari has saved us countless hours by streamlining our processes. What used to take days now happens in hours.",
      name: "Sarah Mitchell",
      title: "Senior Product Manager",
      company: "TechFlow Solutions",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "Our team collaboration has greatly improved thanks to the real-time updates. Everyone stays in sync effortlessly.",
      name: "James Rodriguez",
      title: "Head of Product Operations",
      company: "InnovateCorp",
      image: "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "The platform's customisation options have allowed us to perfectly tailor our workflows to our specific needs. It's like having a bespoke solution.",
      name: "Emily Chen",
      title: "Director of Product Management",
      company: "Streamline Dynamics",
      image: "https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    },
    {
      review: "Using this system has significantly boosted our productivity and efficiency. Our team delivers results faster than ever before.",
      name: "Michael Thompson",
      title: "VP of Product Strategy",
      company: "Efficiency Partners",
      image: "https://images.pexels.com/photos/1043473/pexels-photo-1043473.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face"
    }
  ];

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  };

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(nextTestimonial, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="testimonials" className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What Our Clients Say
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-300">
          </p>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Discover how teams worldwide are transforming their operations with Kovari.
          </p>
        </div>

        <div className="relative">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 md:p-12 shadow-lg border border-gray-200 dark:border-gray-700 min-h-[300px] flex items-center">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 md:p-12 shadow-lg border-4 border-primary-600 dark:border-primary-600 min-h-[280px] sm:min-h-[300px] flex items-center">
            <div className="w-full text-center px-2 sm:px-0">
              {/* Star Rating */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-accent-500 text-accent-500" />
                ))}
              </div>

              {/* Review Text */}
              <blockquote className="text-lg sm:text-xl md:text-2xl text-gray-900 dark:text-white italic mb-6 sm:mb-8 leading-relaxed">
                "{testimonials[currentIndex].review}"
              </blockquote>

              {/* Reviewer Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <img 
                  src={testimonials[currentIndex].image} 
                  alt={testimonials[currentIndex].name}
                  className="w-14 sm:w-16 h-14 sm:h-16 rounded-full object-cover border-2 border-primary-400"
                />
                <div className="text-center sm:text-left">
                  <div className="font-semibold text-gray-900 dark:text-white text-base sm:text-lg">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                    {testimonials[currentIndex].title}
                  </div>
                  <div className="text-gray-500 dark:text-gray-500 text-sm">
                    {testimonials[currentIndex].company}
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>

          {/* Navigation Buttons */}
          <button 
            onClick={prevTestimonial}
            className="absolute left-2 sm:left-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>
          <button 
            onClick={nextTestimonial}
            className="absolute right-2 sm:right-4 top-1/2 transform -translate-y-1/2 p-2 sm:p-3 bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-full shadow-lg border border-gray-200 dark:border-gray-600 transition-all duration-200 hover:scale-110 min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-300" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-2 mt-8">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center ${
                  index === currentIndex 
                    ? 'bg-primary-600 scale-110' 
                    : 'bg-gray-400 hover:bg-gray-500'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${
                  index === currentIndex 
                    ? 'bg-primary-600' 
                    : 'bg-gray-400'
                }`}></span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;