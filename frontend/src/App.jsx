import { useState } from 'react'
import NoteUploadForm from './components/NoteUploadForm'
import PaperRequirementsForm from './components/PaperRequirementsForm'
import QuestionPaperDisplay from './components/QuestionPaperDisplay'

function App() {
  const [currentStep, setCurrentStep] = useState(1) // 1: Upload, 2: Requirements, 3: Display
  const [sessionId, setSessionId] = useState(null)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [questionPaper, setQuestionPaper] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleNotesUploaded = (data) => {
    setSessionId(data.session_id)
    setUploadedFiles(data.files_uploaded)
    setCurrentStep(2)
    setError(null)
  }

  const handlePaperGenerated = (paper) => {
    setQuestionPaper(paper)
    setCurrentStep(3)
    setError(null)
  }

  const handleBackToUpload = () => {
    setCurrentStep(1)
    setSessionId(null)
    setUploadedFiles([])
    setQuestionPaper(null)
    setError(null)
  }

  const handleBackToRequirements = () => {
    setCurrentStep(2)
    setQuestionPaper(null)
    setError(null)
  }

  const handleNewPaper = () => {
    setCurrentStep(2)
    setQuestionPaper(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Question Paper Generator
          </h1>
          <p className="text-lg text-gray-600">
            Upload your unit notes and generate structured question papers automatically
          </p>
        </header>

        {/* Progress Indicator */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-center space-x-8">
            <div className={`flex items-center ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="ml-2 font-medium">Upload Notes</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-2 font-medium">Set Requirements</span>
            </div>
            <div className={`w-16 h-0.5 ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="ml-2 font-medium">Generate Paper</span>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  Error
                </h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Processing...</span>
            </div>
          </div>
        )}

        {/* Step 1: Upload Notes */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Step 1: Upload Unit Notes
            </h2>
            <NoteUploadForm 
              onUploaded={handleNotesUploaded}
              onError={setError}
              onLoading={setLoading}
            />
          </div>
        )}

        {/* Step 2: Set Requirements */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Step 2: Set Paper Requirements
              </h2>
              <button
                onClick={handleBackToUpload}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                ← Back to Upload
              </button>
            </div>
            
            {uploadedFiles.length > 0 && (
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="text-sm font-medium text-green-800 mb-2">Uploaded Files:</h3>
                <ul className="text-sm text-green-700">
                  {uploadedFiles.map((file, index) => (
                    <li key={index}>• {file}</li>
                  ))}
                </ul>
              </div>
            )}

            <PaperRequirementsForm 
              sessionId={sessionId}
              onPaperGenerated={handlePaperGenerated}
              onError={setError}
              onLoading={setLoading}
            />
          </div>
        )}

        {/* Step 3: Display Generated Paper */}
        {currentStep === 3 && questionPaper && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Generated Question Paper
              </h2>
              <div className="flex space-x-2">
                <button
                  onClick={handleNewPaper}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Generate New Paper
                </button>
                <button
                  onClick={handleBackToRequirements}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  ← Back to Requirements
                </button>
              </div>
            </div>

            <QuestionPaperDisplay 
              questionPaper={questionPaper}
              onError={setError}
            />
          </div>
        )}
      </div>
    </div>
  )
}

export default App