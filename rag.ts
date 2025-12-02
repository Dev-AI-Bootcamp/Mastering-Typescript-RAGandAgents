import { ChatOpenAI, OpenAIEmbeddings } from "@langchain/openai";
import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import * as dotenv from "dotenv";

dotenv.config();

const chatModel = new ChatOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  modelName: "gpt-5-nano",
});

export async function runRAG() {
  console.log("Running RAG functionality...");

  const loader = new CheerioWebBaseLoader(
    "https://seedcoffeehouse.com/pages/menu"
  );
  const docs = await loader.load();

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000,
    chunkOverlap: 200,
  });
  const splitDocs = await splitter.splitDocuments(docs);

  // Combine all document content
  const context = splitDocs.map((doc) => doc.pageContent).join("\n\n");

  const prompt = ChatPromptTemplate.fromTemplate(`Answer the following question based only on the provided context:
    
Context:
{context}

Question: {question}

Answer:`);

  const chain = prompt.pipe(chatModel).pipe(new StringOutputParser());

  const result = await chain.invoke({
    context: context,
    question: "what kind of coffee's do you have?",
  });

  console.log(result);
}