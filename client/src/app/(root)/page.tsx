"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Heart, Shield, Users, Star } from "lucide-react";

export default function LandingPage() {

  const features = [
    {
      icon: <Heart className="w-8 h-8 text-amber-600" />,
      title: "Expert Ayurvedic Care",
      description:
        "Traditional healing methods combined with modern medical expertise for holistic wellness",
    },
    {
      icon: <Shield className="w-8 h-8 text-amber-600" />,
      title: "Certified Practitioners",
      description:
        "Licensed Ayurvedic doctors with years of experience in traditional medicine",
    },
    {
      icon: <Users className="w-8 h-8 text-amber-600" />,
      title: "Personalized Treatment",
      description:
        "Customized wellness plans tailored to your unique body constitution and health needs",
    },
  ];

  const services = [
    {
      title: "Consultation",
      description: "One-on-one sessions with expert Ayurvedic practitioners",
      image:
        "https://plus.unsplash.com/premium_photo-1681966826227-d008a1cfe9c7?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Panchakarma Therapy",
      description: "Detoxification and rejuvenation treatments",
      image:
        "https://plus.unsplash.com/premium_photo-1689254723664-e6aadbb251d1?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      title: "Herbal Medicine",
      description: "Natural remedies and supplements for holistic healing",
      image:
        "https://plus.unsplash.com/premium_photo-1723928419895-525187cc1be1?q=80&w=738&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Patient",
      content:
        "The personalized treatment plan transformed my health completely. Highly recommend!",
      rating: 5,
    },
    {
      name: "Rahul Patel",
      role: "Patient",
      content:
        "Professional care with authentic Ayurvedic practices. Life-changing experience!",
      rating: 5,
    },
    {
      name: "Anita Desai",
      role: "Patient",
      content:
        "Finally found relief from chronic issues after years of trying different treatments.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen theme-bg">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                Discover the Power of
                <span className="text-amber-600"> Ayurvedic Healing</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                Experience authentic Ayurvedic treatments with certified
                practitioners. Your journey to holistic wellness starts here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link href="/auth" className="button-class px-8 py-3">
                  Book Consultation
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Link>
                <button className="button-outline-class px-8 py-3">
                  Learn More
                </button>
              </div>
            </div>
            <div className="relative">
              <div className="relative w-full h-96 lg:h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1569936906148-06de87cb0681?q=80&w=1176&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Ayurvedic Healing"
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Choose Amrutam
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine ancient wisdom with modern expertise to provide you
              with the best Ayurvedic care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-amber-50/50 hover:bg-amber-100/50 transition-colors"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-amber-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Services
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive Ayurvedic treatments tailored to your individual
              needs
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button className="text-amber-600 hover:text-amber-700 font-medium flex items-center">
                    Learn More
                    <ChevronRight className="ml-1 w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Patients Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Real stories from people who transformed their health with
              Ayurveda
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-amber-50/30 p-6 rounded-2xl">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 text-amber-500 fill-current"
                    />
                  ))}
                </div>
                <p className="text-gray-700 mb-4 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-gray-900">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-amber-600 to-orange-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Wellness Journey?
          </h2>
          <p className="text-xl text-amber-100 mb-8">
            Join thousands who have transformed their health with authentic
            Ayurvedic care
          </p>
          <Link
            href="/auth"
            className="bg-white text-amber-600 px-8 py-3 rounded-lg text-lg font-semibold hover:bg-amber-50 transition-colors"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
}
