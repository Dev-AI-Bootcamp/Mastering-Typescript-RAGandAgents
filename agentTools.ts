import { OpenAI } from "openai";
import type { ChatCompletionTool } from "openai/resources/chat/completions";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Mock function for getting weather
function get_weather(city: string) {
  return "It's 72° F and raining";
}

export async function runAgentTools() {
  console.log("Running AI Agent Tool calling functionality...");

  const messages: any[] = [
    {
      role: "user",
      content: "Do I need a raincoat if I'm going to Paris today?",
    },
  ];

  const tools: ChatCompletionTool[] = [
    {
      type: "function",
      function: {
        name: "get_weather",
        description: "Get the current weather in a given city",
        parameters: {
          type: "object",
          properties: {
            city: {
              type: "string",
              description: "The city to get the weather for",
            },
          },
          required: ["city"],
        },
      },
    },
  ];

  let response = await openai.chat.completions.create({
    model: "gpt-5-nano",
    messages: messages,
    tools: tools,
    tool_choice: "auto",
  });

  const responseMessage = response.choices[0].message;

  if (responseMessage.tool_calls) {
    const availableFunctions: { [key: string]: Function } = {
      get_weather: get_weather,
    };
    messages.push(responseMessage);

    for (const tool_call of responseMessage.tool_calls) {
      if (tool_call.type === "function") {
        const functionName = tool_call.function.name;
        const functionToCall = availableFunctions[functionName];
        const functionArgs = JSON.parse(tool_call.function.arguments);
        const functionResponse = functionToCall(functionArgs.city);

        messages.push({
          tool_call_id: tool_call.id,
          role: "tool",
          name: functionName,
          content: functionResponse,
        });
      }
    }

    const secondResponse = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: messages,
    });

    console.log(secondResponse.choices[0].message.content);
  }
}