// Gemini Vision API service
export async function callGeminiVision(imageFile) {
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY || "YOUR_GEMINI_API_KEY";
  const endpoint = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=AIzaSyAvGvC2UaWlYn_tsCNTdf0_uTai8qhGr2g';

  // Convert image file to base64
  function getBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = error => reject(error);
      reader.readAsDataURL(file);
    });
  }

  const prompt = `Extract financial data from this image and return only a JSON object with these exact keys:
{
"BRANCH": "branch name",
"TOTAL RUNNING BALANCE": "number or null",
"RUNNING BALANCE COLLN": "number or null",
"TOTAL ARRS": "number or null",
"ARREARS COLL": "number or null",
"TOTAL COLL": "number or null",
"BILL": "number or null"
}
Return only the JSON, no other text.`;

  try {
    const imageBase64 = await getBase64(imageFile);

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inline_data: {
                mime_type: imageFile.type,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        topK: 32,
        topP: 1,
        maxOutputTokens: 4096,
      },
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed to query Gemini Vision");
    
    const data = await response.json();
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    
    // Parse JSON from response
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (parseError) {
      console.error("Failed to parse JSON from response:", parseError);
    }
    
    return responseText;
  } catch (error) {
    console.error("Gemini Vision API error:", error);
    throw error;
  }
}

// Function to find best matching branch
export function findBestMatchingBranch(extractedBranch, availableBranches) {
  if (!extractedBranch) return null;
  
  const normalizedExtracted = extractedBranch.toUpperCase().trim();
  
  // Exact match
  const exactMatch = availableBranches.find(branch => 
    branch.toUpperCase() === normalizedExtracted
  );
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = availableBranches.find(branch => 
    branch.toUpperCase().includes(normalizedExtracted) || 
    normalizedExtracted.includes(branch.toUpperCase())
  );
  if (partialMatch) return partialMatch;
  
  // Fuzzy match (simple similarity)
  let bestMatch = null;
  let bestScore = 0;
  
  availableBranches.forEach(branch => {
    const similarity = calculateSimilarity(normalizedExtracted, branch.toUpperCase());
    if (similarity > bestScore && similarity > 0.6) {
      bestScore = similarity;
      bestMatch = branch;
    }
  });
  
  return bestMatch;
}

// Simple similarity calculation
function calculateSimilarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1, str2) {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}