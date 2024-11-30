import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { signInWithPopup, onAuthStateChanged } from 'firebase/auth';
import { db, auth, googleProvider } from '../lib/firebase';
import GhostedStoryForm from '../components/GhostedStoryForm';
import StoryPreview from '../components/StoryPreview';
import Breadcrumb from '../components/Breadcrumb';
import { Send, Eye, EyeOff, Shield, UserX } from 'lucide-react';

interface FormData {
  company: string;
  domain: string;
  role: string;
  department: string;
  customDepartment?: string;
  industry: string;
  customIndustry?: string;
  vertical: string;
  customVertical?: string;
  yearsOfExperience: number;
  location: string;
  comments: string;
  roundGhosted: string;
  communicationEndDate: string;
  channels: string[];
  nextStepsPromised: string;
  waitingDays: number;
  processStartDate: string;
  logo: string;
  jobUrl: string;
  applicationSource: 'approached' | 'applied' | '';
}

const initialFormData: FormData = {
  company: '',
  domain: '',
  role: '',
  department: '',
  industry: '',
  vertical: '',
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
  applicationSource: '',
};

export default function GhostedStory() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [showPreview, setShowPreview] = useState(false);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = () => {
    setShowSubmitModal(true);
    setAuthError(null);
  };

  const saveToFirestore = async (data: FormData) => {
    try {
      setSubmitting(true);
      const storiesRef = collection(db, 'stories');
      await addDoc(storiesRef, {
        ...data,
        submittedAt: new Date().toISOString(),
      });
      navigate('/stories');
    } catch (error: any) {
      console.error('Error saving story:', error);
      throw new Error(error.message || 'Failed to save your story');
    } finally {
      setSubmitting(false);
    }
  };

  const submitAsAnonymous = async () => {
    try {
      setAuthError(null);
      const finalData = {
        ...formData,
        isAnonymous: true,
        isVerified: false,
        userId: null
      };
      await saveToFirestore(finalData);
    } catch (error: any) {
      setAuthError(error.message);
    }
  };

  const submitAsVerified = async () => {
    try {
      setAuthError(null);
      let currentUser = user;
      
      if (!currentUser) {
        const result = await signInWithPopup(auth, googleProvider);
        currentUser = result.user;
      }

      const finalData = {
        ...formData,
        isAnonymous: false,
        isVerified: true,
        userId: currentUser.uid,
        userEmail: currentUser.email
      };
      await saveToFirestore(finalData);
    } catch (error: any) {
      console.error('Error during verified submission:', error);
      setAuthError(error.message || 'Failed to submit as verified user');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <Breadcrumb />
        </div>
      </div>

      <div className={`max-w-7xl mx-auto px-4 sm:px-6 py-8 ${showPreview ? 'grid md:grid-cols-2 gap-8' : ''}`}>
        <div className={showPreview ? '' : 'w-full'}>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-xl font-semibold text-gray-900">Share Your Ghost Story</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
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
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Send className="w-4 h-4" />
                Submit Story
              </button>
            </div>
          </div>
          
          <GhostedStoryForm
            formData={formData}
            setFormData={setFormData}
            onSubmit={handleSubmit}
            onPreview={() => setShowPreview(true)}
          />
        </div>

        {showPreview && (
          <div className="sticky top-24">
            <StoryPreview story={formData} view="detailed" />
          </div>
        )}
      </div>

      {/* Submit Modal */}
      {showSubmitModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6 space-y-6">
            <h3 className="text-sm font-semibold text-gray-900">Choose Submission Method</h3>
            
            {authError && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg">
                {authError}
              </div>
            )}
            
            <button
              onClick={submitAsVerified}
              disabled={submitting}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-blue-600" />
                <div className="text-left">
                  <p className="text-xs font-medium text-blue-900">
                    {user ? 'Submit as ' + user.email : 'Submit as Verified User'}
                  </p>
                  <p className="text-xs text-blue-700">
                    {user ? 'Your story will be verified' : 'Sign in with Google to verify your identity'}
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={submitAsAnonymous}
              disabled={submitting}
              className="w-full flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              <div className="flex items-center gap-3">
                <UserX className="w-4 h-4 text-gray-600" />
                <div className="text-left">
                  <p className="text-xs font-medium text-gray-900">Submit Anonymously</p>
                  <p className="text-xs text-gray-600">Your identity will remain private</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => setShowSubmitModal(false)}
              disabled={submitting}
              className="w-full px-3 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}