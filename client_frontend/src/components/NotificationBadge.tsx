
import React from 'react';
import { Bell } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Alert, AlertDescription } from './ui/alert';

interface Notification {
  id: string;
  title: string;
  description: string;
  time: string;
}

interface NotificationBadgeProps {
  notifications: Notification[];
}

const NotificationBadge: React.FC<NotificationBadgeProps> = ({ notifications = [] }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell size={20} />
          {notifications.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-raksha-primary rounded-full flex items-center justify-center text-white text-xs">
              {notifications.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Notifications</SheetTitle>
        </SheetHeader>
        
        <div className="mt-6 space-y-4">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <Alert key={notification.id}>
                <AlertDescription>
                  <p className="font-semibold">{notification.title}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {notification.description}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">{notification.time}</p>
                </AlertDescription>
              </Alert>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBadge;
