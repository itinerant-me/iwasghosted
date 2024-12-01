import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ShameCard from '../components/ShameCard';
import { AlertTriangle, Building2, User, ChevronDown } from 'lucide-react';
import { useView } from '../context/ViewContext';

interface ShameEntry {
  id: string;
  company: string;
  logo: string;
  location: string;
  waitingDays: number;
  domain: string;
  ghostingCount: number;
}

export default function WallOfShame() {
  const [entries, setEntries] = useState<ShameEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { viewType, setViewType } = useView();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchEntries = async () => {
      setLoading(true);
      setError(null);
      try {
        const entriesRef = collection(db, 'stories');
        
        // First get all stories to count per domain
        const allStoriesQuery = query(entriesRef);
        const allStoriesSnapshot = await getDocs(allStoriesQuery);

        // Create a map of domain to count, excluding recruiter stories when viewType is 'candidate'
        const domainCounts = new Map<string, number>();
        allStoriesSnapshot.docs.forEach(doc => {
          const data = doc.data();
          const domain = data.domain;
          const type = data.type || 'candidate'; // Default to candidate for older entries
          
          if (domain && (viewType === 'recruiter' ? type === 'recruiter' : type !== 'recruiter')) {
            domainCounts.set(domain, (domainCounts.get(domain) || 0) + 1);
          }
        });

        // Query for top 50 longest waiting times
        const q = query(
          entriesRef,
          orderBy('waitingDays', 'desc'),
          limit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs
          .map(doc => {
            const data = doc.data();
            const type = data.type || 'candidate'; // Default to candidate for older entries
            
            // Only include entries that match the current view type
            if (viewType === 'recruiter' ? type === 'recruiter' : type !== 'recruiter') {
              return {
                id: doc.id,
                company: data.company,
                logo: data.logo,
                location: data.location,
                waitingDays: data.waitingDays,
                domain: data.domain,
                ghostingCount: data.domain ? domainCounts.get(data.domain) || 1 : 1,
              };
            }
            return null;
          })
          .filter((entry): entry is ShameEntry => entry !== null);
        
        setEntries(fetchedEntries);
      } catch (err) {
        console.error('Error fetching entries:', err);
        setError('Failed to load rankings. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, [viewType]);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800 text-sm">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
              <span>&gt;</span>
              <span className="text-gray-900">Wall of Shame</span>
            </nav>

            {/* View Type Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-600 hover:text-black transition-colors rounded-lg hover:bg-gray-50"
              >
                <span className="flex items-center gap-1.5">
                  {viewType === 'candidate' ? (
                    <>
                      <Building2 className="w-3.5 h-3.5" />
                      BY A COMPANY
                    </>
                  ) : (
                    <>
                      <User className="w-3.5 h-3.5" />
                      BY A CANDIDATE
                    </>
                  )}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-52 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1 animate-in fade-in slide-in-from-top-1 duration-100">
                  <button
                    onClick={() => {
                      setViewType('candidate');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center whitespace-nowrap gap-2.5 px-3 py-2 text-xs tracking-wide uppercase hover:bg-gray-50 transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 shrink-0" />
                    <span className={viewType === 'candidate' ? 'text-black font-medium' : 'text-gray-600'}>
                      BY A COMPANY
                    </span>
                    {viewType === 'candidate' && (
                      <span className="ml-auto bg-black/5 text-black/70 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setViewType('recruiter');
                      setIsDropdownOpen(false);
                    }}
                    className="w-full flex items-center whitespace-nowrap gap-2.5 px-3 py-2 text-xs tracking-wide uppercase hover:bg-gray-50 transition-colors"
                  >
                    <User className="w-3.5 h-3.5 shrink-0" />
                    <span className={viewType === 'recruiter' ? 'text-black font-medium' : 'text-gray-600'}>
                      BY A CANDIDATE
                    </span>
                    {viewType === 'recruiter' && (
                      <span className="ml-auto bg-black/5 text-black/70 px-1.5 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider shrink-0">
                        ACTIVE
                      </span>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">Wall of Shame</h1>
            <p className="text-sm text-gray-600">
              {viewType === 'candidate' 
                ? "Companies ranked by longest interview ghosting periods. Shows total reports per company."
                : "Shows Companies that were ghosted by Candidates during active hiring processes."}
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                {viewType === 'candidate'
                  ? "Rankings based on verified reports of unexplained silence after active interview processes."
                  : "Rankings based on verified recruiter reports of candidates who disappeared during active hiring processes."}
              </p>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading rankings...</p>
            </div>
          ) : entries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No entries found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {entries.map((entry) => (
                <ShameCard
                  key={entry.id}
                  company={entry.company}
                  logo={entry.logo}
                  location={entry.location}
                  waitingDays={entry.waitingDays}
                  ghostingCount={entry.ghostingCount}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}