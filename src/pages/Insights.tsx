import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Users, Building2, Briefcase, Clock, User, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { useView } from '../context/ViewContext';

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
  const { viewType, setViewType } = useView();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const fetchInsights = async () => {
      setLoading(true);
      setError(null);
      try {
        const storiesRef = collection(db, 'stories');
        const q = query(storiesRef);
        const querySnapshot = await getDocs(q);
        const allStories = querySnapshot.docs.map(doc => doc.data());
        
        // Filter stories based on viewType
        const stories = allStories.filter(story => {
          const type = story.type || 'candidate'; // Default to candidate for older entries
          return viewType === 'recruiter' ? type === 'recruiter' : type !== 'recruiter';
        });
        
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
  }, [viewType]);

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
          <div className="flex items-center justify-between">
            <nav className="flex items-center space-x-2 text-sm text-gray-500">
              <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
              <span>&gt;</span>
              <span className="text-gray-900">Insights</span>
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
            <h1 className="text-xl font-semibold text-gray-900">Insights</h1>
            <p className="text-sm text-gray-600">
              {viewType === 'recruiter' 
                ? "Statistics about candidate ghosting during hiring processes. Shared by recruiters to help other recruiters."
                : "Statistics about company ghosting from a candidate's perspective."}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Total Stories</h3>
                      <p className="text-2xl font-semibold">{insightData.totalStories}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Average Wait</h3>
                      <p className="text-2xl font-semibold">{insightData.averageWaitDays} days</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-50 rounded-lg">
                      <Building2 className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">
                        {viewType === 'recruiter' ? 'Unique Candidates' : 'Unique Companies'}
                      </h3>
                      <p className="text-2xl font-semibold">{insightData.uniqueCompanies}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-50 rounded-lg">
                      <Briefcase className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Top Industry</h3>
                      <p className="text-2xl font-semibold">{insightData.topIndustry.percentage}%</p>
                      <p className="text-xs text-gray-500 mt-1">{insightData.topIndustry.name}</p>
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
