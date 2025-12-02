import { runRAG } from "./rag";
import { runAgentPersona } from "./agentPersona";
import { runAgentTools } from "./agentTools";

async function main() {
  console.log("### Running RAG ###");
  await runRAG();
  console.log("\n### Running Agent Persona ###");
  await runAgentPersona();
  console.log("\n### Running Agent Tools ###");
  await runAgentTools();
}

main();
