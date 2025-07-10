
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { 
  Calendar, 
  FilterX, 
  Filter, 
  ChevronDown, 
  AlertTriangle, 
  MapPin,
  Clock
} from 'lucide-react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// Mock incidents data
const mockIncidents = [
  {
    id: 1,
    type: 'Theft',
    description: 'Mobile phone snatching incident near Central Market',
    location: 'Central Market, New Delhi',
    time: '2 hours ago',
    status: 'Under Investigation',
    severity: 'medium'
  },
  {
    id: 2,
    type: 'Accident',
    description: 'Two-wheeler accident at Main Road junction',
    location: 'Main Road, New Delhi',
    time: '5 hours ago',
    status: 'Resolved',
    severity: 'high'
  },
  {
    id: 3,
    type: 'Suspicious',
    description: 'Suspicious activity reported near bank ATM',
    location: 'State Bank ATM, South Extension',
    time: '1 day ago',
    status: 'Verified',
    severity: 'low'
  },
  {
    id: 4,
    type: 'Harassment',
    description: 'Street harassment reported at North Avenue',
    location: 'North Avenue, New Delhi',
    time: '2 days ago',
    status: 'Under Investigation',
    severity: 'medium'
  },
  {
    id: 5,
    type: 'Theft',
    description: 'Bike stolen from parking lot',
    location: 'City Mall Parking, New Delhi',
    time: '2 days ago',
    status: 'Reported',
    severity: 'medium'
  },
  {
    id: 6,
    type: 'Accident',
    description: 'Car accident at highway intersection',
    location: 'NH-8 Junction, Delhi-Gurgaon Border',
    time: '3 days ago',
    status: 'Resolved',
    severity: 'high'
  }
];

const Incidents: React.FC = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [timeFilter, setTimeFilter] = useState<string | null>(null);
  
  const filteredIncidents = mockIncidents.filter(incident => {
    if (typeFilter && incident.type !== typeFilter) return false;
    if (statusFilter && incident.status !== statusFilter) return false;
    // Time filter would need more logic in a real app
    return true;
  });
  
  const clearFilters = () => {
    setTypeFilter(null);
    setStatusFilter(null);
    setTimeFilter(null);
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Under Investigation': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      case 'Verified': return 'bg-purple-100 text-purple-800';
      case 'Reported': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-orange-500';
      case 'low': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };
  
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="All Incidents" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Filters Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-raksha-secondary">Reported Incidents</h2>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <Filter size={16} className="mr-1.5" />
            Filters
            <ChevronDown size={14} className="ml-1.5" />
          </Button>
        </div>
        
        {filterOpen && (
          <div className="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-100">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Incident Type</label>
                <Select value={typeFilter || ''} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="Theft">Theft</SelectItem>
                    <SelectItem value="Accident">Accident</SelectItem>
                    <SelectItem value="Suspicious">Suspicious</SelectItem>
                    <SelectItem value="Harassment">Harassment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <label className="text-xs text-gray-600 mb-1 block">Status</label>
                <Select value={statusFilter || ''} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Any Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any Status</SelectItem>
                    <SelectItem value="Reported">Reported</SelectItem>
                    <SelectItem value="Verified">Verified</SelectItem>
                    <SelectItem value="Under Investigation">Under Investigation</SelectItem>
                    <SelectItem value="Resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mb-3">
              <label className="text-xs text-gray-600 mb-1 block">Time Period</label>
              <Select value={timeFilter || ''} onValueChange={setTimeFilter}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Any Time" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any Time</SelectItem>
                  <SelectItem value="today">Today</SelectItem>
                  <SelectItem value="week">This Week</SelectItem>
                  <SelectItem value="month">This Month</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={clearFilters}
              >
                <FilterX size={14} className="mr-1" />
                Clear All
              </Button>
            </div>
          </div>
        )}
        
        {/* Incidents List */}
        <div className="space-y-3">
          {filteredIncidents.length > 0 ? (
            filteredIncidents.map((incident) => (
              <div 
                key={incident.id} 
                className="bg-white rounded-lg shadow-sm p-4 border border-gray-100"
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full ${getSeverityColor(incident.severity)} mr-2`}></div>
                    <h3 className="font-medium">{incident.type}</h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(incident.status)}`}>
                    {incident.status}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{incident.description}</p>
                
                <div className="flex flex-col space-y-1.5 text-xs text-gray-500">
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1.5" />
                    <span>{incident.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1.5" />
                    <span>{incident.time}</span>
                  </div>
                </div>
                
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-end">
                  <Button variant="ghost" size="sm" className="text-raksha-primary text-xs">
                    View Details
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <AlertTriangle className="mx-auto text-gray-400 mb-2" size={28} />
              <p className="text-gray-500">No incidents match the selected filters</p>
              <Button 
                variant="link" 
                onClick={clearFilters} 
                className="mt-2 text-raksha-primary"
              >
                Clear filters
              </Button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Incidents;
