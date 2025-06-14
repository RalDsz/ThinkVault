import React, { useState, useEffect } from 'react';
import { Video, Users, Calendar, ArrowRight, Sparkles, Zap, Shield } from 'lucide-react';
import Navbar from './components/Navbar';

const LandingPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleButtonClick = () => {
    window.location.href = '/home';
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-hidden relative">
      {/* Animated background gradient */}
      <div 
        className="fixed inset-0 opacity-30 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(34, 197, 94, 0.1), transparent 40%)`
        }}
      />
      
      {/* Floating particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-green-400 rounded-full opacity-20 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Navbar */}
      <Navbar />
      {/* Hero Section */}
      <section className={`text-center px-8 py-24 relative transition-all duration-1500 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-900/5 to-transparent" />
        
        <div className="relative z-10">
          <div className="inline-flex items-center bg-gray-900/50 border border-green-400/20 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
            <Zap className="w-4 h-4 text-green-400 mr-2" />
            <span className="text-sm text-gray-300">Now with AI-powered insights</span>
          </div>
          
          <h2 className="text-6xl md:text-7xl font-extrabold leading-tight mb-6 bg-gradient-to-r from-white via-gray-100 to-gray-300 bg-clip-text text-transparent">
            Plan Projects.{' '}
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent animate-pulse">
              Sync Teams.
            </span>
            <br />
            All in One Place.
          </h2>
          
          <p className="text-gray-400 text-xl max-w-3xl mx-auto mb-12 leading-relaxed">
            Organize your work, set priorities, and jump on video calls — all from a sleek dashboard designed for real teams that ship fast.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button 
              onClick={handleButtonClick}
              className="group bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold px-8 py-4 rounded-full text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/30 active:scale-95 flex items-center"
            >
              Get Started Free 
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            
            <button className="text-gray-300 hover:text-white font-medium px-8 py-4 rounded-full border border-gray-700 hover:border-gray-600 transition-all duration-300 hover:bg-gray-900/50">
              Watch Demo
            </button>
          </div>
          
          <div className="flex items-center justify-center mt-8 space-x-8 text-sm text-gray-500">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-1 text-green-400" />
              No credit card required
            </div>
            <div>14-day free trial</div>
            <div>Cancel anytime</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`grid md:grid-cols-3 gap-8 px-10 py-20 relative transition-all duration-1500 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-900/20 to-transparent" />
        
        {[
          {
            icon: Calendar,
            title: "Smart Project Planning",
            description: "Create tasks, set deadlines, and drag them across boards like magic. AI suggests optimal timelines.",
            color: "from-blue-400 to-cyan-500"
          },
          {
            icon: Users,
            title: "Real-Time Collaboration",
            description: "Tag teammates, assign roles, and collaborate in real time. See who's working on what, instantly.",
            color: "from-purple-400 to-pink-500"
          },
          {
            icon: Video,
            title: "Integrated Video Calls",
            description: "Start instant video calls with your team, directly from a project card. No more app switching.",
            color: "from-green-400 to-emerald-500"
          }
        ].map((feature, index) => (
          <div 
            key={index}
            className="group p-8 bg-gradient-to-br from-gray-900/50 to-gray-800/30 rounded-2xl border border-gray-700/50 hover:border-gray-600/50 backdrop-blur-sm transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl relative overflow-hidden"
          >
            <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
            
            <div className="relative z-10">
              <div className={`w-16 h-16 mx-auto mb-6 rounded-2xl bg-gradient-to-br ${feature.color} p-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-full h-full text-white" />
              </div>
              
              <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                {feature.title}
              </h3>
              
              <p className="text-gray-400 group-hover:text-gray-300 transition-colors leading-relaxed">
                {feature.description}
              </p>
            </div>
          </div>
        ))}
      </section>

      {/* Call to Action */}
      <section className={`px-10 py-20 text-center relative transition-all duration-1500 delay-900 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/10 via-transparent to-green-900/10" />
        
        <div className="relative z-10 max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            Your dream project deserves better tools.
          </h2>
          
          <p className="text-gray-400 text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            ThinkVault makes your planning and communication seamless. No more switching apps, no more missed deadlines.
          </p>
          
          <button 
            onClick={handleButtonClick}
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-black font-semibold px-10 py-4 rounded-full text-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-green-400/30 active:scale-95 mb-8"
          >
            Join Now — It's Free
          </button>
          
          <div className="text-sm text-gray-500">
            Join 10,000+ teams already using ThinkVault
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`text-center text-gray-500 py-8 border-t border-gray-800/50 backdrop-blur-sm bg-black/50 transition-all duration-1500 delay-1200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
        <p className="flex items-center justify-center">
          © 2025 ThinkVault. Built with 
          <span className="text-red-400 mx-1 animate-pulse">❤️</span> 
          for teams that dream big.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;