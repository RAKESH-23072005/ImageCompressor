import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, Image, Crop, RotateCcw, Palette, Settings } from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [, setLocation] = useLocation();

  const navigationItems = [
    { label: "COMPRESS IMAGE", href: "/", icon: Image, active: true },
    { label: "RESIZE IMAGE", href: "#", icon: RotateCcw },
    { label: "CROP IMAGE", href: "#", icon: Crop },
    { label: "CONVERT TO JPG", href: "#", icon: Image },
    { label: "PHOTO EDITOR", href: "#", icon: Palette },
  ];

  return (
    <header className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-40 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <div 
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:scale-105 transition-transform duration-200"
              onClick={() => setLocation('/')}
            >
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                doc
              </span>
              <span className="text-primary font-extrabold">Flow</span>
            </div>
          </div>
          
          {/* Enhanced Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`group relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 flex items-center space-x-2 ${
                  item.active
                    ? 'text-primary bg-blue-50 border-2 border-primary/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <item.icon className="w-4 h-4" />
                <span>{item.label}</span>
                {item.active && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                )}
              </a>
            ))}
            
            <div className="relative group">
              <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
                <Settings className="w-4 h-4 mr-2" />
                MORE TOOLS 
                <ChevronDown className="ml-1 h-4 w-4 group-hover:rotate-180 transition-transform duration-200" />
              </button>
            </div>
          </nav>
          
          {/* Enhanced Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-gray-900 font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-all duration-200">
              Login
            </button>
            <Button className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 font-medium px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
              Sign up
            </Button>
            
            {/* Mobile Menu Button */}
            <button 
              className="lg:hidden text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-50 transition-all duration-200"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Enhanced Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 shadow-xl z-50">
          <div className="px-4 py-4 space-y-2">
            {navigationItems.map((item, index) => (
              <a
                key={index}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                  item.active
                    ? 'text-primary bg-blue-50 border border-primary/20'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </a>
            ))}
            <button className="flex items-center space-x-3 px-4 py-3 rounded-lg font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 w-full">
              <Settings className="w-5 h-5" />
              <span>MORE TOOLS</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
