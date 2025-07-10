
import React, { useState } from 'react';
import AppHeader from '@/components/AppHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  LogOut, 
  ShieldCheck, 
  HelpCircle, 
  BookOpen, 
  Settings,
  UserCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Home,
  Save
} from 'lucide-react';
import { toast } from 'sonner';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';

const Profile: React.FC = () => {
  const [userData, setUserData] = useState({
    name: "John Doe",
    phone: "+91 9876543210",
    email: "john.doe@example.com",
    address: "123 Main St, New Delhi"
  });
  
  const [editData, setEditData] = useState({ ...userData });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleLogout = () => {
    toast.info("Logout functionality would be implemented in a full app");
  };
  
  const handleEditSave = () => {
    setUserData({ ...editData });
    setIsDialogOpen(false);
    toast.success("Profile updated successfully");
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <AppHeader title="Profile" />
      
      <main className="flex-1 px-4 pb-20 pt-4">
        {/* Profile Header */}
        <section className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-raksha-secondary/10 flex items-center justify-center mb-3">
            <UserCircle size={50} className="text-raksha-secondary" />
          </div>
          <h1 className="text-xl font-bold text-raksha-secondary">{userData.name}</h1>
          <p className="text-gray-600 text-sm">New Delhi</p>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Update your personal information.
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Full Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.name}
                      onChange={(e) => setEditData({...editData, name: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone Number</label>
                  <div className="relative">
                    <Phone size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.phone}
                      onChange={(e) => setEditData({...editData, phone: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.email}
                      onChange={(e) => setEditData({...editData, email: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <div className="relative">
                    <Home size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input 
                      value={editData.address}
                      onChange={(e) => setEditData({...editData, address: e.target.value})}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                <Button className="bg-raksha-primary" onClick={handleEditSave}>
                  <Save size={16} className="mr-2" />
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </section>
        
        {/* User Info */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <h2 className="text-md font-semibold mb-3 text-raksha-secondary">Personal Information</h2>
          <div className="space-y-3">
            <div className="flex items-center">
              <Phone size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm">{userData.phone}</p>
              </div>
            </div>
            <div className="flex items-center">
              <Mail size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm">{userData.email}</p>
              </div>
            </div>
            <div className="flex items-center">
              <MapPin size={18} className="text-gray-500 mr-3" />
              <div>
                <p className="text-xs text-gray-500">Address</p>
                <p className="text-sm">{userData.address}</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Safety Score */}
        <section className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-md font-semibold text-raksha-secondary">Trust Score</h2>
            <div className="text-xl font-bold text-raksha-secondary">92</div>
          </div>
          <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-raksha-secondary h-2 rounded-full"
              style={{ width: '92%' }}
            ></div>
          </div>
          <p className="mt-2 text-xs text-gray-500">
            Your trust score reflects your community contributions and report accuracy.
          </p>
        </section>
        
        {/* Settings List */}
        <section className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-6">
          <div className="divide-y divide-gray-100">
            <div className="flex items-center px-4 py-3">
              <ShieldCheck size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Privacy & Security</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <HelpCircle size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Help & Support</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <BookOpen size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">Terms & Policies</span>
            </div>
            <div className="flex items-center px-4 py-3">
              <Settings size={18} className="text-gray-600 mr-3" />
              <span className="text-gray-800">App Settings</span>
            </div>
          </div>
        </section>
        
        {/* Logout Button */}
        <Button 
          variant="outline" 
          className="w-full border-raksha-primary text-raksha-primary"
          onClick={handleLogout}
        >
          <LogOut size={18} className="mr-2" />
          Logout
        </Button>
        
        <p className="text-center text-xs text-gray-500 mt-6">
          RakshaSetu v1.0.0
        </p>
      </main>
    </div>
  );
};

export default Profile;
