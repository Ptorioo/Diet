// src/ai/flows/weather-aware-recommendations.ts
'use server';
/**
 * @fileOverview Recommends restaurants based on weather conditions.
 *
 * - getWeatherAwareRecommendations - A function that handles the weather-aware restaurant recommendation process.
 * - WeatherAwareRecommendationsInput - The input type for the getWeatherAwareRecommendations function.
 * - WeatherAwareRecommendationsOutput - The return type for the getWeatherAwareRecommendations function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WeatherAwareRecommendationsInputSchema = z.object({
  restaurantType: z.string().describe('The type of restaurant the user is looking for (e.g., Italian, Mexican).'),
  weatherDescription: z.string().describe('A description of the current weather conditions (e.g., sunny, rainy, cloudy).'),
  nearbyRestaurants: z.array(z.object({
    name: z.string().describe('The name of the restaurant.'),
    rating: z.number().describe('The rating of the restaurant (e.g., 4.5).'),
    hasOutdoorSeating: z.boolean().describe('Whether the restaurant has outdoor seating.'),
  })).describe('A list of nearby restaurants.'),
});
export type WeatherAwareRecommendationsInput = z.infer<typeof WeatherAwareRecommendationsInputSchema>;

const WeatherAwareRecommendationsOutputSchema = z.array(z.object({
  name: z.string().describe('The name of the restaurant.'),
  rating: z.number().describe('The rating of the restaurant (e.g., 4.5).'),
  hasOutdoorSeating: z.boolean().describe('Whether the restaurant has outdoor seating.'),
  score: z.number().describe('The calculated score of the restaurant based on weather conditions.'),
})).describe('A list of recommended restaurants, ordered by score.');
export type WeatherAwareRecommendationsOutput = z.infer<typeof WeatherAwareRecommendationsOutputSchema>;

export async function getWeatherAwareRecommendations(input: WeatherAwareRecommendationsInput): Promise<WeatherAwareRecommendationsOutput> {
  return weatherAwareRecommendationsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherAwareRecommendationsPrompt',
  input: {schema: WeatherAwareRecommendationsInputSchema},
  output: {schema: WeatherAwareRecommendationsOutputSchema},
  prompt: `You are a restaurant recommendation expert, skilled at considering weather conditions to optimize dining experiences.

Given the current weather conditions and a list of nearby restaurants, you will calculate a score for each restaurant that factors in how well the restaurant suits the weather.
Restaurants should be returned ordered by the score, highest score first.

Weather Conditions: {{{weatherDescription}}}

Restaurant Type: {{{restaurantType}}}

Nearby Restaurants:
{{#each nearbyRestaurants}}
  - Name: {{name}}, Rating: {{rating}}, Outdoor Seating: {{hasOutdoorSeating}}
{{/each}}

Considerations:
*   On sunny days, prioritize restaurants with outdoor seating.
*   On rainy days, prioritize restaurants with indoor seating and good ratings.
*   Take restaurant rating into account regardless of weather, higher is better

Output in JSON format:
[
  {
    "name": "Restaurant Name",
    "rating": 4.5,
    "hasOutdoorSeating": true,
    "score": 0.8 // Score between 0 and 1, higher is better
  }
]
`,
});

const weatherAwareRecommendationsFlow = ai.defineFlow(
  {
    name: 'weatherAwareRecommendationsFlow',
    inputSchema: WeatherAwareRecommendationsInputSchema,
    outputSchema: WeatherAwareRecommendationsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
