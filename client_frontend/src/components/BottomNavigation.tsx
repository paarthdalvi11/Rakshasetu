
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AlertTriangle, Home, Map, Shield, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

const BottomNavigation: React.FC = () => {
  const location = useLocation();
  
  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Map, label: "Map", path: "/map" },
    { icon: AlertTriangle, label: "Report", path: "/report" },
    { icon: Shield, label: "Safety", path: "/safety" },
    { icon: UserCircle, label: "Profile", path: "/profile" },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
      <div className="flex justify-around items-center">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center py-2 px-4 flex-1 text-sm",
                isActive 
                  ? "text-raksha-primary font-medium" 
                  : "text-gray-600"
              )}
            >
              <item.icon size={20} className={cn(isActive && "text-raksha-primary")} />
              <span className="mt-1 text-xs">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNavigation;
