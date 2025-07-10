
import React, { useState } from 'react';
import { MapPin, Filter, PlusCircle } from 'lucide-react';
import { Button } from './ui/button';

interface CrimeMapProps {
  className?: string;
}

// Mock crime data points
const mockCrimePoints = [
  { id: 1, lat: '28.7', lng: '77.1', type: 'Theft', severity: 'medium' },
  { id: 2, lat: '28.65', lng: '77.2', type: 'Assault', severity: 'high' },
  { id: 3, lat: '28.55', lng: '77.15', type: 'Suspicious', severity: 'low' },
  { id: 4, lat: '28.6', lng: '77.25', type: 'Robbery', severity: 'high' },
  { id: 5, lat: '28.72', lng: '77.05', type: 'Theft', severity: 'medium' },
];

const CrimeMapSimple: React.FC<CrimeMapProps> = ({ className }) => {
  const [mapLoaded, setMapLoaded] = useState(true);
  
  return (
    <div className={`relative rounded-lg overflow-hidden border border-gray-200 bg-gray-100 ${className}`}>
      {!mapLoaded ? (
        <div className="w-full h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-raksha-primary"></div>
        </div>
      ) : (
        <>
          {/* Map placeholder - in a real app, this would be a real map component */}
          <div className="w-full h-full bg-white">
            <img 
              src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/77.2,28.6,11/400x300@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDdxb3FmbmEwOWlqM3BxdWw2M2NwZms3In0.ptj3R3GnfnuW6XGW5spFsQ"
              alt="Crime Map" 
              className="w-full h-full object-cover"
            />
            {/* This is just a placeholder. In a real app, we would use a proper Map component */}
            <div className="absolute inset-0 pointer-events-none">
              {mockCrimePoints.map((point) => (
                <div 
                  key={point.id}
                  className={`crime-marker ${point.severity} absolute`}
                  style={{ 
                    left: `calc(${parseFloat(point.lng) - 77}% * 10 + 50%)`, 
                    top: `calc(${28.7 - parseFloat(point.lat)}% * 10 + 50%)`
                  }}
                ></div>
              ))}
            </div>
          </div>
          
          {/* Map controls */}
          <div className="absolute bottom-4 right-4 flex flex-col space-y-2">
            <Button size="icon" variant="secondary" className="bg-white shadow-md">
              <Filter size={18} />
            </Button>
            <Button size="icon" variant="default" className="bg-raksha-primary shadow-md">
              <PlusCircle size={18} />
            </Button>
          </div>
          
          <div className="absolute top-3 left-3 right-3 bg-white/90 backdrop-blur-sm rounded-md px-3 py-2 shadow-sm flex items-center">
            <MapPin size={16} className="text-raksha-primary mr-1.5" />
            <span className="text-sm text-gray-800">New Delhi, India</span>
          </div>
        </>
      )}
    </div>
  );
};

export default CrimeMapSimple;
