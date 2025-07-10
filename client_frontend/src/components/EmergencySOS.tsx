
import React, { useState } from 'react';
import { AlertCircle, Phone } from 'lucide-react';
import { Button } from './ui/button';
import { toast } from 'sonner';

interface EmergencySOSProps {
  className?: string;
}

const EmergencySOS: React.FC<EmergencySOSProps> = ({ className }) => {
  const [sosActive, setSOSActive] = useState(false);
  
  const handleSOSClick = () => {
    if (!sosActive) {
      toast.warning("Emergency SOS activated! In a real app, this would alert authorities and emergency contacts.", {
        duration: 4000,
      });
      setSOSActive(true);
      
      // In a real app, this would trigger API calls to alert authorities
      setTimeout(() => {
        setSOSActive(false);
      }, 10000);
    } else {
      setSOSActive(false);
      toast.info("Emergency SOS deactivated");
    }
  };
  
  const handleEmergencyCall = () => {
    toast.info("In a real app, this would initiate a call to emergency services");
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <Button 
        size="lg" 
        onClick={handleSOSClick}
        className={`${sosActive ? 'animate-pulse bg-red-600 hover:bg-red-700' : 'bg-raksha-primary hover:bg-raksha-primary/90'} rounded-full h-16 mb-3`}
      >
        <AlertCircle className="mr-2" size={24} />
        {sosActive ? "CANCEL SOS" : "EMERGENCY SOS"}
      </Button>
      
      <Button 
        variant="outline"
        size="lg"
        onClick={handleEmergencyCall}
        className="border-raksha-primary text-raksha-primary hover:text-raksha-primary hover:bg-raksha-primary/10"
      >
        <Phone className="mr-2" size={20} />
        Emergency Call
      </Button>
    </div>
  );
};

export default EmergencySOS;
