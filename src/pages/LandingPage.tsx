import { Link } from 'react-router-dom';
import { ArrowRight, Share2, BookOpen, Shield, ChartBar, ChevronRight, Users, TrendingUp, CheckCircle2, ListCollapse, MessageSquare, Mail, Coffee, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../firebase';

interface Metrics {
  totalStories: number;
  averageWaitDays: number;
  uniqueCompanies: number;
  topIndustry: {
    name: string;
    percentage: number;
  };
}

export default function LandingPage() {
  const [metrics, setMetrics] = useState<Metrics>({
    totalStories: 0,
    averageWaitDays: 0,
    uniqueCompanies: 0,
    topIndustry: {
      name: '',
      percentage: 0
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is i-was-ghosted?",
      answer: "i-was-ghosted is a platform where job seekers can share their experiences of being 'ghosted' during the interview process. We aim to create transparency in hiring practices and help others avoid similar situations."
    },
    {
      question: "How do you verify the stories?",
      answer: "While stories can be submitted anonymously, we offer an optional verification process where users can verify their existence via google authentication. Verified user stories are marked accordingly to maintain credibility."
    },
    {
      question: "Can companies respond to stories?",
      answer: "Not right now, but in near future yes - verified company representatives would be able to respond to stories about their organization. This promotes dialogue and helps companies improve their hiring processes."
    },
    {
      question: "Will my identity be protected?",
      answer: "Absolutely. You can choose to remain completely anonymous when sharing your story. We never share personal identifying information without explicit consent."
    },
    {
      question: "What happens after I share my story?",
      answer: "Your story becomes part of our database, helping others understand company hiring practices. It may also prompt companies to improve their interview processes and communication."
    },
    {
      question: "Can I edit or remove my story later?",
      answer: "Currently, only content that is abusive in nature or carries Personal identification are struck down. In future, you can edit or remove your story at any time through your account. If you posted anonymously, you'll not be allowed to edit or remove the story."
    }
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    async function fetchMetrics() {
      try {
        // Fetch all stories
        const storiesQuery = query(collection(db, 'stories'));
        const storiesSnapshot = await getDocs(storiesQuery);
        const stories = storiesSnapshot.docs.map(doc => doc.data());

        // Calculate total stories
        const totalStories = stories.length;

        // Calculate average wait days - parse the string to number
        const totalWaitDays = stories.reduce((acc, story) => {
          const waitDays = parseInt(story.waitingDays || '0', 10);
          return acc + waitDays;
        }, 0);
        const averageWaitDays = Math.round(totalWaitDays / totalStories) || 0;

        // Calculate unique companies using the domain field
        const uniqueCompanies = new Set(stories.map(story => story.domain)).size;

        // Calculate industry distribution
        const industries = stories.reduce((acc, story) => {
          const industry = story.industry || 'Other';
          acc[industry] = (acc[industry] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        // Find top industry
        let topIndustry = { name: '', count: 0 };
        Object.entries(industries).forEach(([industry, count]) => {
          if (count > topIndustry.count) {
            topIndustry = { name: industry, count };
          }
        });

        const topIndustryPercentage = Math.round((topIndustry.count / totalStories) * 100);

        setMetrics({
          totalStories,
          averageWaitDays,
          uniqueCompanies,
          topIndustry: {
            name: topIndustry.name,
            percentage: topIndustryPercentage
          }
        });
      } catch (error) {
        console.error('Error fetching metrics:', error);
        // Set fallback values in case of error
        setMetrics({
          totalStories: 0,
          averageWaitDays: 0,
          uniqueCompanies: 0,
          topIndustry: {
            name: 'Tech',
            percentage: 0
          }
        });
      } finally {
        setIsLoading(false);
      }
    }

    fetchMetrics();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Floating Buy Me a Coffee Button */}
      <a
        href="https://buymeacoffee.com/itinerantmq"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFDD00] text-gray-900 rounded-full shadow-lg hover:bg-[#FFDD00]/90 transition-all hover:shadow-xl group z-50"
      >
        <Coffee className="w-5 h-5" />
        <span className="font-medium text-sm whitespace-nowrap">Support me with coffee</span>
      </a>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/5 text-gray-900">
            <span className="text-sm font-medium">time to speak up</span>
          </div>
          
          <h1 className="mt-8 text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
            Track interview ghosting.
            <br />
            <span className="text-blue-600">Help others avoid it.</span>
          </h1>
          
          <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Building transparency in hiring, one story at a time. Join our community-driven initiative to make interview processes more accountable.
          </p>
          
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/submit"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              Share Your Story
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
            
            <Link
              to="/stories"
              className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              <BookOpen className="w-4 h-4" />
              Browse Stories
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  metrics.totalStories.toLocaleString()
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Stories Shared</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  metrics.averageWaitDays
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Days Average Wait</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  metrics.uniqueCompanies.toLocaleString()
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Companies Listed</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  `${metrics.topIndustry.percentage}%`
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">{metrics.topIndustry.name} Industry</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Share Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Share Your Story?</h2>
            <p className="mt-4 text-lg text-gray-600">Your experience matters. Help create a more transparent hiring landscape.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Support Others</h3>
              <p className="text-gray-600">Help fellow candidates avoid similar situations and make informed decisions.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Drive Change</h3>
              <p className="text-gray-600">Contribute to better hiring practices by holding companies accountable.</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Stay Anonymous</h3>
              <p className="text-gray-600">Share your experience safely and privately, with optional verification.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Real Impact, Real Change</h2>
            <p className="mt-4 text-lg text-gray-600">Our community is making waves in the hiring landscape</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">42% Response Rate</h3>
                    <p className="text-gray-600">Companies are responding to feedback and improving their processes</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">789 Companies</h3>
                    <p className="text-gray-600">Major tech companies are now actively monitoring their reputation</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">1,234 Stories</h3>
                    <p className="text-gray-600">Shared experiences helping others make informed decisions</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">Recent Success Stories</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">"After our story went viral, [Company] implemented a mandatory 48-hour response policy."</p>
                  <p className="text-gray-400 text-sm">Senior Engineer • San Francisco</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">"The transparency helped me avoid a company known for ghosting after final rounds."</p>
                  <p className="text-gray-400 text-sm">Product Manager • New York</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">"Found out I wasn't alone. The community support was invaluable."</p>
                  <p className="text-gray-400 text-sm">Data Scientist • London</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Powerful Features</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to share and track interview experiences</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6">
              <ListCollapse className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Structured Reporting</h3>
              <p className="text-gray-600">Easily document your experience with our guided form process</p>
            </div>

            <div className="p-6">
              <ChartBar className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Data Insights</h3>
              <p className="text-gray-600">Access trends and patterns across companies and industries</p>
            </div>

            <div className="p-6">
              <MessageSquare className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Community Support</h3>
              <p className="text-gray-600">Connect with others who've had similar experiences</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Frequently Asked Questions</h2>
            <p className="mt-4 text-lg text-gray-600">Everything you need to know about sharing and browsing interview experiences</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50"
                >
                  <span className="text-base font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
                      openFaq === index ? 'transform rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === index && (
                  <div className="px-6 py-4 border-t border-gray-100 bg-gray-50">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-gray-900 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Share Your Story?</h2>
          <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of professionals making the hiring process more transparent.
            Your story matters.
          </p>
          <Link
            to="/submit"
            className="group inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-gray-900 bg-white rounded-lg hover:bg-gray-50 transition-colors"
          >
            Share Your Experience
            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Main Footer Content */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Section */}
            <div className="space-y-3">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">iwg</h3>
                <p className="text-base text-gray-600 mt-1">Unmasking the Silence, Exposing the Truth</p>
              </div>
              <a 
                href="mailto:itinerant.me@gmail.com"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors group"
              >
                <Mail className="w-5 h-5 group-hover:text-blue-600 transition-colors" />
                <span className="text-sm">itinerant.me@gmail.com</span>
              </a>
            </div>

            {/* Links Section */}
            <div className="md:flex md:justify-end">
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Legal</h4>
                <div className="flex flex-col space-y-2">
                  <Link to="/terms" className="text-base text-gray-600 hover:text-blue-600 transition-colors">Terms of Service</Link>
                  <Link to="/privacy" className="text-base text-gray-600 hover:text-blue-600 transition-colors">Privacy Policy</Link>
                  <Link to="/about" className="text-base text-gray-600 hover:text-blue-600 transition-colors">About Us</Link>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright Bar */}
          <div className="py-4 border-t border-gray-100">
            <p className="text-sm text-gray-600 text-center">
              &copy; {new Date().getFullYear()} iwg inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}