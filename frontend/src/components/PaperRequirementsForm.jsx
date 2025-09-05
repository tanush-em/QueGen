import { useState, useEffect } from 'react'

function PaperRequirementsForm({ sessionId, onPaperGenerated, onError, onLoading }) {
  const [categories, setCategories] = useState({})
  const [availableCategories, setAvailableCategories] = useState({})
  const [subject, setSubject] = useState('')
  const [duration, setDuration] = useState(60)
  const [difficulty, setDifficulty] = useState('medium')
  const [totalMarks, setTotalMarks] = useState(0)

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    calculateTotalMarks()
  }, [categories])

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:8000/categories')
      if (response.ok) {
        const data = await response.json()
        setAvailableCategories(data)
        
        // Initialize with default counts
        const initialCategories = {}
        Object.keys(data).forEach(key => {
          initialCategories[key] = data[key].default_count
        })
        setCategories(initialCategories)
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
    }
  }

  const calculateTotalMarks = () => {
    let total = 0
    Object.entries(categories).forEach(([categoryKey, count]) => {
      const category = availableCategories[categoryKey]
      if (category && count > 0) {
        total += count * category.marks_per_question
      }
    })
    setTotalMarks(total)
  }

  const handleCategoryChange = (categoryKey, value) => {
    const numValue = parseInt(value) || 0
    setCategories(prev => ({
      ...prev,
      [categoryKey]: numValue
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (Object.values(categories).every(count => count === 0)) {
      onError('Please select at least one question category')
      return
    }

    if (!subject.trim()) {
      onError('Please enter a subject name')
      return
    }

    onLoading(true)
    onError(null)

    try {
      const formData = new FormData()
      formData.append('categories', JSON.stringify(categories))
      formData.append('subject', subject)
      formData.append('duration', duration.toString())
      formData.append('difficulty', difficulty)
      formData.append('total_marks', totalMarks.toString())
      
      if (sessionId) {
        formData.append('session_id', sessionId)
      }

      const response = await fetch('http://localhost:8000/generate_paper', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorMessage = errorData.detail || errorMessage
        } catch (parseError) {
          // If response is not JSON, use the status text
          errorMessage = response.statusText || errorMessage
        }
        throw new Error(errorMessage)
      }

      const data = await response.json()
      onPaperGenerated(data)
    } catch (err) {
      onError(err.message)
      console.error('Error generating paper:', err)
    } finally {
      onLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name *
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g., Biology, Mathematics, Physics"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-2">
            Duration (minutes)
          </label>
          <input
            type="number"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
            min="30"
            max="180"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">
          Difficulty Level
        </label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
      </div>

      {/* Question Categories */}
      <div>
        <h3 className="text-lg font-medium text-gray-800 mb-4">Question Categories</h3>
        <div className="space-y-4">
          {Object.entries(availableCategories).map(([key, category]) => (
            <div key={key} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-medium text-gray-800">{category.name}</h4>
                  <p className="text-sm text-gray-600">{category.description}</p>
                  <p className="text-xs text-gray-500">{category.marks_per_question} marks per question</p>
                </div>
                <div className="flex items-center space-x-2">
                  <label htmlFor={`count-${key}`} className="text-sm font-medium text-gray-700">
                    Count:
                  </label>
                  <input
                    type="number"
                    id={`count-${key}`}
                    value={categories[key] || 0}
                    onChange={(e) => handleCategoryChange(key, e.target.value)}
                    min="0"
                    max="20"
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Total Marks Display */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-800">Total Questions:</span>
          <span className="text-sm font-bold text-blue-900">
            {Object.values(categories).reduce((sum, count) => sum + (count || 0), 0)}
          </span>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm font-medium text-blue-800">Total Marks:</span>
          <span className="text-lg font-bold text-blue-900">{totalMarks}</span>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={Object.values(categories).every(count => count === 0) || !subject.trim()}
          className="px-8 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Generate Question Paper
        </button>
      </div>
    </form>
  )
}

export default PaperRequirementsForm
