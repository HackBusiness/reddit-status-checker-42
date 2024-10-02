import React from 'react';
import { UserCircle } from 'lucide-react';

const ProfileSection = () => {
  return (
    <div className="flex items-center space-x-3">
      <div className="text-right">
        <p className="font-semibold">John Doe</p>
        <p className="text-sm text-gray-600">Premium Account</p>
      </div>
      <UserCircle className="h-10 w-10 text-gray-600" />
    </div>
  );
};

export default ProfileSection;