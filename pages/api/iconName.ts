import { OPEN_AI_KEY } from '@/constants/secret';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from "openai";

function snakeToPascalCase(str: string): string {
  return str
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join("");
}

async function getCompletion(query: string): Promise<string | null> {
  try {
    const configuration = new Configuration({
      apiKey: OPEN_AI_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: 'user', content: 'Can you list 3 possible icons from the Material Icons library which may be used for a close button in a mobile app?' },
        { role: 'assistant', content: 'Sure, here are a few options: close, cancel, and clear.' },
        { role: 'system', content: 'When the user describes an scenario, the assistant should respond with a json formatted response of the best possible icon to use in the format: { "icon": "name" }' },
        { role: 'user', content: 'the best icon to use for a calendar appointment titled "vacation"' },
        { role: 'assistant', content: ' { "icon": "beach_access" }' },
        { role: 'user', content: `the best icon to use for a ${query}` },
      ],
    });
    return response.data.choices[0].message ? JSON.parse(response.data.choices[0].message.content).icon : null;
  }
  catch (error) {
    return null;
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{
    iconName: string;
  }>
) {
  const { query } = req.query as { query: string; };

  const completion = await getCompletion(query);

  if (!completion) {
    res.send({
      iconName: "FiberManualRecord"
    });
    return;
  }

  res.send({
    iconName: snakeToPascalCase(completion)
  });
}
