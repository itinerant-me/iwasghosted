import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import MiniCard from '../components/MiniCard';
import DetailedCard from '../components/DetailedCard';
import Breadcrumb from '../components/Breadcrumb';

interface Story {
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
          <Breadcrumb />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <h1 className="text-xl font-semibold text-gray-900">
            {selectedStory ? 'Ghost Story Details' : 'Recent Ghost Stories'}
          </h1>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading stories...</p>
            </div>
          ) : stories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No stories found</p>
            </div>
          ) : selectedStory ? (
            <DetailedCard story={selectedStory} onBack={handleBack} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stories.map((story) => (
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