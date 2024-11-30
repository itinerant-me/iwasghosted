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
}

export default function WallOfShame() {
  const [entries, setEntries] = useState<ShameEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEntries = async () => {
      try {
        const entriesRef = collection(db, 'stories');
        // Query for top 50 longest waiting times
        const q = query(
          entriesRef,
          orderBy('waitingDays', 'desc'),
          limit(50)
        );
        
        const querySnapshot = await getDocs(q);
        const fetchedEntries = querySnapshot.docs.map(doc => ({
          id: doc.id,
          company: doc.data().company,
          logo: doc.data().logo,
          location: doc.data().location,
          waitingDays: doc.data().waitingDays,
        }));
        
        setEntries(fetchedEntries);
      } catch (error) {
        console.error('Error fetching entries:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEntries();
  }, []);

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
              Companies ranked by longest interview ghosting periods. Top 50 shown.
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
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}