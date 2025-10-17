"use client";

export default function Testimonials() {
  const testimonials = [
    {
      id: 1,
      name: "Ahmed Hassan",
      initials: "AH",
      quote:
        "Found the perfect vintage Nike Air Max at an unbeatable price. Quality is amazing!",
      rating: 5,
    },
    {
      id: 2,
      name: "Fatima Khan",
      initials: "FK",
      quote:
        "SoleBazar has the best collection of thrifted sneakers in Karachi. Highly recommend!",
      rating: 5,
    },
    {
      id: 3,
      name: "Hassan Ali",
      initials: "HA",
      quote:
        "Great customer service and authentic shoes. Will definitely order again!",
      rating: 5,
    },
    {
      id: 4,
      name: "Zara Malik",
      initials: "ZM",
      quote:
        "Love the aesthetic of the website and the quality of the shoes. Worth every penny!",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 bg-[#FAFAF7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-[#2B2B2B] mb-12 text-center">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all"
            >
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <span key={i} className="text-[#7C8C5C] text-lg">
                    ★
                  </span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-[#555] mb-6 leading-relaxed italic">
                "{testimonial.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#7C8C5C] text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {testimonial.initials}
                </div>
                <p className="font-semibold text-[#2B2B2B]">
                  {testimonial.name}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
