
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import EmergencySOS from '@/components/EmergencySOS';
import SafetyScore from '@/components/SafetyScore';
import SafetyTips from '@/components/SafetyTips';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Share2, UserCircle, Bell, Route, Shield, AlertCircle, MapPin, Check } from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogClose,
  DialogFooter 
} from '@/components/ui/dialog';

// Sample emergency contacts
const initialContacts = [
  { id: '1', name: 'Emergency Contact 1', phone: '+1234567890' }
];

// Sample shared locations
const sharedLocations = [
  { id: '1', name: 'Friend 1', location: 'Lat: 28.6139, Long: 77.2090', time: '5 mins ago' },
  { id: '2', name: 'Friend 2', location: 'Lat: 28.5355, Long: 77.2910', time: '15 mins ago' }
];

const Safety: React.FC = () => {
  const [contacts, setContacts] = useState(initialContacts);
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [newContact, setNewContact] = useState({ name: '', phone: '' });
  const [editingContact, setEditingContact] = useState<{ id: string, name: string, phone: string } | null>(null);
  const [startLocation, setStartLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [safetyAnalysis, setSafetyAnalysis] = useState<null | { safe: boolean, reason?: string, alternateRoute?: string }>(null);
  const [currentLocation, setCurrentLocation] = useState('');

  const handleShareLocation = () => {
    if (selectedContacts.length === 0) {
      toast.error("Please select at least one contact to share your location with");
      return;
    }

    // Get selected contact names for the success message
    const selectedContactNames = contacts
      .filter(contact => selectedContacts.includes(contact.id))
      .map(contact => contact.name);

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation(`Lat: ${latitude.toFixed(4)}, Long: ${longitude.toFixed(4)}`);
          
          // In a real app, this would send the location to a server
          toast.success(`Location shared with ${selectedContactNames.join(', ')}`);
        },
        (error) => {
          console.error("Error getting location:", error);
          toast.error("Could not get your location. Please check permissions.");
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser");
    }
  };

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast.error("Please enter both name and phone number");
      return;
    }

    const newId = `${contacts.length + 1}`;
    setContacts([...contacts, { ...newContact, id: newId }]);
    setNewContact({ name: '', phone: '' });
    toast.success("Contact added successfully!");
  };

  const handleUpdateContact = () => {
    if (!editingContact) return;
    
    if (!editingContact.name || !editingContact.phone) {
      toast.error("Please enter both name and phone number");
      return;
    }

    const updatedContacts = contacts.map(contact => 
      contact.id === editingContact.id ? editingContact : contact
    );
    
    setContacts(updatedContacts);
    setEditingContact(null);
    toast.success("Contact updated successfully!");
  };

  const handleSelectContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      setSelectedContacts(selectedContacts.filter(id => id !== contactId));
    } else {
      setSelectedContacts([...selectedContacts, contactId]);
    }
  };

  const handleCheckRoute = () => {
    if (!startLocation || !destination) {
      toast.error("Please enter both start and destination locations");
      return;
    }

    // Simulate route safety analysis
    setTimeout(() => {
      // In a real app, this would be an API call to check the safety of the route
      const randomSafety = Math.random();
      if (randomSafety > 0.4) {
        setSafetyAnalysis({
          safe: true,
          reason: "Route is generally safe with moderate crime rate."
        });
        toast.success("Route analyzed - Safe to travel");
      } else {
        setSafetyAnalysis({
          safe: false,
          reason: "High crime rate reported in this area recently, especially after dark.",
          alternateRoute: "Via Outer Ring Road (adds 5 min but safer area)"
        });
        toast.warning("Caution: Unsafe route detected. Alternative route suggested.");
      }
    }, 1500);

    toast.info("Analyzing route safety...");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Safety" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Emergency SOS Button */}
        <section className="mb-6">
          <EmergencySOS />
        </section>
        
        {/* Safety Score */}
        <SafetyScore score={85} className="mb-6" />
        
        {/* Share Location */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Share Your Location</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Share your live location with trusted contacts so they can track your journey
            </p>
            
            {currentLocation && (
              <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center text-sm mb-2">
                  <MapPin size={16} className="text-raksha-primary mr-1" />
                  <span className="font-medium">Your current location:</span>
                </div>
                <p className="text-sm">{currentLocation}</p>
              </div>
            )}
            
            <div className="mb-3">
              <h3 className="text-sm font-medium mb-2">Select contacts to share with:</h3>
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div 
                    key={contact.id} 
                    className={`flex items-center justify-between border rounded-md p-2 ${
                      selectedContacts.includes(contact.id) ? 'bg-raksha-primary/10 border-raksha-primary' : 'border-gray-200'
                    }`}
                    onClick={() => handleSelectContact(contact.id)}
                  >
                    <div className="flex items-center">
                      <UserCircle size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm block">{contact.name}</span>
                        <span className="text-xs text-gray-500">{contact.phone}</span>
                      </div>
                    </div>
                    {selectedContacts.includes(contact.id) && (
                      <Check size={18} className="text-raksha-primary" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            <Button 
              className="w-full bg-raksha-secondary hover:bg-raksha-secondary/90 mb-3"
              onClick={handleShareLocation}
            >
              <Share2 size={18} className="mr-2" />
              Share Live Location
            </Button>
            
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium mb-2">Trusted Contacts</h3>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm" className="text-xs">
                      + Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Contact</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Name</label>
                        <Input 
                          placeholder="Contact name"
                          value={newContact.name}
                          onChange={(e) => setNewContact({...newContact, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Phone Number</label>
                        <Input 
                          placeholder="Phone number"
                          value={newContact.phone}
                          onChange={(e) => setNewContact({...newContact, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DialogClose>
                      <Button onClick={() => {
                        handleAddContact();
                      }}>
                        Add Contact
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
              
              <div className="space-y-2">
                {contacts.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between border border-gray-100 rounded-md p-2">
                    <div className="flex items-center">
                      <UserCircle size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm">{contact.name}</span>
                        <span className="text-xs text-gray-500 block">{contact.phone}</span>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setEditingContact(contact)}
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Contact</DialogTitle>
                        </DialogHeader>
                        {editingContact && (
                          <div className="space-y-4 py-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Name</label>
                              <Input 
                                value={editingContact.name}
                                onChange={(e) => setEditingContact({...editingContact, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Phone Number</label>
                              <Input 
                                value={editingContact.phone}
                                onChange={(e) => setEditingContact({...editingContact, phone: e.target.value})}
                              />
                            </div>
                          </div>
                        )}
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                          </DialogClose>
                          <Button onClick={handleUpdateContact}>
                            Update Contact
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
        
        {/* Shared Locations */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Shared Locations</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Track friends who have shared their location with you
            </p>
            
            {sharedLocations.length > 0 ? (
              <div className="space-y-3">
                {sharedLocations.map((contact) => (
                  <div key={contact.id} className="flex justify-between items-center border border-gray-100 rounded-md p-3">
                    <div className="flex items-center">
                      <UserCircle size={24} className="text-gray-400 mr-2" />
                      <div>
                        <span className="text-sm font-medium">{contact.name}</span>
                        <div className="flex items-center text-xs text-gray-500">
                          <MapPin size={12} className="mr-1" />
                          {contact.location}
                        </div>
                        <span className="text-xs text-gray-400">{contact.time}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      View Map
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                <MapPin size={32} className="mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No active shared locations</p>
              </div>
            )}
          </div>
        </section>
        
        {/* Safe Routes */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Safe Routes</h2>
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-gray-700 mb-3">
              Check safety of your travel route and get safer alternatives if needed
            </p>
            
            <div className="space-y-3 mb-4">
              <div>
                <label className="text-sm font-medium">Starting Point</label>
                <div className="flex mt-1">
                  <Input 
                    placeholder="Enter starting location"
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => {
                      if (navigator.geolocation) {
                        navigator.geolocation.getCurrentPosition(
                          (position) => {
                            // In a real app, we would use reverse geocoding
                            const { latitude, longitude } = position.coords;
                            setStartLocation(`Current Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`);
                            toast.success("Current location set as starting point");
                          },
                          (error) => {
                            toast.error("Could not get your location");
                          }
                        );
                      }
                    }}
                  >
                    Current
                  </Button>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Destination</label>
                <Input 
                  placeholder="Enter destination"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-raksha-primary hover:bg-raksha-primary/90 mb-3"
              onClick={handleCheckRoute}
            >
              <Route size={18} className="mr-2" />
              Check Route Safety
            </Button>
            
            {safetyAnalysis && (
              <div className={`mt-4 p-3 rounded-lg ${safetyAnalysis.safe ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                <div className="flex items-center mb-2">
                  {safetyAnalysis.safe ? (
                    <Shield size={18} className="text-green-500 mr-2" />
                  ) : (
                    <AlertCircle size={18} className="text-amber-500 mr-2" />
                  )}
                  <span className={`font-medium ${safetyAnalysis.safe ? 'text-green-700' : 'text-amber-700'}`}>
                    {safetyAnalysis.safe ? 'Safe Route' : 'Caution Advised'}
                  </span>
                </div>
                <p className="text-sm text-gray-700">{safetyAnalysis.reason}</p>
                
                {!safetyAnalysis.safe && safetyAnalysis.alternateRoute && (
                  <div className="mt-3 pt-3 border-t border-amber-200">
                    <div className="flex items-center mb-1">
                      <Route size={16} className="text-raksha-primary mr-2" />
                      <span className="font-medium text-sm">Suggested Alternate Route:</span>
                    </div>
                    <p className="text-sm text-gray-700">{safetyAnalysis.alternateRoute}</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-2 text-xs border-raksha-primary text-raksha-primary"
                    >
                      Use This Route
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Safety Features */}
        <section className="mb-6">
          <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Safety Features</h2>
          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Bell size={24} className="mb-2" />
              <span className="text-sm">Safety Alerts</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Route size={24} className="mb-2" />
              <span className="text-sm">Safe Routes</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <Share2 size={24} className="mb-2" />
              <span className="text-sm">Shared Location</span>
            </Button>
            <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
              <AlertCircle size={24} className="mb-2" />
              <span className="text-sm">Women's Safety</span>
            </Button>
          </div>
        </section>
        
        {/* Safety Tips */}
        <SafetyTips />
      </main>
    </div>
  );
};

export default Safety;
