import { Building2, MapPin, Clock } from 'lucide-react';

interface ShameCardProps {
  company: string;
  logo: string;
  location: string;
  waitingDays: number;
}

export default function ShameCard({ company, logo, location, waitingDays }: ShameCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all duration-200">
      <div className="flex items-start gap-4">
        {logo ? (
          <img
            src={logo}
            alt={`${company} logo`}
            className="w-12 h-12 rounded-lg object-contain bg-white p-1.5 border border-gray-100 shadow-sm"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(company)}&background=6366f1&color=fff`;
            }}
          />
        ) : (
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 truncate mb-1">{company}</h3>
          <p className="text-sm text-gray-600 flex items-center gap-1.5 mb-1">
            <MapPin className="w-3.5 h-3.5 text-gray-400" />
            <span className="truncate">{location}</span>
          </p>
          <div className="flex items-center gap-1.5 text-red-600">
            <Clock className="w-3.5 h-3.5" />
            <span className="font-semibold">{waitingDays} days</span>
            <span className="text-sm">of silence</span>
          </div>
        </div>
      </div>
    </div>
  );
}