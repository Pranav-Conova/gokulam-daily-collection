# Gemini Vision AI Integration Setup

## Overview
This application now includes Gemini Vision AI integration for automatic data extraction from branch collection report images.

## Features
- 📷 Upload branch collection report images
- 🤖 AI-powered data extraction using Gemini Vision
- 🎯 Auto-select matching branch from dropdown
- ✏️ Edit extracted data before applying
- 📊 Seamless integration with existing table

## Setup Instructions

### 1. Get Gemini API Key
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

### 2. Configure Environment
1. Open `.env.local` file in the project root
2. Replace `YOUR_GEMINI_API_KEY_HERE` with your actual API key:
   ```
   REACT_APP_GEMINI_API_KEY=your_actual_api_key_here
   ```

### 3. Install Dependencies (if needed)
```bash
npm install
```

### 4. Start the Application
```bash
npm start
```

## How to Use

### 1. Upload Image
- Click the "📷 Upload Branch Image" button
- Select an image of a branch collection report
- Wait for AI processing (usually 2-5 seconds)

### 2. Review Extracted Data
- A modal will appear with extracted data
- The branch dropdown will auto-select the best match
- Review and edit any fields as needed

### 3. Apply Data
- Verify the branch selection is correct
- Make any necessary edits to the extracted values
- Click "Apply Data" to update the table
- Click "Cancel" to discard the data

## Supported Image Formats
- PNG, JPG, JPEG
- Screenshots from spreadsheets
- Photos of printed reports
- Scanned documents

## Tips for Best Results
1. **Clear Images**: Use high-quality, well-lit images
2. **Proper Orientation**: Keep images straight and readable
3. **Good Contrast**: Ensure text is clearly visible
4. **Complete Data**: Include all relevant sections of the report

## Troubleshooting

### API Key Issues
- Ensure your API key is correctly set in `.env.local`
- Restart the development server after changing environment variables
- Check that your API key has proper permissions

### Image Processing Fails
- Try a different image format (PNG works best)
- Ensure the image contains tabular financial data
- Check image quality and lighting

### Branch Not Auto-Selected
- The AI will try to match branch names automatically
- If no match is found, manually select from dropdown
- The system uses fuzzy matching for partial names

### Data Extraction Issues
- The AI extracts visible numerical data from images
- Edit any incorrect values in the modal before applying
- Some fields may be empty if not clearly visible in the image

## API Usage and Costs
- Gemini Vision API is free tier with usage limits
- Each image upload counts as one API call
- Monitor your usage in Google AI Studio

## Security Notes
- API keys are stored locally in environment variables
- Never commit API keys to version control
- Keep your `.env.local` file private