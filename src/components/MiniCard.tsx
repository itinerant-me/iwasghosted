import { Building2, MapPin, Shield, User2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface MiniCardProps {
  story: {
    company: string;
    role: string;
    location: string;
    logo: string;
    roundGhosted: string;
    waitingDays: number;
    submittedAt?: string;
    isAnonymous?: boolean;
    isVerified?: boolean;
  };
}

export default function MiniCard({ story }: MiniCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 h-[220px] flex flex-col overflow-hidden">
      {/* Company and Role Info */}
      <div className="p-4 flex items-start gap-4">
        {story.logo ? (
          <img
            src={story.logo}
            alt={`${story.company} logo`}
            className="w-12 h-12 flex-shrink-0 rounded-lg object-contain bg-white p-1.5 border border-gray-100 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.company)}&background=6366f1&color=fff`;
            }}
          />
        ) : (
          <div className="w-12 h-12 flex-shrink-0 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center border border-gray-100">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 truncate">{story.company || 'Company Name'}</h3>
            {story.isVerified && (
              <Shield className="w-4 h-4 flex-shrink-0 text-blue-500" />
            )}
          </div>
          
          <div className="space-y-1.5">
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <User2 className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">{story.role || 'Position'}</span>
            </p>
            <p className="text-sm text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400" />
              <span className="truncate">{story.location || 'Location'}</span>
            </p>
          </div>
        </div>
      </div>

      {/* Status Chips */}
      <div className="px-4 flex-1">
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-red-50 text-red-700 border border-red-100">
            {story.roundGhosted || 'Interview Round'}
          </span>
          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-700 border border-amber-100">
            {story.waitingDays || 0} days
          </span>
          {story.isAnonymous ? (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
              Anonymous
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
              Verified
            </span>
          )}
        </div>
      </div>

      {/* Metadata Footer */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 flex-shrink-0" />
          {story.submittedAt ? format(new Date(story.submittedAt), 'MMM d, yyyy') : 'Recently'}
        </span>
      </div>
    </div>
  );
}