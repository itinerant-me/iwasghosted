import { ChevronRight, Mail, Coffee } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function Terms() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white">
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

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">terms</span>
        </nav>
      </div>

      {/* Terms Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Terms of Service
          </h1>

          <p className="text-xl text-gray-600 mb-12 text-center">
            By using i-was-ghosted, you agree to share responsibly and help maintain a respectful community.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Acceptance of Terms</h2>
              <p>
                By accessing or using i-was-ghosted, you agree to be bound by these Terms of 
                Service. If you disagree with any part of these terms, you may not access our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Content Guidelines</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="font-medium">When sharing your experiences, you agree to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Share truthful and accurate information</li>
                  <li>Focus on the interview process and experience</li>
                  <li>Maintain professional discourse</li>
                  <li>Respect others' privacy</li>
                  <li>Avoid sharing personally identifiable information</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Prohibited Content</h2>
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <p className="font-medium">You may not post content that:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Contains personal attacks or harassment</li>
                  <li>Reveals confidential company information</li>
                  <li>Names specific individuals involved in the process</li>
                  <li>Contains discriminatory or hateful speech</li>
                  <li>Promotes illegal activities</li>
                  <li>Includes spam or promotional material</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your Rights</h2>
              <p>
                You retain your rights to the content you post. By submitting content, you grant 
                us a worldwide, non-exclusive license to use, store, and display your content 
                within our service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Rights</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>We reserve the right to remove content that violates these terms</li>
                <li>We may modify or discontinue any part of the service at any time</li>
                <li>We can update these terms with reasonable notice</li>
                <li>We maintain the right to moderate content for quality and compliance</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Disclaimer</h2>
              <div className="bg-gray-50 rounded-lg p-6">
                <p>
                  i-was-ghosted is provided "as is" without warranties of any kind. We are not 
                  responsible for the accuracy of user-submitted content or any actions taken 
                  based on such content. Users are solely responsible for their use of the service 
                  and any consequences thereof.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, i-was-ghosted and its operators shall not 
                be liable for any indirect, incidental, special, consequential, or punitive damages 
                resulting from your use or inability to use the service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Changes to Terms</h2>
              <p>
                We may revise these terms at any time. By continuing to use i-was-ghosted after 
                changes become effective, you agree to be bound by the revised terms.
              </p>
            </section>

            <section className="bg-blue-50 rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Contact Us</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us at 
                itinerant.me@com. We're here to help ensure a positive experience for 
                everyone in our community.
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