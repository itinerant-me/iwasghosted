import { useEffect, useState } from 'react';
import { collection, query, orderBy, getDocs, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import ShameCard from '../components/ShameCard';
import { AlertTriangle } from 'lucide-react';

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

  useEffect(() => {
    let mounted = true;

    const fetchEntries = async () => {
      try {
        setLoading(true);
        setError(null);

        const entriesRef = collection(db, 'stories');
        // First get all stories to count per domain
        const allStoriesQuery = query(entriesRef);
        const allStoriesSnapshot = await getDocs(allStoriesQuery);
        
        if (!mounted) return;

        // Create a map of domain to count
        const domainCounts = new Map<string, number>();
        allStoriesSnapshot.docs.forEach(doc => {
          const domain = doc.data().domain;
          if (domain) {
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
        
        if (!mounted) return;

        const fetchedEntries = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            company: data.company,
            logo: data.logo,
            location: data.location,
            waitingDays: data.waitingDays,
            domain: data.domain,
            ghostingCount: data.domain ? domainCounts.get(data.domain) || 1 : 1,
          };
        });
        
        if (mounted) {
          setEntries(fetchedEntries);
        }
      } catch (err) {
        console.error('Error fetching entries:', err);
        if (mounted) {
          setError('Failed to load rankings. Please try refreshing the page.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchEntries();

    return () => {
      mounted = false;
    };
  }, []);

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
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
            <span>&gt;</span>
            <span className="text-gray-900">Wall of Shame</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">Wall of Shame</h1>
            <p className="text-sm text-gray-600">
              Companies ranked by longest interview ghosting periods. Shows total reports per company.
            </p>
          </div>

          <div className="bg-amber-50 border border-amber-100 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <p className="text-sm text-amber-800">
                Rankings based on verified reports of unexplained silence after active interview processes.
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