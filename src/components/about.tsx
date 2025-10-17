"use client";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="animate-fade-in-up">
            <div className="relative aspect-square bg-gradient-to-br from-[#F5EBDC] to-[#E8DCC8] rounded-2xl shadow-lg overflow-hidden">
              <img
                src="/vintage-shoes-collection-thrift-aesthetic.jpg"
                alt="Vintage shoes collection"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="animate-slide-in-right">
            <h2 className="text-4xl font-bold text-[#2B2B2B] mb-6">
              Our Story
            </h2>
            <p className="text-lg text-[#555] leading-relaxed mb-6">
              SoleBazar was born from a passion for finding hidden gems in the
              world of thrifted sneakers. Founded by Khubaib Shah, a MERN Stack
              Developer from Karachi, Pakistan, SoleBazar combines a love for
              streetwear culture with the thrill of discovering authentic,
              high-quality branded shoes.
            </p>
            <p className="text-lg text-[#555] leading-relaxed mb-8">
              We believe that everyone deserves access to premium branded
              footwear without breaking the bank. Each shoe in our collection is
              carefully curated and authenticated, ensuring you get the best
              quality at thrift prices. From Nike to Adidas, Puma to other
              premium brands, we've got your sole covered.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 p-4 bg-[#F5EBDC] rounded-lg">
                <p className="text-2xl font-bold text-[#7C8C5C]">100+</p>
                <p className="text-sm text-[#2B2B2B]">Shoes Curated</p>
              </div>
              <div className="flex-1 p-4 bg-[#F5EBDC] rounded-lg">
                <p className="text-2xl font-bold text-[#7C8C5C]">500+</p>
                <p className="text-sm text-[#2B2B2B]">Happy Customers</p>
              </div>
              <div className="flex-1 p-4 bg-[#F5EBDC] rounded-lg">
                <p className="text-2xl font-bold text-[#7C8C5C]">Karachi</p>
                <p className="text-sm text-[#2B2B2B]">Based in PK</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
