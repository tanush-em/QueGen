import { useState } from 'react'

function NoteUploadForm({ onUploaded, onError, onLoading }) {
  const [files, setFiles] = useState([])
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type === 'text/plain' || file.name.endsWith('.txt')
      )
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const handleFileInput = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).filter(file => 
        file.type === 'text/plain' || file.name.endsWith('.txt')
      )
      setFiles(prev => [...prev, ...newFiles])
    }
  }

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (files.length === 0) {
      onError('Please select at least one file to upload')
      return
    }

    onLoading(true)
    onError(null)

    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('files', file)
      })

      const response = await fetch('http://localhost:8000/upload_notes', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      onUploaded(data)
    } catch (err) {
      onError(err.message)
      console.error('Error uploading files:', err)
    } finally {
      onLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-gray-600 mb-4">
          Upload your unit notes as text files (.txt). These will be used to generate questions.
        </p>
      </div>

      {/* File Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          dragActive 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-700">
            Drag and drop your text files here
          </p>
          <p className="text-sm text-gray-500">
            or click to browse files
          </p>
        </div>
        
        <input
          type="file"
          multiple
          accept=".txt,text/plain"
          onChange={handleFileInput}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer transition-colors"
        >
          Choose Files
        </label>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-gray-700">Selected Files:</h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="text-sm text-gray-700">{file.name}</span>
                  <span className="text-xs text-gray-500 ml-2">
                    ({(file.size / 1024).toFixed(1)} KB)
                  </span>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-red-500 hover:text-red-700 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSubmit}
          disabled={files.length === 0}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Upload Notes
        </button>
      </div>
    </div>
  )
}

export default NoteUploadForm
