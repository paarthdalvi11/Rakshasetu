
import React, { useState, useEffect } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Calendar, Filter, Layers, MapPin } from 'lucide-react';

const Map: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Crime Map" />
      
      <main className="flex-1 relative flex flex-col">
        {/* Map container - in real app, this would be a real map component */}
        <div className="flex-1 bg-gray-100 relative">
          <img 
            src="https://api.mapbox.com/styles/v1/mapbox/light-v11/static/77.2,28.6,10/800x600@2x?access_token=pk.eyJ1IjoibG92YWJsZWRldiIsImEiOiJjbDdxb3FmbmEwOWlqM3BxdWw2M2NwZms3In0.ptj3R3GnfnuW6XGW5spFsQ"
            alt="Crime Map" 
            className="w-full h-full object-cover"
          />
          
          {/* Crime markers would be rendered here in a real app */}
          <div className="absolute inset-0">
            {/* Example crime markers */}
            <div className="crime-marker high absolute" style={{ left: '40%', top: '30%' }}></div>
            <div className="crime-marker medium absolute" style={{ left: '60%', top: '40%' }}></div>
            <div className="crime-marker low absolute" style={{ left: '45%', top: '50%' }}></div>
            <div className="crime-marker high absolute" style={{ left: '70%', top: '35%' }}></div>
            <div className="crime-marker medium absolute" style={{ left: '55%', top: '60%' }}></div>
          </div>
        </div>
        
        {/* Map search bar */}
        <div className="absolute top-3 left-3 right-3 bg-white rounded-md px-3 py-2.5 shadow-md flex items-center">
          <MapPin size={16} className="text-raksha-primary mr-2" />
          <input 
            type="text" 
            placeholder="Search area or address"
            className="bg-transparent border-none outline-none flex-1 text-sm"
          />
        </div>
        
        {/* Map controls - Updated with darker background */}
        <div className="absolute bottom-24 right-4 flex flex-col space-y-2">
          <Button 
            size="icon" 
            variant={filterOpen ? "default" : "secondary"}
            className={filterOpen ? "bg-raksha-primary" : "bg-raksha-primary text-white border border-gray-300 shadow-md"}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={18} className="text-white" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-raksha-primary text-white border border-gray-300 shadow-md"
          >
            <Layers size={18} className="text-white" />
          </Button>
          <Button 
            size="icon" 
            variant="secondary" 
            className="bg-raksha-primary text-white border border-gray-300 shadow-md"
          >
            <Calendar size={18} className="text-white" />
          </Button>
        </div>
        
        {/* Filter panel */}
        {filterOpen && (
          <div className="absolute bottom-24 right-16 w-64 bg-white rounded-lg shadow-lg p-4">
            <h3 className="text-sm font-semibold mb-3">Filter Incidents</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-gray-700">Incident Type</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {['Theft', 'Accident', 'Suspicious', 'Robbery'].map((type) => (
                    <Button 
                      key={type} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Time Period</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {['Today', 'This Week', 'This Month', 'Custom'].map((period) => (
                    <Button 
                      key={period} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      {period}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-xs font-medium text-gray-700">Severity</label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {['High', 'Medium', 'Low'].map((severity) => (
                    <Button 
                      key={severity} 
                      variant="outline" 
                      size="sm"
                      className="text-xs"
                    >
                      {severity}
                    </Button>
                  ))}
                </div>
              </div>
              
              <div className="pt-2 flex space-x-2">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  Reset
                </Button>
                <Button size="sm" variant="default" className="flex-1 text-xs bg-raksha-primary">
                  Apply
                </Button>
              </div>
            </div>
          </div>
        )}
        
        {/* Report Button */}
        <div className="absolute bottom-24 left-0 right-0 flex justify-center">
          <Button 
            className="bg-raksha-primary hover:bg-raksha-primary/90 shadow-lg px-8"
            size="lg"
          >
            Report Incident
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Map;
