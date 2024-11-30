import { ChevronRight, Mail, Coffee } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Privacy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-500">
            <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">privacy</span>
          </nav>
        </div>
      </div>

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

      {/* Privacy Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Privacy Policy
          </h1>

          <p className="text-xl text-gray-600 mb-12 text-center">
            Your privacy and anonymity are our top priorities. Period.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Commitment to Anonymity</h2>
              <p>
                At i-was-ghosted, we understand that sharing interview experiences requires trust. 
                That's why we've built our platform with anonymity at its core. We believe that 
                honest feedback should be possible without fear of repercussions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data We Collect</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="font-medium">We only collect and store:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>The content of your shared experiences</li>
                  <li>Basic metadata about the interview process</li>
                  <li>Industry and role information (without identifying details)</li>
                  <li>Timeline information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data We Don't Collect</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="font-medium">We never collect or store:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Personal identification information</li>
                  <li>Email addresses</li>
                  <li>IP addresses</li>
                  <li>Location data</li>
                  <li>Browser fingerprints</li>
                  <li>Cookies for tracking</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Promise</h2>
              <div className="space-y-4">
                <p>
                  We will <span className="font-semibold">never</span>:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Sell your data to third parties</li>
                  <li>Share information with employers or recruiters</li>
                  <li>Use your experiences for marketing without explicit consent</li>
                  <li>Track your activity across other websites</li>
                  <li>Store any personally identifiable information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Data Security</h2>
              <p>
                We take the security of your data seriously. All data is:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Encrypted in transit and at rest</li>
                <li>Stored securely in cloud infrastructure</li>
                <li>Regularly backed up and monitored</li>
                <li>Protected by industry-standard security measures</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Moderation</h2>
              <p>
                To maintain the integrity of our platform, we moderate content to ensure it:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Doesn't contain personally identifiable information</li>
                <li>Maintains professional discourse</li>
                <li>Focuses on the interview experience rather than individuals</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Updates to Privacy Policy</h2>
              <p>
                We may update this privacy policy as our platform evolves. Any changes will be 
                posted here, and we will notify users of significant updates. Our commitment to 
                privacy and anonymity will never change.
              </p>
            </section>

            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Questions?</h2>
              <p>
                If you have any questions about our privacy practices or how we handle data, 
                please reach out to us at itinerant.me@com. Your privacy matters to us, 
                and we're here to address any concerns you may have.
              </p>
            </section>
          </div>
        </article>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* Main Footer Content */}
          <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Brand Section */}
            <div className="space-y-3">
              <div>
                <Link to="/" className="inline-block">
                  <h3 className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">iwg</h3>
                </Link>
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