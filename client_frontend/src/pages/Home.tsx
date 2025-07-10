
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '@/components/AppHeader';
import SafetyScore from '@/components/SafetyScore';
import EmergencySOS from '@/components/EmergencySOS';
import CrimeMapSimple from '@/components/CrimeMapSimple';
import CrimeCards from '@/components/CrimeCards';
import SafetyTips from '@/components/SafetyTips';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, MapPin, ArrowRight, Navigation } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import QuickReportForm from '@/components/QuickReportForm';
import CrimeTrendsChart from '@/components/CrimeTrendsChart';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [trackingLocation, setTrackingLocation] = useState(false);
  const [currentLocation, setCurrentLocation] = useState("Detecting location...");

  useEffect(() => {
    // Get current location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real app, we would use reverse geocoding here
          const { latitude, longitude } = position.coords;
          // For now, just show coordinates
          setCurrentLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          setCurrentLocation("Location access denied");
        }
      );
    } else {
      setCurrentLocation("Geolocation not supported");
    }
  }, []);

  const handleViewFullMap = () => {
    navigate('/map');
  };

  const handleViewAllIncidents = () => {
    navigate('/incidents');
  };

  const handleTrackLocation = () => {
    if (trackingLocation) {
      setTrackingLocation(false);
      toast.info("Location tracking stopped");
      return;
    }

    if (navigator.geolocation) {
      setTrackingLocation(true);
      toast.success("Live location tracking enabled!");
      navigator.geolocation.watchPosition(
        (position) => {
          // In a real app, this would send location updates to a server
          console.log("Location updated:", position.coords);
        },
        (error) => {
          console.error("Error tracking location:", error);
          toast.error("Could not track location. Please check permissions.");
          setTrackingLocation(false);
        },
        { enableHighAccuracy: true }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Home" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Hero section */}
        <section className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-raksha-secondary">
              Hello, <span className="text-raksha-primary">User</span>
            </h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className={`text-xs border ${trackingLocation ? 'bg-raksha-primary text-white' : 'border-raksha-primary text-raksha-primary'}`}
                onClick={handleTrackLocation}
              >
                <Navigation size={14} className="mr-1" />
                {trackingLocation ? 'Tracking On' : 'Track Me'}
              </Button>
              <Button variant="outline" size="sm" className="text-xs border-raksha-primary text-raksha-primary">
                <MapPin size={14} className="mr-1" />
                {currentLocation}
              </Button>
            </div>
          </div>
          <p className="text-gray-600 text-sm mt-1">Stay safe with RakshaSetu</p>
        </section>
        
        {/* Quick Report Dialog */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="w-full bg-raksha-primary hover:bg-raksha-primary/90 mb-6">
              <AlertTriangle size={18} className="mr-2" />
              Report Incident Quickly
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Quick Incident Report</DialogTitle>
            </DialogHeader>
            <QuickReportForm />
          </DialogContent>
        </Dialog>
        
        {/* Safety Score */}
        <SafetyScore score={85} className="mb-6" />
        
        {/* Emergency SOS Button */}
        <EmergencySOS className="mb-6" />
        
        {/* Interactive Crime Map */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-raksha-secondary">Crime Map</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-raksha-primary flex items-center"
              onClick={handleViewFullMap}
            >
              Full Map <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div onClick={handleViewFullMap} className="cursor-pointer">
            <CrimeMapSimple className="h-64" />
          </div>
        </div>
        
        {/* Recent Crime Incidents */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-raksha-secondary">Recent Incidents</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-raksha-primary flex items-center"
              onClick={handleViewAllIncidents}
            >
              View All <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <CrimeCards limit={2} />
        </div>
        
        {/* Historical Crime Charts */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold text-raksha-secondary">Crime Trends</h2>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-raksha-primary flex items-center"
              onClick={() => navigate('/trends')}
            >
              View Details <ArrowRight size={16} className="ml-1" />
            </Button>
          </div>
          <div className="bg-white shadow rounded-lg p-4">
            <CrimeTrendsChart />
          </div>
        </div>
        
        {/* Safety Tips */}
        <SafetyTips className="mt-6" />
      </main>
    </div>
  );
};

export default Home;
