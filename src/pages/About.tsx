import { ChevronRight } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <a href="/" className="hover:text-gray-700 transition-colors">iwg</a>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900">about</span>
        </nav>
      </div>

      {/* Manifesto */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
        <article className="prose prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
            Our Manifesto
          </h1>

          <p className="text-xl text-gray-600 mb-12 text-center">
            We believe that every interview experience matters, and every voice deserves to be heard.
          </p>

          <div className="space-y-12">
            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Dear fellow job seeker,</h2>
              <p>
                We know what it feels like. The excitement of applying for that perfect role. 
                The preparation for the interviews. The hope that builds with each round. And then... silence. 
                Complete radio silence.
              </p>
              <p>
                You're not alone. Whether you're a software engineer, designer, product manager, 
                marketer, or anyone else in the professional world – ghosting has become an 
                all-too-common experience that leaves us questioning ourselves and the system.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">The Reality</h2>
              <div className="grid sm:grid-cols-2 gap-6 my-8">
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">76%</div>
                  <p className="text-gray-600">of employers reported an increase in ghosting since 2019</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">28%</div>
                  <p className="text-gray-600">of candidates have experienced multiple instances of ghosting</p>
                </div>
              </div>
              <p>
                But these aren't just numbers. Each percentage represents countless hours of 
                preparation, emotional investment, and professional aspirations put on hold. 
                The impact goes beyond just lost time – it affects our confidence, our trust 
                in the hiring process, and our willingness to put ourselves out there again.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Why We Exist</h2>
              <p>
                i-was-ghosted isn't just another platform. It's a movement born from our 
                collective experiences. We're here to:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Give voice to your experiences, whether positive or negative</li>
                <li>Create transparency in the hiring process</li>
                <li>Help others avoid similar situations</li>
                <li>Drive meaningful change in how companies treat candidates</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Our Promise</h2>
              <p>
                We promise to maintain a space where:
              </p>
              <ul className="list-disc pl-6 mt-4 space-y-2">
                <li>Every story is valued, regardless of your role or experience level</li>
                <li>Your experiences are shared safely and respectfully</li>
                <li>Companies can learn and improve from authentic feedback</li>
                <li>The community supports and empowers each other</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">Join Us</h2>
              <p>
                Your story matters. Whether you've experienced ghosting firsthand or want to 
                help create a more respectful hiring environment, you have a place here. 
                Together, we can make the job search process more transparent, more humane, 
                and more respectful for everyone.
              </p>
            </section>
          </div>
        </article>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <a 
            href="/submit" 
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </div>
  );
}