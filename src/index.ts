import { googleAI } from '@genkit-ai/google-genai';
import { genkit, z } from 'genkit';

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
  model: googleAI.model('gemini-2.5-flash', {
    temperature: 0.8,
  }),
});

// Define input schema
const RecipeInputSchema = z.object({
  ingredient: z.string().describe('Main ingredient or cuisine type'),
  dietaryRestrictions: z.string().optional().describe('Any dietary restrictions'),
});

// Define output schema
const RecipeSchema = z.object({
  title: z.string(),
  description: z.string(),
  prepTime: z.string(),
  cookTime: z.string(),
  servings: z.number(),
  ingredients: z.array(z.string()),
  instructions: z.array(z.string()),
  tips: z.array(z.string()).optional(),
});

// Define a recipe generator flow
export const recipeGeneratorFlow = ai.defineFlow(
  {
    name: 'recipeGeneratorFlow',
    inputSchema: RecipeInputSchema,
    outputSchema: RecipeSchema,
  },
  async (input) => {
    // Create a prompt based on the input
    const prompt = `Create a recipe with the following requirements:
      Main ingredient: ${input.ingredient}
      Dietary restrictions: ${input.dietaryRestrictions || 'none'}`;

    // Generate structured recipe data using the same schema
    const { output } = await ai.generate({
      prompt,
      output: { schema: RecipeSchema },
    });

    if (!output) throw new Error('Failed to generate recipe');

    return output;
  }
);

// Run the flow
async function main() {
  const recipe = await recipeGeneratorFlow({
    ingredient: 'avocado',
    dietaryRestrictions: 'vegetarian',
  });

  console.log(recipe);
}

main().catch(console.error);

// ---- Sample in official doc
// const ai = genkit({
//   plugins: [googleAI()],
// });

// const MenuItemSchema = z.object({
//   dishname: z.string(),
//   description: z.string(),
// });

// export const menuSuggestionFlowWithSchema = ai.defineFlow(
//   {
//     name: 'menuSuggestionFlow',
//     inputSchema: z.object({ theme: z.string() }),
//     outputSchema: MenuItemSchema,
//   },
//   async ({ theme }) => {
//     const { output } = await ai.generate({
//       model: googleAI.model('gemini-3.1-flash-lite'),
//       prompt: `Invest a menu item for a ${theme} themed restaurant`,
//       output: {
//         schema: MenuItemSchema,
//       },
//     });
//     if (output == null) {
//       throw new Error("Response doesn't satifsy schema");
//     }
//     return output;
//   }
// );

// export const menuSuggestionFlowMarkdown = ai.defineFlow(
//   {
//     name: 'menuSuggestionFlow',
//     inputSchema: z.object({ theme: z.string() }),
//     outputSchema: z.object({
//       formattedMenuItem: z.string(),
//     }),
//   },
//   async ({ theme }) => {
//     const { output } = await ai.generate({
//       model: googleAI.model('gemini-2.5-flash'),
//       prompt: `Invest a menu item for a ${theme} themed restaurant`,
//       output: {
//         schema: MenuItemSchema,
//       },
//     });
//     if (output === null) {
//       throw new Error("Response doesn't satisfy schema");
//     }
//     return {
//       formattedMenuItem: `**${output.dishname}**: ${output.description}`,
//     };
//   }
// );

// export const menuSuggestionFlow = ai.defineFlow(
//   {
//     name: 'menuSuggestionFlow',
//     inputSchema: z.object({
//       theme: z.string(),
//     }),
//     outputSchema: z.object({
//       menuItem: z.string(),
//     }),
//   },
//   async ({ theme }) => {
//     const { text } = await ai.generate({
//       model: googleAI.model('gemini-2.5-flash'),
//       prompt: `Invest a menu item for a ${theme} themed restaurant`,
//     });
//     return { menuItem: text };
//   }
// );

// export const menuSuggestionStreamingFlow = ai.defineFlow(
//   {
//     name: 'menuSuggestionFlow',
//     inputSchema: z.object({
//       theme: z.string(),
//     }),
//     streamSchema: z.string(),
//     outputSchema: z.object({
//       theme: z.string(),
//       menuItem: z.string(),
//     }),
//   },
//   async ({ theme }, { sendChunk }) => {
//     const { stream, response } = ai.generateStream({
//       model: googleAI.model('gemini-3.1-flash-lite'),
//       prompt: `Invest a menu item for a ${theme} themed restaurant`,
//     });

//     for await (const chunk of stream) {
//       sendChunk(chunk.text);
//     }

//     const { text } = await response;

//     return { theme, menuItem: text };
//   }
// );

// const response = menuSuggestionStreamingFlow.stream({ theme: 'bistro' });
// for await (const chunk of response.stream) {
//   console.log('chunk', chunk);
// }

// const output = await response.output;
// console.log('output', output);
