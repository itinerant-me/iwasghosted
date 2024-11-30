import { Building2, MapPin, Shield, User2, Clock, Globe, Briefcase, Calendar, MessageCircle, ArrowLeft, ExternalLink, UserCheck, Mail, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

interface DetailedCardProps {
  story: {
    company: string;
    domain: string;
    role: string;
    department: string;
    industry: string;
    vertical: string;
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
    submittedAt?: string;
    isAnonymous?: boolean;
    isVerified?: boolean;
  };
  onBack: () => void;
}

export default function DetailedCard({ story, onBack }: DetailedCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header with back button */}
      <div className="border-b border-gray-200 p-4">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          <span>Back to all stories</span>
        </button>
      </div>

      <div className="p-6 space-y-6">
        {/* Company Header */}
        <div className="flex items-start gap-6">
          {story.logo ? (
            <img
              src={story.logo}
              alt={`${story.company} logo`}
              className="w-20 h-20 rounded-xl object-contain bg-white p-2 border border-gray-100 shadow-sm"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(story.company)}&background=6366f1&color=fff`;
              }}
            />
          ) : (
            <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
              <Building2 className="w-10 h-10 text-gray-400" />
            </div>
          )}
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <h2 className="text-2xl font-bold text-gray-900">{story.company}</h2>
              {story.isVerified && (
                <Shield className="w-5 h-5 text-blue-500" />
              )}
              {story.domain && (
                <a
                  href={story.domain.startsWith('http') ? story.domain : `https://${story.domain}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
              {story.jobUrl && (
                <a
                  href={story.jobUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-500 hover:text-gray-700"
                  title="View Job Posting"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-gray-600 flex items-center gap-2">
                  <User2 className="w-4 h-4 text-gray-400" />
                  <span>{story.role}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span>{story.location}</span>
                </p>
                <p className="text-gray-600 flex items-center gap-2">
                  <Briefcase className="w-4 h-4 text-gray-400" />
                  <span>{story.department}</span>
                </p>
              </div>
              
              <div className="space-y-2">
                <p className="text-gray-600">
                  <span className="font-medium">Industry:</span> {story.industry}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Vertical:</span> {story.vertical}
                </p>
                <p className="text-gray-600">
                  <span className="font-medium">Experience:</span> {story.yearsOfExperience} years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Timeline Information */}
        <div className="border-t border-b border-gray-200 py-6 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-gray-600">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>Process Started:</span>
                <span className="font-medium">
                  {format(new Date(story.processStartDate), 'MMM d, yyyy')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>Last Communication:</span>
                <span className="font-medium">
                  {format(new Date(story.communicationEndDate), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-red-600">
                <MessageCircle className="w-4 h-4" />
                <span>Ghosted after:</span>
                <span className="font-medium">{story.roundGhosted}</span>
              </div>
              <div className="flex items-center gap-2 text-amber-600">
                <Clock className="w-4 h-4" />
                <span>Days of silence:</span>
                <span className="font-medium">{story.waitingDays} days</span>
              </div>
            </div>
          </div>
        </div>

        {/* Communication Details */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Communication Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Communication Channels</h4>
              <div className="flex flex-wrap gap-2">
                {story.channels.map((channel) => (
                  <span
                    key={channel}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-50 text-blue-700 border border-blue-100"
                  >
                    {channel === 'email' ? <Mail className="w-4 h-4 mr-1" /> : 
                     channel === 'phone' ? <MessageSquare className="w-4 h-4 mr-1" /> :
                     <MessageCircle className="w-4 h-4 mr-1" />}
                    {channel}
                  </span>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Application Source</h4>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-50 text-purple-700 border border-purple-100">
                {story.applicationSource === 'approached' ? (
                  <>
                    <UserCheck className="w-4 h-4 mr-1" />
                    Approached by company
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Applied directly
                  </>
                )}
              </span>
            </div>
          </div>

          {story.nextStepsPromised && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Promised Next Steps</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {story.nextStepsPromised}
              </p>
            </div>
          )}

          {story.comments && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Additional Comments</h4>
              <p className="text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                {story.comments}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-4 flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>
              Reported on {story.submittedAt ? format(new Date(story.submittedAt), 'MMM d, yyyy') : 'Recently'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {story.isAnonymous ? (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-gray-50 text-gray-600 border border-gray-100">
                Anonymous Report
              </span>
            ) : (
              <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                <Shield className="w-3.5 h-3.5 mr-1" />
                Verified Report
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
