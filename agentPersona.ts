import { OpenAI } from "openai";
import * as dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class Agent {
  constructor(private role: string, private systemPrompt: string) {}

  async process(content: string): Promise<string> {
    const response = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: this.systemPrompt },
        { role: "user", content: content },
      ],
    });
    return response.choices[0].message.content || "";
  }
}

export async function runAgentPersona() {
  console.log("Running AI Agent Persona functionality...");

  const blogWriter = new Agent(
    "Blog Writer",
    "You are a blog writer. Write a blog post on the given subject."
  );
  const seoExpert = new Agent(
    "SEO Expert",
    "You are an SEO expert. Review the blog post and suggest improvements for SEO."
  );
  const complianceOfficer = new Agent(
    "Bad Language Compliance Officer",
    "You are a compliance officer. Review the blog post and remove any bad language or words."
  );

  const manager = {
    async manage(subject: string) {
      let blogPost = await blogWriter.process(
        `Write a blog post about: ${subject}`
      );
      console.log("Blog Writer's draft:\n", blogPost);

      blogPost = await seoExpert.process(blogPost);
      console.log("\nSEO Expert's suggestions:\n", blogPost);

      blogPost = await complianceOfficer.process(blogPost);
      console.log("\nCompliance Officer's review:\n", blogPost);

      console.log("\nFinal Blog Post:\n", blogPost);
    },
  };

  await manager.manage("The future of AI");
}