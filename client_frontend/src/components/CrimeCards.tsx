
import React from 'react';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { Button } from './ui/button';

interface CrimeIncident {
  id: string;
  type: string;
  location: string;
  date: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
}

const mockCrimes: CrimeIncident[] = [
  {
    id: '1',
    type: 'Theft',
    location: 'Central Park, West Zone',
    date: '2 hours ago',
    severity: 'medium',
    description: 'Phone snatching reported near jogging track'
  },
  {
    id: '2',
    type: 'Suspicious Activity',
    location: 'Downtown Metro Station',
    date: '4 hours ago',
    severity: 'low',
    description: 'Suspicious person loitering near ticket counter'
  },
  {
    id: '3',
    type: 'Assault',
    location: 'Night Market, South Avenue',
    date: 'Yesterday',
    severity: 'high',
    description: 'Physical altercation between two groups'
  }
];

interface CrimeCardsProps {
  limit?: number;
}

const CrimeCards: React.FC<CrimeCardsProps> = ({ limit = 3 }) => {
  const displayCrimes = mockCrimes.slice(0, limit);
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-raksha-primary';
      case 'medium':
        return 'bg-raksha-warning';
      default:
        return 'bg-raksha-accent';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-raksha-secondary">Recent Incidents</h2>
        <Button variant="ghost" size="sm" className="text-raksha-primary flex items-center">
          View All <ArrowRight size={16} className="ml-1" />
        </Button>
      </div>
      
      <div className="space-y-3">
        {displayCrimes.map(crime => (
          <div 
            key={crime.id}
            className="border border-gray-100 rounded-lg p-3 bg-white shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center">
                  <div className={`w-2 h-2 rounded-full mr-2 ${getSeverityColor(crime.severity)}`}></div>
                  <h3 className="font-medium text-gray-900">{crime.type}</h3>
                </div>
                
                <div className="mt-2 space-y-1">
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-1" />
                    <span>{crime.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={14} className="mr-1" />
                    <span>{crime.date}</span>
                  </div>
                </div>
                
                <p className="mt-2 text-sm text-gray-700">{crime.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CrimeCards;
