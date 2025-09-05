# Question Paper Generator

A full-stack application for automated question paper generation using AI. Faculty can upload unit notes and generate structured question papers with different question types.

## Features

- **Note Upload**: Upload unit notes as text files
- **Question Generation**: Generate questions in 6 different categories:
  - Multiple Choice Questions (MCQ)
  - Short Answer Questions
  - Long Answer Questions
  - Case Study Questions
  - Application-Based Questions
  - Numerical Questions
- **Customizable Requirements**: Set number of questions per category, difficulty level, duration, and total marks
- **Export Options**: Download generated papers as PDF, DOCX, or JSON
- **Hardcoded Rules**: Question generation follows predefined rules that cannot be modified by users

## Technology Stack

### Backend
- **FastAPI**: Python web framework
- **OpenAI API**: For question generation
- **Sentence Transformers**: For text embeddings
- **FAISS**: For semantic search and retrieval
- **python-docx**: For DOCX export
- **reportlab**: For PDF export

### Frontend
- **React**: JavaScript library
- **Tailwind CSS**: For styling
- **Vite**: Build tool

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file in the backend directory:
   ```bash
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Start the backend server:
   ```bash
   uvicorn main:app --reload
   ```

The backend will run on `http://localhost:8000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

The frontend will run on `http://localhost:5173`

## Usage

1. **Upload Notes**: 
   - Go to the application in your browser
   - Upload your unit notes as `.txt` files
   - The system will process and index the content

2. **Set Requirements**:
   - Specify the subject name
   - Set duration and difficulty level
   - Choose the number of questions for each category
   - Review the total marks calculation

3. **Generate Paper**:
   - Click "Generate Question Paper"
   - The system will create questions based on your uploaded notes
   - View the generated paper in a structured format

4. **Download**:
   - Download the paper as PDF, DOCX, or JSON
   - Use the downloaded files for printing or further editing

## API Endpoints

### Backend API

- `POST /upload_notes`: Upload unit notes
- `POST /generate_paper`: Generate question paper
- `GET /categories`: Get available question categories
- `GET /download/{paper_id}/{format}`: Download paper in specified format
- `GET /health`: Health check

## Question Categories

The system supports 6 predefined question categories:

1. **Multiple Choice Questions (MCQ)**
   - 4 options (A, B, C, D)
   - 1 mark per question
   - Default: 5 questions

2. **Short Answer Questions**
   - Brief answers (2-3 sentences)
   - 2 marks per question
   - Default: 3 questions

3. **Long Answer Questions**
   - Detailed answers (1-2 paragraphs)
   - 5 marks per question
   - Default: 2 questions

4. **Case Study Questions**
   - Scenario-based with multiple parts
   - 10 marks per question
   - Default: 1 question

5. **Application-Based Questions**
   - Practical application of concepts
   - 3 marks per question
   - Default: 2 questions

6. **Numerical Questions**
   - Calculations and numerical answers
   - 4 marks per question
   - Default: 2 questions

## File Structure

```
QueGen/
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   ├── faiss_index/           # Generated indexes
│   └── uploaded_notes/        # Uploaded note files
├── frontend/
│   ├── src/
│   │   ├── App.jsx            # Main application component
│   │   └── components/        # React components
│   │       ├── NoteUploadForm.jsx
│   │       ├── PaperRequirementsForm.jsx
│   │       └── QuestionPaperDisplay.jsx
│   └── package.json           # Node.js dependencies
└── notes/                     # Default notes directory
```

## Development

### Running Locally

1. Start the backend:
   ```bash
   cd backend
   uvicorn main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm run dev
   ```

3. Open `http://localhost:5173` in your browser

### Building for Production

1. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be in `frontend/dist/`

## Notes

- The application is designed for local use only
- No cloud deployment configurations are included
- Question generation rules are hardcoded and cannot be modified by users
- The system uses semantic search to find relevant content from uploaded notes
- All generated papers are saved locally and can be downloaded in multiple formats

## Troubleshooting

### Common Issues

1. **OpenAI API Error**: Ensure your API key is valid and has sufficient credits
2. **File Upload Issues**: Make sure files are in `.txt` format
3. **CORS Errors**: Ensure both backend and frontend are running on correct ports
4. **Dependencies Issues**: Make sure all Python and Node.js dependencies are installed

### Support

For issues or questions, please check the application logs in the terminal where the backend is running.