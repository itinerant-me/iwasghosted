import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Shield, ChartBar, ChevronRight, Users, TrendingUp, CheckCircle2, ListCollapse, MessageSquare, Mail, Coffee, ChevronDown, Building2, User } from 'lucide-react';
import { useEffect, useState } from 'react';
import { collection, getDocs, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useView } from '../context/ViewContext';
import StoryTypeModal from '../components/StoryTypeModal';

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
  const { viewType, setViewType } = useView();
  const [isTextChanging, setIsTextChanging] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [error, setError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
    setIsTextChanging(true);
    const timer = setTimeout(() => setIsTextChanging(false), 300); 
    return () => clearTimeout(timer);
  }, [viewType]);

  useEffect(() => {
    let mounted = true;

    async function fetchMetrics() {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch all stories
        const storiesQuery = query(collection(db, 'stories'));
        const storiesSnapshot = await getDocs(storiesQuery);
        
        if (!mounted) return;
        
        const stories = storiesSnapshot.docs.map(doc => doc.data());
        
        // Filter stories based on viewType
        const filteredStories = stories.filter(story => {
          const type = story.type || 'candidate'; // Default to candidate for older entries
          return viewType === 'recruiter' ? type === 'recruiter' : type !== 'recruiter';
        });

        // Calculate total stories
        const totalStories = filteredStories.length;

        // Calculate average wait days
        const totalWaitDays = filteredStories.reduce((acc, story) => {
          const waitDays = parseInt(story.waitingDays || '0', 10);
          return acc + waitDays;
        }, 0);
        const averageWaitDays = Math.round(totalWaitDays / totalStories) || 0;

        // Calculate unique companies using the domain field
        const uniqueCompanies = new Set(filteredStories.map(story => story.domain)).size;

        // Calculate industry distribution
        const industries = filteredStories.reduce((acc, story) => {
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

        if (mounted) {
          setMetrics({
            totalStories,
            averageWaitDays,
            uniqueCompanies,
            topIndustry: {
              name: topIndustry.name,
              percentage: topIndustryPercentage
            }
          });
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        if (mounted) {
          setError('Failed to load metrics. Please try refreshing the page.');
          // Set fallback values
          setMetrics({
            totalStories: 0,
            averageWaitDays: 0,
            uniqueCompanies: 0,
            topIndustry: {
              name: 'Tech',
              percentage: 0
            }
          });
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    fetchMetrics();

    return () => {
      mounted = false;
    };
  }, [viewType]);

  return (
    <div className="min-h-screen">
      {error && (
        <div className="fixed top-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 shadow-lg">
          <p className="text-red-800 text-sm">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Floating Buy Me a Coffee Button */}
      <a
        href="https://buymeacoffee.com/itinerantmq"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-5 right-5 inline-flex items-center gap-2 px-4 py-2.5 bg-[#FFDD00] text-gray-900 rounded-full shadow-lg hover:bg-[#FFDD00]/90 transition-all hover:shadow-xl z-50"
      >
        <Coffee className="w-5 h-5" />
        <span className="font-medium text-sm whitespace-nowrap">Support me with coffee</span>
      </a>

      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Logo and Dropdown */}
            <div className="flex items-center gap-4">
              <a href="/" className="text-xl font-bold text-gray-900">
                iwg
              </a>

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
                  <div className="absolute left-0 mt-1 w-52 bg-white rounded-lg shadow-lg ring-1 ring-black/5 py-1 animate-in fade-in slide-in-from-top-1 duration-100">
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

            {/* Desktop Navigation */}
            <nav className="hidden sm:flex items-center space-x-6">
              <Link to="/stories" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Stories
              </Link>
              <Link to="/insights" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Insights
              </Link>
              <Link to="/wall-of-shame" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Wall of Shame
              </Link>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Share Story
              </button>
            </nav>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="sm:hidden p-2 -mr-2 text-gray-600 hover:text-gray-900 focus:outline-none"
            >
              <div className="w-5 h-4 flex flex-col justify-between">
                <span className={`block w-5 h-0.5 bg-current transform transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
                <span className={`block w-5 h-0.5 bg-current transform transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </div>
            </button>
          </div>

          {/* Mobile Navigation Menu */}
          {isMobileMenuOpen && (
            <div className="sm:hidden mt-2 py-2 border-t border-gray-100">
              <nav className="flex flex-col space-y-1">
                <Link to="/stories" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                  Stories
                </Link>
                <Link to="/insights" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                  Insights
                </Link>
                <Link to="/wall-of-shame" className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg">
                  Wall of Shame
                </Link>
                <button
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full px-3 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg text-left"
                >
                  Share Story
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white">
        <div className="absolute inset-0 bg-grid-gray-900/[0.02] bg-[size:32px_32px]" />
        
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-32 text-center">
          <div className="inline-flex items-center px-3 py-1 rounded-full bg-gray-900/5 text-gray-900">
            <span className="text-sm font-medium">i-was-ghosted : time to speak up</span>
          </div>
          
          <div 
            className={`transform transition-all duration-300 ease-in-out ${
              isTextChanging 
                ? 'opacity-0 translate-y-4' 
                : 'opacity-100 translate-y-0'
            }`}
          >
            <h1 className="mt-8 text-4xl sm:text-6xl font-bold text-gray-900 tracking-tight">
              {viewType === 'candidate' ? (
                <>
                  Track interview ghosting
                  <br />
                  <span className="text-blue-600">Help others avoid it.</span>
                </>
              ) : (
                <>
                  Track candidate ghosting
                  <br />
                  <span className="text-blue-600">Help other recruiters.</span>
                </>
              )}
            </h1>
            
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              {viewType === 'candidate' 
                ? "Building transparency in hiring, one story at a time. Join our community-driven initiative to make interview processes more accountable."
                : "Share your experiences with candidate ghosting. Help fellow recruiters identify patterns and make hiring processes more efficient."}
            </p>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Share Your Story
              <ArrowRight className="h-4 w-4" />
            </button>
            
            <Link
              to="/stories"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
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
              <div className="mt-1 text-sm text-gray-600">Total Stories</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  metrics.averageWaitDays
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">Average Wait Days</div>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="text-3xl font-bold text-gray-900">
                {isLoading ? (
                  <div className="h-9 bg-gray-100 animate-pulse rounded" />
                ) : (
                  metrics.uniqueCompanies.toLocaleString()
                )}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Unique Companies
              </div>
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
      <section className="py-24 bg-gray-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div 
            className={`transform transition-all duration-300 ease-in-out text-center mb-16 ${
              isTextChanging 
                ? 'opacity-0 translate-y-4' 
                : 'opacity-100 translate-y-0'
            }`}
          >
            <h2 className="text-3xl font-bold text-white">
              {viewType === 'candidate' ? 'Real Impact, Real Change' : 'Real Stories, Real Impact'}
            </h2>
            <p className="mt-4 text-lg text-gray-300">
              {viewType === 'candidate' 
                ? 'Our community is making waves in the hiring landscape'
                : 'Helping recruiters navigate candidate ghosting through shared experiences'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div 
                className={`transform transition-all duration-300 ease-in-out space-y-6 ${
                  isTextChanging 
                    ? 'opacity-0 translate-y-4' 
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {viewType === 'candidate' ? '38% Success Rate' : '42% Response Rate'}
                    </h3>
                    <p className="text-gray-600">
                      {viewType === 'candidate' 
                        ? 'Successful matches after implementing feedback-driven changes'
                        : 'Candidates responded after implementing pre-screening improvements'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {viewType === 'candidate' ? '652 Recruiters' : '834 Recruiters'}
                    </h3>
                    <p className="text-gray-600">
                      {viewType === 'candidate'
                        ? 'Active recruiters sharing insights and best practices'
                        : 'Sharing experiences and solutions to candidate ghosting'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {viewType === 'candidate' ? '957 Reports' : '1,243 Cases'}
                    </h3>
                    <p className="text-gray-600">
                      {viewType === 'candidate'
                        ? 'Documented cases helping improve hiring processes'
                        : 'Documented instances of candidate ghosting helping others prepare'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 text-white">
              <h3 className="text-xl font-semibold mb-6">
                {viewType === 'candidate' ? 'Recent Recruiter Insights' : 'Recent Recruiter Experiences'}
              </h3>
              
              <div 
                className={`transform transition-all duration-300 ease-in-out space-y-6 ${
                  isTextChanging 
                    ? 'opacity-0 translate-y-4' 
                    : 'opacity-100 translate-y-0'
                }`}
              >
                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    {viewType === 'candidate'
                      ? '"Implemented a new feedback system after seeing patterns in candidate ghosting reports."'
                      : '"Started using pre-screening calls to better assess candidate commitment levels."'}
                  </p>
                  <p className="text-gray-400 text-sm">Technical Recruiter • San Francisco</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    {viewType === 'candidate'
                      ? '"Reduced candidate ghosting by 45% after implementing clear timeline communications."'
                      : '"Created a shared database of ghosting patterns to help other recruiters prepare."'}
                  </p>
                  <p className="text-gray-400 text-sm">HR Manager • New York</p>
                </div>

                <div className="space-y-2">
                  <p className="text-gray-300 text-sm">
                    {viewType === 'candidate'
                      ? '"Sharing experiences with other recruiters helped establish better practices."'
                      : '"Developed new screening questions that reduced ghosting by 60%."'}
                  </p>
                  <p className="text-gray-400 text-sm">Talent Acquisition • London</p>
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
            <p className="text-gray-600 text-lg">Everything you need to share and track interview experiences</p>
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
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-black px-4 py-2.5 text-sm font-semibold text-white hover:bg-gray-800"
          >
            Share Your Experience
            <ChevronRight className="h-4 w-4" />
          </button>
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
                className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              >
                <Mail className="w-5 h-5 hover:text-blue-600 transition-colors" />
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

      {/* Story Type Modal */}
      <StoryTypeModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}