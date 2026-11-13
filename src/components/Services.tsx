import React from 'react';
import { Code, Server, ShieldCheck, Cpu, Smartphone, Globe } from 'lucide-react';

export const Services: React.FC = () => {
  const servicesList = [
    {
      icon: <Code className="w-6 h-6 text-redirection-600" />,
      title: "Custom Software Development",
      description: "Bespoke web and mobile applications engineered for high performance, scalability, and robust enterprise utility."
    },
    {
      icon: <Smartphone className="w-6 h-6 text-redirection-600" />,
      title: "Mobile App Ecosystems",
      description: "End-to-end development of cross-platform applications, including logistics, marketplace, and enterprise tools."
    },
    {
      icon: <Server className="w-6 h-6 text-redirection-600" />,
      title: "Cloud Infrastructure & DevOps",
      description: "Secure, reliable cloud deployment, domain management, SSL provisioning, and continuous integration workflows."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-redirection-600" />,
      title: "Enterprise Security & Compliance",
      description: "Rigorous system hardening, data protection standards, and adherence to regulatory compliance frameworks."
    },
    {
      icon: <Cpu className="w-6 h-6 text-redirection-600" />,
      title: "System Integration",
      description: "Seamless connection of disparate APIs, payment gateways, and third-party logistics to streamline operations."
    },
    {
      icon: <Globe className="w-6 h-6 text-redirection-600" />,
      title: "Digital Transformation Consulting",
      description: "Strategic technological roadmapping to elevate business infrastructure from legacy setups to modern tech standards."
    }
  ];

  return (
    <section id="services" className="py-16 lg:py-24 bg-corporate-50 border-t border-corporate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 lg:mb-16">
          <span className="text-xs font-semibold tracking-wider text-redirection-600 uppercase bg-redirection-50 px-3 py-1 rounded-full border border-redirection-100">
            Our Expertise
          </span>
          <h2 className="mt-4 text-3xl sm:text-4xl font-bold tracking-tight text-corporate-900 font-display">
            Engineered Solutions for Modern Enterprises
          </h2>
          <p className="mt-4 text-lg text-corporate-600">
            We deliver robust, scalable, and secure technological architectures designed to drive operational efficiency and growth.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {servicesList.map((service, index) => (
            <div 
              key={index}
              className="bg-white p-8 rounded-xl border border-corporate-200 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="w-12 h-12 rounded-lg bg-redirection-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-corporate-900 mb-3 font-display">
                  {service.title}
                </h3>
                <p className="text-corporate-600 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-corporate-100 flex items-center text-xs font-semibold text-corporate-900 group-hover:text-redirection-600 transition-colors">
                <span>Learn more</span>
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;