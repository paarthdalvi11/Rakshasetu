
import React from 'react';
import { cn } from '@/lib/utils';
import { AlertTriangle, Shield } from 'lucide-react';

interface SafetyScoreProps {
  score: number;
  location?: string;
  className?: string;
}

const SafetyScore: React.FC<SafetyScoreProps> = ({ score, location = "Current Area", className }) => {
  // Determine safety level
  let safetyLevel = "High";
  let textColor = "text-green-600";
  let bgColor = "bg-green-100";
  let icon = Shield;
  
  if (score < 40) {
    safetyLevel = "Low";
    textColor = "text-raksha-primary";
    bgColor = "bg-red-50";
    icon = AlertTriangle;
  } else if (score < 70) {
    safetyLevel = "Moderate";
    textColor = "text-amber-600";
    bgColor = "bg-amber-50";
    icon = AlertTriangle;
  }

  return (
    <div className={cn("rounded-lg p-4", bgColor, className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-gray-800">Safety Score</h3>
          <p className="text-sm text-gray-600">{location}</p>
        </div>
        <div className={cn("text-2xl font-bold", textColor)}>
          {score}
        </div>
      </div>
      
      <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className={cn(
            "h-2.5 rounded-full",
            score < 40 ? "bg-red-500" : score < 70 ? "bg-amber-500" : "bg-green-500"
          )}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      
      <div className="mt-3 flex items-center">
        {React.createElement(icon, { size: 16, className: cn(textColor, "mr-1") })}
        <span className={cn("text-sm", textColor)}>
          {safetyLevel} Safety • {score >= 70 ? "Safe area" : score >= 40 ? "Exercise caution" : "Be extremely careful"}
        </span>
      </div>
    </div>
  );
};

export default SafetyScore;
