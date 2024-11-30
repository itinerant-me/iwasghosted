import { useState, useEffect } from 'react';
import { Users, Building2, Target } from 'lucide-react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { format } from 'date-fns';

interface Story {
  company: string;
  domain: string;
  vertical: string;
  industry: string;
  yearsOfExperience: number;
  waitingDays: number;
  submittedAt: string;
  channels: string[];
}

interface InsightsData {
  totalStories: number;
  totalCompanies: number;
  avgWaitDays: number;
  verticalDistribution: { [key: string]: number };
  industryDistribution: { [key: string]: number };
  experienceDistribution: { [key: string]: number };
  monthlyTrend: { [key: string]: number };
  channelsDistribution: { [key: string]: number };
}

export default function Insights() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<InsightsData>({
    totalStories: 0,
    totalCompanies: 0,
    avgWaitDays: 0,
    verticalDistribution: {},
    industryDistribution: {},
    experienceDistribution: {},
    monthlyTrend: {},
    channelsDistribution: {},
  });

  useEffect(() => {
    async function fetchInsights() {
      try {
        const storiesRef = collection(db, 'stories');
        const snapshot = await getDocs(storiesRef);
        const stories = snapshot.docs.map(doc => doc.data() as Story);

        // Calculate total stories
        const totalStories = stories.length;

        // Calculate unique companies by domain
        const uniqueDomains = new Set(stories.map(story => story.domain));
        const totalCompanies = uniqueDomains.size;

        // Calculate average waiting days
        let totalWaitDays = 0;
        let storiesWithWaitDays = 0;
        stories.forEach(story => {
          if (typeof story.waitingDays === 'number') {
            totalWaitDays += story.waitingDays;
            storiesWithWaitDays++;
          }
        });
        const avgWaitDays = storiesWithWaitDays > 0 ? Math.round(totalWaitDays / storiesWithWaitDays) : 0;

        // Calculate vertical distribution
        const verticalCounts: { [key: string]: number } = {};
        stories.forEach(story => {
          const vertical = story.vertical || 'Other';
          verticalCounts[vertical] = (verticalCounts[vertical] || 0) + 1;
        });
        const verticalDistribution = Object.entries(verticalCounts).reduce((acc, [key, value]) => {
          acc[key] = Math.round((value / totalStories) * 100);
          return acc;
        }, {} as { [key: string]: number });

        // Calculate industry distribution
        const industryCounts: { [key: string]: number } = {};
        stories.forEach(story => {
          const industry = story.industry || 'Other';
          industryCounts[industry] = (industryCounts[industry] || 0) + 1;
        });
        const industryDistribution = Object.entries(industryCounts).reduce((acc, [key, value]) => {
          acc[key] = Math.round((value / totalStories) * 100);
          return acc;
        }, {} as { [key: string]: number });

        // Calculate experience distribution in 3-year buckets
        const experienceBuckets: { [key: string]: number } = {
          '0-3 years': 0,
          '4-6 years': 0,
          '7-9 years': 0,
          '10+ years': 0,
        };
        stories.forEach(story => {
          const years = story.yearsOfExperience;
          if (years <= 3) experienceBuckets['0-3 years']++;
          else if (years <= 6) experienceBuckets['4-6 years']++;
          else if (years <= 9) experienceBuckets['7-9 years']++;
          else experienceBuckets['10+ years']++;
        });
        const experienceDistribution = Object.entries(experienceBuckets).reduce((acc, [key, value]) => {
          acc[key] = Math.round((value / totalStories) * 100);
          return acc;
        }, {} as { [key: string]: number });

        // Calculate monthly trend
        const monthlyTrend: { [key: string]: number } = {};
        stories.forEach(story => {
          const month = format(new Date(story.submittedAt), 'MMM yyyy');
          monthlyTrend[month] = (monthlyTrend[month] || 0) + 1;
        });

        // Calculate channels distribution
        const channelCounts: { [key: string]: number } = {};
        stories.forEach(story => {
          if (Array.isArray(story.channels)) {
            story.channels.forEach(channel => {
              channelCounts[channel] = (channelCounts[channel] || 0) + 1;
            });
          }
        });
        const channelsDistribution = Object.entries(channelCounts).reduce((acc, [key, value]) => {
          acc[key] = Math.round((value / totalStories) * 100);
          return acc;
        }, {} as { [key: string]: number });

        setData({
          totalStories,
          totalCompanies,
          avgWaitDays,
          verticalDistribution,
          industryDistribution,
          experienceDistribution,
          monthlyTrend,
          channelsDistribution,
        });
        setLoading(false);
      } catch (error) {
        console.error('Error fetching insights:', error);
        setLoading(false);
      }
    }

    fetchInsights();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading insights...</div>
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
            <span className="text-gray-900">insights</span>
          </nav>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-gray-900">Interview Ghosting Insights</h1>
            <p className="text-sm text-gray-600">Data-driven insights about interview ghosting patterns across the industry.</p>
          </div>

          {/* Key Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <Users className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.totalStories.toLocaleString()}</div>
                  <div className="text-sm font-medium text-gray-600">Total Stories</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-purple-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">{data.totalCompanies.toLocaleString()}</div>
                  <div className="text-sm font-medium text-gray-600">Companies</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-amber-50 rounded-lg">
                  <Target className="w-6 h-6 text-amber-500" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {Object.entries(data.industryDistribution)
                      .sort(([, a], [, b]) => b - a)[0]?.[0] || 'N/A'}
                  </div>
                  <div className="text-sm font-medium text-gray-600">Most Ghosted Industry</div>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Insights Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vertical Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Verticals Distribution</h3>
              <div className="space-y-4">
                {Object.entries(data.verticalDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([vertical, percentage]) => (
                    <div key={vertical} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{vertical}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Industry Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Industry Distribution</h3>
              <div className="space-y-4">
                {Object.entries(data.industryDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .slice(0, 5)
                  .map(([industry, percentage]) => (
                    <div key={industry} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{industry}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-purple-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Experience Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Experience Distribution</h3>
              <div className="space-y-4">
                {Object.entries(data.experienceDistribution)
                  .map(([range, percentage]) => (
                    <div key={range} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{range}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Channels Distribution */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Communication Channels</h3>
              <div className="space-y-4">
                {Object.entries(data.channelsDistribution)
                  .sort(([, a], [, b]) => b - a)
                  .map(([channel, percentage]) => (
                    <div key={channel} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">{channel}</span>
                        <span className="text-sm font-medium">{percentage}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                          className="bg-indigo-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-medium text-gray-900 mb-4">Monthly Trend</h3>
              <div className="space-y-4">
                {Object.entries(data.monthlyTrend)
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
                          className="bg-amber-500 h-2 rounded-full"
                          style={{ width: `${(count / Math.max(...Object.values(data.monthlyTrend))) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
