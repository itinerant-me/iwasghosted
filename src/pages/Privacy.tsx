import { ChevronRight } from 'lucide-react';

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">privacy</span>
        </nav>
      </div>

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
    </div>
  );
}