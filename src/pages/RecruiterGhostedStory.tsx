import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { db, auth } from '../firebase';
import RecruiterGhostedStoryForm, { FormData } from '../components/RecruiterGhostedStoryForm';
import StoryPreview from '../components/StoryPreview';
import { Eye, EyeOff } from 'lucide-react';
import Breadcrumb from '../components/Breadcrumb';

const initialFormData: FormData = {
  company: '',
  domain: '',
  role: '',
  department: '',
  customDepartment: '',
  industry: '',
  customIndustry: '',
  vertical: '',
  customVertical: '',
  yearsOfExperience: 0,
  location: '',
  comments: '',
  roundGhosted: '',
  communicationEndDate: '',
  channels: [],
  nextStepsPromised: '',
  waitingDays: 0,
  processStartDate: '',
  logo: '',
  jobUrl: '',
  candidateSource: '',
  applicationSource: '',
  isAnonymous: false,
  isVerified: false
};

export default function RecruiterGhostedStory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);

  // Sign out user on page load
  useEffect(() => {
    signOut(auth).catch(console.error);
  }, []);

  const handleSubmit = async (isAnonymous: boolean = true) => {
    try {
      const storiesRef = collection(db, 'stories');
      const submissionData = {
        ...formData,
        submittedAt: new Date().toISOString(),
        isAnonymous,
        userId: isAnonymous ? null : auth.currentUser?.uid,
        userEmail: isAnonymous ? null : auth.currentUser?.email,
        type: 'recruiter'
      };

      await addDoc(storiesRef, submissionData);
      navigate('/stories');
    } catch (error) {
      console.error('Error submitting story:', error);
      throw error;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Breadcrumb />
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="hidden md:flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                {showPreview ? (
                  <>
                    <EyeOff className="w-4 h-4" />
                    Hide Preview
                  </>
                ) : (
                  <>
                    <Eye className="w-4 h-4" />
                    Show Preview
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${showPreview ? 'grid md:grid-cols-2 gap-8' : 'w-full'}`}>
          <div className="w-full">
            <RecruiterGhostedStoryForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
            />
          </div>

          {showPreview && (
            <div className="sticky top-24">
              <StoryPreview story={formData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}