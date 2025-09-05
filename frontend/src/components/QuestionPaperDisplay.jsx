import { useState } from 'react'

function QuestionPaperDisplay({ questionPaper, onError }) {
  const [downloading, setDownloading] = useState({})

  const handleDownload = async (format) => {
    setDownloading(prev => ({ ...prev, [format]: true }))
    
    try {
      const response = await fetch(`http://localhost:8000/download/${questionPaper.id}/${format}`)
      
      if (!response.ok) {
        throw new Error(`Failed to download ${format} file`)
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${questionPaper.subject.replace(/\s+/g, '_')}_Question_Paper.${format}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      onError(err.message)
      console.error(`Error downloading ${format}:`, err)
    } finally {
      setDownloading(prev => ({ ...prev, [format]: false }))
    }
  }

  const groupQuestionsByType = () => {
    const grouped = {}
    questionPaper.questions.forEach(question => {
      if (!grouped[question.type]) {
        grouped[question.type] = []
      }
      grouped[question.type].push(question)
    })
    return grouped
  }

  const getCategoryInfo = (type) => {
    const categoryMap = {
      'mcq': { name: 'Multiple Choice Questions', description: 'Questions with 4 options (A, B, C, D)' },
      'short_answer': { name: 'Short Answer Questions', description: 'Brief answers (2-3 sentences)' },
      'long_answer': { name: 'Long Answer Questions', description: 'Detailed answers (1-2 paragraphs)' },
      'case_study': { name: 'Case Study Questions', description: 'Scenario-based questions with multiple parts' },
      'application_based': { name: 'Application-Based Questions', description: 'Questions requiring practical application' },
      'numerical': { name: 'Numerical Questions', description: 'Questions requiring calculations' }
    }
    return categoryMap[type] || { name: type, description: '' }
  }

  const groupedQuestions = groupQuestionsByType()

  return (
    <div className="space-y-6">
      {/* Paper Header */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <div className="text-center mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{questionPaper.subject}</h1>
          <p className="text-lg text-gray-600">Question Paper</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-sm text-gray-500">Total Marks</p>
            <p className="text-lg font-semibold text-gray-900">{questionPaper.total_marks}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Duration</p>
            <p className="text-lg font-semibold text-gray-900">{questionPaper.duration} min</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Difficulty</p>
            <p className="text-lg font-semibold text-gray-900 capitalize">{questionPaper.difficulty}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Questions</p>
            <p className="text-lg font-semibold text-gray-900">{questionPaper.questions.length}</p>
          </div>
        </div>
      </div>

      {/* Download Options */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-gray-800 mb-3">Download Options</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => handleDownload('pdf')}
            disabled={downloading.pdf}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {downloading.pdf ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download PDF
              </>
            )}
          </button>
          
          <button
            onClick={() => handleDownload('docx')}
            disabled={downloading.docx}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {downloading.docx ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download DOCX
              </>
            )}
          </button>
          
          <button
            onClick={() => handleDownload('json')}
            disabled={downloading.json}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
          >
            {downloading.json ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Generating...
              </>
            ) : (
              <>
                <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download JSON
              </>
            )}
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <h3 className="text-lg font-medium text-yellow-800 mb-2">Instructions</h3>
        <ul className="text-sm text-yellow-700 space-y-1">
          <li>• Read all questions carefully before attempting.</li>
          <li>• Answer all questions in the order given.</li>
          <li>• Show all working for numerical questions.</li>
          <li>• Write clearly and legibly.</li>
          <li>• Time management is crucial - allocate time according to marks.</li>
        </ul>
      </div>

      {/* Questions by Category */}
      <div className="space-y-8">
        {Object.entries(groupedQuestions).map(([type, questions], categoryIndex) => {
          const categoryInfo = getCategoryInfo(type)
          let questionNumber = 1
          
          // Calculate starting question number
          for (let i = 0; i < categoryIndex; i++) {
            const prevType = Object.keys(groupedQuestions)[i]
            questionNumber += groupedQuestions[prevType].length
          }
          
          return (
            <div key={type} className="border border-gray-200 rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {categoryInfo.name}
                </h2>
                <p className="text-sm text-gray-600 mb-2">{categoryInfo.description}</p>
                <p className="text-sm text-gray-500">
                  {questions.length} question{questions.length !== 1 ? 's' : ''} • {questions[0]?.marks} marks each
                </p>
              </div>
              
              <div className="space-y-6">
                {questions.map((question, index) => (
                  <div key={question.id} className="border-l-4 border-blue-500 pl-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-medium text-gray-800">
                        Q{questionNumber + index}. {question.question}
                      </h3>
                      <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {question.marks} marks
                      </span>
                    </div>
                    
                    {question.options && (
                      <div className="ml-4 space-y-2">
                        {question.options.map((option, optionIndex) => (
                          <div key={optionIndex} className="flex items-center">
                            <span className="font-medium text-gray-700 mr-3">
                              {String.fromCharCode(65 + optionIndex)}.
                            </span>
                            <span className="text-gray-700">{option}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* Paper Footer */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <p className="text-sm text-gray-500">
          Generated on {new Date(questionPaper.generated_at).toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          Question Paper ID: {questionPaper.id}
        </p>
      </div>
    </div>
  )
}

export default QuestionPaperDisplay
