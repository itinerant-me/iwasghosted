import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Building2, Briefcase, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Distribution {
  [key: string]: number;
}

interface InsightData {
  totalStories: number;
  averageWaitDays: number;
  uniqueCompanies: number;
  topIndustry: {
    name: string;
    percentage: number;
  };
  verticalDistribution: Distribution;
  industryDistribution: Distribution;
  experienceDistribution: Distribution;
  channelsDistribution: Distribution;
  monthlyTrend: Distribution;
}

export default function Insights() {
  const [insightData, setInsightData] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const storiesRef = collection(db, 'stories');
        const q = query(storiesRef);
        const querySnapshot = await getDocs(q);
        const stories = querySnapshot.docs.map(doc => doc.data());
        
        if (stories.length === 0) {
          setInsightData({
            totalStories: 0,
            averageWaitDays: 0,
            uniqueCompanies: 0,
            topIndustry: {
              name: 'N/A',
              percentage: 0
            },
            verticalDistribution: {},
            industryDistribution: {},
            experienceDistribution: {},
            channelsDistribution: {},
            monthlyTrend: {}
          });
          return;
        }

        // Calculate basic insights
        const totalStories = stories.length;
        const totalWaitDays = stories.reduce((acc, story) => {
          const waitDays = typeof story.waitingDays === 'number' 
            ? story.waitingDays 
            : parseInt(story.waitingDays || '0', 10);
          return acc + waitDays;
        }, 0);
        const averageWaitDays = Math.round(totalWaitDays / totalStories);
        const uniqueCompanies = new Set(stories.map(story => story.domain)).size;

        // Calculate vertical distribution
        const verticalCounts: Distribution = {};
        stories.forEach(story => {
          const vertical = story.vertical || 'Other';
          verticalCounts[vertical] = (verticalCounts[vertical] || 0) + 1;
        });

        // Calculate industry distribution
        const industryCounts: Distribution = {};
        stories.forEach(story => {
          const industry = story.industry || 'Other';
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });

        // Calculate experience distribution
        const experienceCounts: Distribution = {
          '0-3 years': 0,
          '4-6 years': 0,
          '7-9 years': 0,
          '10+ years': 0
        };
        stories.forEach(story => {
          const years = story.yearsOfExperience || 0;
          if (years <= 3) experienceCounts['0-3 years']++;
          else if (years <= 6) experienceCounts['4-6 years']++;
          else if (years <= 9) experienceCounts['7-9 years']++;
          else experienceCounts['10+ years']++;
        });

        // Calculate channels distribution
        const channelCounts: Distribution = {};
        stories.forEach(story => {
          if (Array.isArray(story.channels)) {
            story.channels.forEach(channel => {
              channelCounts[channel] = (channelCounts[channel] || 0) + 1;
            });
          }
        });

        // Calculate monthly trend
        const monthlyTrend: Distribution = {};
        stories.forEach(story => {
          if (story.submittedAt) {
            const month = format(new Date(story.submittedAt), 'MMM yyyy');
            monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
          }
        });

        // Find top industry
        let topIndustry = { name: '', count: 0 };
        Object.entries(industryCounts).forEach(([industry, count]) => {
          if (count > topIndustry.count) {
            topIndustry = { name: industry, count };
          }
        });

        const topIndustryPercentage = Math.round((topIndustry.count / totalStories) * 100);

        setInsightData({
          totalStories,
          averageWaitDays,
          uniqueCompanies,
          topIndustry: {
            name: topIndustry.name,
            percentage: topIndustryPercentage
          },
          verticalDistribution: verticalCounts,
          industryDistribution: industryCounts,
          experienceDistribution: experienceCounts,
          channelsDistribution: channelCounts,
          monthlyTrend
        });
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load insights. Please try refreshing the page.');
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, []);

  const renderDistributionChart = (
    title: string,
    data: Distribution,
    color: string
  ) => {
    const sortedData = Object.entries(data)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5);
    
    const maxValue = Math.max(...sortedData.map(([, value]) => value));

    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-sm font-medium text-gray-900 mb-4">{title}</h3>
        <div className="space-y-4">
          {sortedData.map(([key, value]) => (
            <div key={key} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">{key}</span>
                <span className="text-sm font-medium">{value} ({Math.round((value / maxValue) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className={`${color} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${(value / maxValue) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
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
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
            <span>&gt;</span>
            <span className="text-gray-900">Insights</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">Insights</h1>
            <p className="text-sm text-gray-600">
              Analytics and trends from our ghosting reports database
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-600">Loading insights...</p>
            </div>
          ) : !insightData ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No data available</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-blue-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-blue-500/10 rounded-lg">
                        <Users className="w-7 h-7 text-blue-600" />
                      </div>
                      <div className="text-sm font-medium text-blue-900">Total Stories</div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {insightData.totalStories.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      stories shared by the community
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-purple-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-purple-500/10 rounded-lg">
                        <Building2 className="w-7 h-7 text-purple-600" />
                      </div>
                      <div className="text-sm font-medium text-purple-900">Companies</div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {insightData.uniqueCompanies.toLocaleString()}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      unique companies reported
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-amber-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-amber-500/10 rounded-lg">
                        <Clock className="w-7 h-7 text-amber-600" />
                      </div>
                      <div className="text-sm font-medium text-amber-900">Average Wait</div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {insightData.averageWaitDays}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      days without response
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                  <div className="p-4 bg-gradient-to-br from-green-50 to-white">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 bg-green-500/10 rounded-lg">
                        <Briefcase className="w-7 h-7 text-green-600" />
                      </div>
                      <div className="text-sm font-medium text-green-900">Top Industry</div>
                    </div>
                  </div>
                  <div className="px-4 py-4">
                    <div className="text-3xl font-bold text-gray-900">
                      {insightData.topIndustry.name}
                    </div>
                    <div className="mt-1 text-sm text-gray-500">
                      most reported sector
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderDistributionChart('Verticals Distribution', insightData.verticalDistribution, 'bg-blue-500')}
                {renderDistributionChart('Industry Distribution', insightData.industryDistribution, 'bg-purple-500')}
                {renderDistributionChart('Experience Distribution', insightData.experienceDistribution, 'bg-green-500')}
                {renderDistributionChart('Communication Channels', insightData.channelsDistribution, 'bg-amber-500')}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">Monthly Trend</h3>
                <div className="space-y-4">
                  {Object.entries(insightData.monthlyTrend)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .slice(0, 6)
                    .reverse()
                    .map(([month, count]) => (
                      <div key={month} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-gray-600">{month}</span>
                          <span className="text-sm font-medium">{count} stories</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(count / Math.max(...Object.values(insightData.monthlyTrend))) * 100}%` 
                            }}
                          />
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
