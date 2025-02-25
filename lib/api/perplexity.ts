import { GooglePlace } from './googleMaps';

// Types for Perplexity API
interface PerplexityResponse {
  id: string;
  text: string;
  error?: string;
}

// Perplexity API service
export const perplexityApi = {
  // Get a summary of a boba shop
  async getShopSummary(shop: GooglePlace): Promise<string> {
    const apiKey = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_PERPLEXITY_API_KEY') {
      throw new Error('Perplexity API key is not configured');
    }

    const prompt = `Provide a brief summary (2-3 sentences) of the boba tea shop "${shop.name}" located at "${shop.vicinity}". Focus on what makes this shop unique.`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that provides concise information about boba tea shops.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      const data: PerplexityResponse = await response.json();

      if (data.error) {
        throw new Error(`Perplexity API error: ${data.error}`);
      }

      return data.text;
    } catch (error) {
      console.error('Error fetching shop summary:', error);
      return 'Unable to retrieve shop summary at this time.';
    }
  },

  // Get a summary of reviews for a boba shop
  async getReviewSummary(shop: GooglePlace, reviews?: any[]): Promise<string> {
    const apiKey = process.env.EXPO_PUBLIC_PERPLEXITY_API_KEY;
    
    if (!apiKey || apiKey === 'YOUR_PERPLEXITY_API_KEY') {
      throw new Error('Perplexity API key is not configured');
    }

    let reviewText = '';
    if (reviews && reviews.length > 0) {
      // Use actual reviews if available
      reviewText = reviews.map(review => 
        `"${review.text}" - Rating: ${review.rating}/5`
      ).join('\n');
    }

    const prompt = reviews && reviews.length > 0
      ? `Based on these reviews of "${shop.name}", summarize what customers say about the taste of their boba drinks in 2-3 sentences:\n${reviewText}`
      : `Provide a brief summary (2-3 sentences) of what customers might like about the taste of boba drinks at "${shop.name}".`;

    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'mistral-7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that summarizes customer reviews about boba tea shops, focusing specifically on the taste of their drinks.'
            },
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      });

      const data: PerplexityResponse = await response.json();

      if (data.error) {
        throw new Error(`Perplexity API error: ${data.error}`);
      }

      return data.text;
    } catch (error) {
      console.error('Error fetching review summary:', error);
      return 'Unable to retrieve review summary at this time.';
    }
  }
}; 