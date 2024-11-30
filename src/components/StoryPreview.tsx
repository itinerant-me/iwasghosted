import { Building2, Calendar, Clock, ExternalLink, MapPin, MessageSquare, User2, Briefcase, Shield, UserX } from 'lucide-react';
import { format } from 'date-fns';

interface StoryPreviewProps {
  story: {
    company: string;
    domain: string;
    role: string;
    department: string;
    customDepartment?: string;
    industry: string;
    customIndustry?: string;
    vertical: string;
    customVertical?: string;
    yearsOfExperience: number;
    location: string;
    comments: string;
    roundGhosted: string;
    communicationEndDate: string;
    channels: string[];
    nextStepsPromised: string;
    waitingDays: number;
    processStartDate: string;
    logo: string;
    jobUrl: string;
    applicationSource: 'approached' | 'applied' | '';
    isAnonymous?: boolean;
    isVerified?: boolean;
  };
  view: 'short' | 'detailed';
}

export default function StoryPreview({ story }: StoryPreviewProps) {
  const getDisplayValue = (value: string, customValue?: string) => {
    if (value === 'Other (Custom)' && customValue) {
      return customValue;
    }
    return value;
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-gray-50 to-white border-b border-gray-100 p-6">
        <div className="flex items-start space-x-4">
          {story.logo && (
            <div className="relative shrink-0">
              <img
                src={story.logo}
                alt={`${story.company} logo`}
                className="w-16 h-16 rounded-xl object-contain bg-white p-2 shadow-sm border border-gray-100"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.company)}&background=6366f1&color=fff`;
                }}
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-1">
              <h3 className="text-xl font-semibold text-gray-900">{story.company || 'Company Name'}</h3>
              {story.applicationSource && (
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  story.applicationSource === 'approached' 
                    ? 'bg-purple-50 text-purple-700'
                    : 'bg-blue-50 text-blue-700'
                }`}>
                  {story.applicationSource === 'approached' ? 'They approached me' : 'I applied'}
                </span>
              )}
            </div>
            
            {/* Verification Badge */}
            <div className="mb-2">
              {story.isVerified ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                  <Shield className="w-3.5 h-3.5" />
                  Verified User Submission
                </span>
              ) : story.isAnonymous ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                  <UserX className="w-3.5 h-3.5" />
                  Anonymous Submission
                </span>
              ) : null}
            </div>
            
            <div className="space-y-1">
              <p className="text-gray-600 flex items-center gap-2">
                <User2 className="w-4 h-4 text-gray-400" />
                {story.role || 'Position'} • {story.yearsOfExperience || 0} years exp
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-400" />
                {story.location || 'Location'}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-gray-400" />
                {getDisplayValue(story.department, story.customDepartment) || 'Department'}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gray-400" />
                {getDisplayValue(story.industry, story.customIndustry) || 'Industry'} • 
                {getDisplayValue(story.vertical, story.customVertical) || 'Vertical'}
              </p>
            </div>
          </div>
        </div>

        {story.jobUrl && (
          <a
            href={story.jobUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
          >
            <ExternalLink className="w-4 h-4" />
            View Job Posting
          </a>
        )}
      </div>

      {/* Status Section */}
      <div className="bg-red-500 px-6 py-4">
        <div className="flex items-center justify-between text-white">
          <div>
            <p className="text-red-100 text-sm">Ghosted After</p>
            <p className="font-medium">{story.roundGhosted || 'Interview Round'}</p>
          </div>
          <div className="text-right">
            <p className="text-red-100 text-sm">Days of Silence</p>
            <p className="text-2xl font-bold tabular-nums">{story.waitingDays || 0}</p>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="p-6 space-y-6">
        {/* Timeline */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm">
              <Calendar className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Process Started</p>
                <p className="font-medium text-gray-900">
                  {story.processStartDate ? format(new Date(story.processStartDate), 'MMM d, yyyy') : '...'}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-gray-500">Last Contact</p>
                <p className="font-medium text-gray-900">
                  {story.communicationEndDate ? format(new Date(story.communicationEndDate), 'MMM d, yyyy') : '...'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Communication */}
        {story.channels.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-gray-400" />
              Communication Channels
            </h4>
            <div className="flex flex-wrap gap-2">
              {story.channels.map(channel => (
                <span
                  key={channel}
                  className="px-3 py-1 rounded-lg text-sm bg-gray-100 text-gray-700"
                >
                  {channel}
                </span>
              ))}
            </div>
          </div>
        )}

        {story.nextStepsPromised && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900">Promised Next Steps</h4>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-amber-800 text-sm">"{story.nextStepsPromised}"</p>
            </div>
          </div>
        )}

        {story.comments && (
          <div className="space-y-3">
            <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-gray-400" />
              Comments
            </h4>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-gray-700 text-sm">{story.comments}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}