
import React from 'react';
import { Phone } from 'lucide-react';
import { Button } from './ui/button';
import NotificationBadge from './NotificationBadge';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

// Sample notifications data
const sampleNotifications = [
  {
    id: '1',
    title: 'Investigation Update',
    description: 'The theft reported at Central Market is under investigation. Case #RT45672',
    time: '2 hours ago'
  },
  {
    id: '2',
    title: 'Crime Trend Alert',
    description: 'Increase in phone snatching incidents reported in Westside area. Stay vigilant.',
    time: '5 hours ago'
  },
  {
    id: '3',
    title: 'Report Verified',
    description: 'Your harassment report from yesterday has been verified. Thank you for your contribution.',
    time: '1 day ago'
  }
];

// Sample emergency helplines
const emergencyHelplines = [
  { name: "Police Control Room", number: "100", type: "emergency" },
  { name: "Women Helpline", number: "1091", type: "emergency" },
  { name: "Child Helpline", number: "1098", type: "emergency" },
  { name: "Fire Department", number: "101", type: "emergency" },
  { name: "Ambulance", number: "108", type: "emergency" },
  { name: "National Emergency Number", number: "112", type: "emergency" },
  { name: "Anti-Stalking Helpline", number: "1091", type: "police" },
  { name: "Senior Citizen Helpline", number: "14567", type: "police" },
  { name: "Nearest Police Station", number: "011-2336-7878", type: "police" },
  { name: "Railway Protection", number: "1322", type: "transportation" },
  { name: "Nearest Hospital", number: "011-2675-5555", type: "medical" },
  { name: "Blood Bank", number: "1910", type: "medical" },
  { name: "Disaster Management", number: "1077", type: "disaster" },
  { name: "Road Accident Emergency", number: "1073", type: "transportation" }
];

interface AppHeaderProps {
  title: string;
  onMenuClick?: () => void;
}

const AppHeader: React.FC<AppHeaderProps> = ({ title, onMenuClick }) => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
      <div className="flex items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-semibold text-raksha-secondary">
            <span className="text-raksha-primary">Raksha</span>Setu
          </h1>
          {title && title !== "Home" && (
            <span className="ml-2 text-lg text-gray-700">| {title}</span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-1">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Phone size={20} className="text-raksha-primary" />
            </Button>
          </DialogTrigger>
          <DialogContent className="h-[70vh] flex flex-col">
            <DialogHeader>
              <DialogTitle>Emergency Helplines</DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 pr-4">
              <div className="mt-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-raksha-primary mb-2">Emergency Numbers</h3>
                  <div className="space-y-2">
                    {emergencyHelplines
                      .filter(helpline => helpline.type === "emergency")
                      .map(helpline => (
                        <div key={helpline.name} className="flex justify-between items-center p-2 border-b border-gray-100">
                          <span className="text-sm">{helpline.name}</span>
                          <a 
                            href={`tel:${helpline.number}`} 
                            className="bg-raksha-primary text-white px-3 py-1 rounded-full text-xs flex items-center"
                          >
                            <Phone size={12} className="mr-1" />
                            {helpline.number}
                          </a>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-raksha-secondary mb-2">Police Helplines</h3>
                  <div className="space-y-2">
                    {emergencyHelplines
                      .filter(helpline => helpline.type === "police")
                      .map(helpline => (
                        <div key={helpline.name} className="flex justify-between items-center p-2 border-b border-gray-100">
                          <span className="text-sm">{helpline.name}</span>
                          <a 
                            href={`tel:${helpline.number}`} 
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs flex items-center"
                          >
                            <Phone size={12} className="mr-1" />
                            {helpline.number}
                          </a>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-raksha-secondary mb-2">Medical Helplines</h3>
                  <div className="space-y-2">
                    {emergencyHelplines
                      .filter(helpline => helpline.type === "medical")
                      .map(helpline => (
                        <div key={helpline.name} className="flex justify-between items-center p-2 border-b border-gray-100">
                          <span className="text-sm">{helpline.name}</span>
                          <a 
                            href={`tel:${helpline.number}`} 
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs flex items-center"
                          >
                            <Phone size={12} className="mr-1" />
                            {helpline.number}
                          </a>
                        </div>
                      ))
                    }
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-raksha-secondary mb-2">Other Helplines</h3>
                  <div className="space-y-2">
                    {emergencyHelplines
                      .filter(helpline => !["emergency", "police", "medical"].includes(helpline.type))
                      .map(helpline => (
                        <div key={helpline.name} className="flex justify-between items-center p-2 border-b border-gray-100">
                          <span className="text-sm">{helpline.name}</span>
                          <a 
                            href={`tel:${helpline.number}`} 
                            className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-xs flex items-center"
                          >
                            <Phone size={12} className="mr-1" />
                            {helpline.number}
                          </a>
                        </div>
                      ))
                    }
                  </div>
                </div>
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <NotificationBadge notifications={sampleNotifications} />
      </div>
    </header>
  );
};

export default AppHeader;
