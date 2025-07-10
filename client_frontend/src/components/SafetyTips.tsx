
import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';

const tips = [
  {
    id: 1,
    title: 'Avoid poorly lit areas after dark',
    category: 'Personal Safety'
  },
  {
    id: 2,
    title: 'Share your live location with trusted contacts',
    category: 'Travel Safety'
  },
  {
    id: 3,
    title: 'Keep emergency numbers on speed dial',
    category: 'Emergency Preparedness'
  }
];

interface SafetyTipsProps {
  className?: string;
}

const SafetyTips: React.FC<SafetyTipsProps> = ({ className }) => {
  return (
    <div className={className}>
      <h2 className="text-lg font-semibold mb-3 text-raksha-secondary">Safety Tips</h2>
      <div className="bg-raksha-secondary/5 rounded-lg p-3 border border-raksha-secondary/10">
        <div className="space-y-2">
          {tips.map((tip) => (
            <div key={tip.id} className="flex items-center justify-between bg-white p-3 rounded-md shadow-sm">
              <div className="flex items-start">
                <AlertCircle className="text-raksha-primary mr-2 mt-0.5" size={18} />
                <div>
                  <p className="text-sm font-medium">{tip.title}</p>
                  <p className="text-xs text-gray-500">{tip.category}</p>
                </div>
              </div>
              <ChevronRight size={16} className="text-gray-400" />
            </div>
          ))}
        </div>
        <button className="mt-3 w-full text-center text-sm text-raksha-secondary font-medium py-2">
          View All Tips
        </button>
      </div>
    </div>
  );
};

export default SafetyTips;
