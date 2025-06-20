import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="text-2xl font-bold text-gray-900">
              doc<span className="text-primary">Flow</span>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-primary font-medium border-b-2 border-primary pb-2">COMPRESS IMAGE</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">RESIZE IMAGE</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">CROP IMAGE</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">CONVERT TO JPG</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 font-medium">PHOTO EDITOR</a>
            <div className="relative">
              <button className="text-gray-600 hover:text-gray-900 font-medium flex items-center">
                MORE TOOLS <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          </nav>
          
          {/* Auth Buttons */}
          <div className="flex items-center space-x-3">
            <button className="text-gray-600 hover:text-gray-900 font-medium">Login</button>
            <Button className="bg-primary text-white hover:bg-blue-700 font-medium">Sign up</Button>
            <button className="md:hidden text-gray-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
