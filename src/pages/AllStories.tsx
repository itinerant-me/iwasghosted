import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MiniCard from '../components/MiniCard';
import DetailedCard from '../components/DetailedCard';
import { Building2, User, ChevronDown } from 'lucide-react';
import { useView } from '../context/ViewContext';

interface Story {
  type: 'candidate' | 'recruiter';
  id: string;
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
  submittedAt: string;
  isAnonymous: boolean;
  isVerified: boolean;
}

export default function AllStories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const { viewType, setViewType } = useView();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchStories = async () => {
      setLoading(true);
      setError(null);
      try {
        const storiesRef = collection(db, 'stories');
        const q = query(storiesRef, orderBy('submittedAt', 'desc'));
        const querySnapshot = await getDocs(q);
        
        const fetchedStories = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Story));
        
        setStories(fetchedStories);
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  const handleStoryClick = (story: Story) => {
    setSelectedStory(story);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBack = () => {
    setSelectedStory(null);
  };

  const filteredStories = viewType === 'recruiter' 
    ? stories.filter(story => story.type === 'recruiter')
    : stories.filter(story => story.type !== 'recruiter');

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
              <span className="text-gray-900">Stories</span>
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
          <h1 className="text-xl font-semibold text-gray-900">
            {selectedStory 
              ? 'Ghost Story Details' 
              : viewType === 'recruiter'
                ? 'Candidate Ghosting Stories - Shared by Recruiters'
                : 'Company Ghosting Stories - Shared by Candidates'
            }
          </h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading stories...</p>
            </div>
          ) : filteredStories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No {viewType} stories found</p>
            </div>
          ) : selectedStory ? (
            <DetailedCard story={selectedStory} onBack={handleBack} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredStories.map((story) => (
                <div
                  key={story.id}
                  onClick={() => handleStoryClick(story)}
                  className="cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.99]"
                >
                  <MiniCard story={story} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}