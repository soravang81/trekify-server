import express, { Router } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import axios from 'axios';

const gemini = Router();

const GOOGLE_API_KEY = 'AIzaSyCgSZtlC12I2AqQ8t04b2Z0BMbFNgH15jw';
const genAI = new GoogleGenerativeAI(GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

const UNSPLASH_API_KEY = 'o3P_rHfyn49pG6c3cHnxfpS947WlkFcsxy6CEX6sbow';
const UNSPLASH_URL = 'https://api.unsplash.com/search/photos';

gemini.use(express.json());

async function getPlaceInfo(place: string) {
  const prompt = `Give me a short description of ${place} in 200 words and list the top 5 places to visit in ${place}. Respond in this JSON format:
  {
    "description": "Description of ${place}",
    "places": [
      {"name": "Place 1 Name", "description": "Short description of Place 1"},
      {"name": "Place 2 Name", "description": "Short description of Place 2"},
      ...
    ]
  }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

async function getPlaceImagesUnsplash(placeName: string, count: number = 1) {
  try {
    const response = await axios.get(UNSPLASH_URL, {
      params: {
        query: placeName,
        per_page: count
      },
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
      }
    });

    if (!response.data.results || response.data.results.length === 0) {
      return [];
    }

    return response.data.results.map((result: any) => result.urls.regular);
  } catch (error) {
    console.error(`Error fetching images for ${placeName}:`, error);
    return [];
  }
}

gemini.post('/info', async (req, res) => {
  const { place } = req.body;

  if (!place) {
    return res.status(400).json({ error: 'No place provided' });
  }

  try {
    const placeInfo = await getPlaceInfo(place);
    
    const mainImage = await getPlaceImagesUnsplash(place);
    
    const placesWithImages = await Promise.all(
      placeInfo.places.map(async (placeObj: any) => {
        const images = await getPlaceImagesUnsplash(`${placeObj.name} ${place}`);
        return { ...placeObj, image: images[0] || null };
      })
    );

    const response = {
      description: placeInfo.description,
      image: mainImage[0] || null,
      places: placesWithImages
    };
console.log(response)
    res.json(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'An error occurred while processing your request' });
  }
});

async function getAISuggestions(userPreferences: any, availableProfiles: any[]) {
  const prompt = `Given the user preferences: ${JSON.stringify(userPreferences)}
  and the available travel profiles: ${JSON.stringify(availableProfiles)},
  suggest the top 3 most suitable travel profiles for the user. 
  Respond in this JSON format:
  {
    "suggestions": [
      {"profileId": "id1", "reason": "Reason for suggestion 1"},
      {"profileId": "id2", "reason": "Reason for suggestion 2"},
      {"profileId": "id3", "reason": "Reason for suggestion 3"}
    ]
  }`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return JSON.parse(response.text());
}

gemini.post('/suggestions', async (req, res) => {
  const { userPreferences, availableProfiles } = req.body;

  try {
    const suggestions = await getAISuggestions(userPreferences, availableProfiles);
    res.json({ success: true, suggestions });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, error: 'An error occurred while processing your request' });
  }
});

export default gemini;