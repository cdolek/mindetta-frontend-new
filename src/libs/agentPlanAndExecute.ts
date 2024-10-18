// "use client";
// import { TavilySearchResults } from "@langchain/community/tools/tavily_search";
// import { pull } from "langchain/hub";
// import { ChatPromptTemplate } from "@langchain/core/prompts";
// import { ChatOpenAI } from "@langchain/openai";
// import { createOpenAIFunctionsAgent } from "langchain/agents";
// import { createAgentExecutor } from "@langchain/langgraph/prebuilt";

// // Get the prompt to use - you can modify this!
// const prompt = await pull<ChatPromptTemplate>(
//   "hwchase17/openai-functions-agent",
// );

// const tools = [
//   new TavilySearchResults({
//     maxResults: 3,
//     apiKey: "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",
//   }),
// ];

// // Choose the LLM that will drive the agent
// const llm = new ChatOpenAI({ modelName: "gpt-4-turbo-preview" });

// // Construct the OpenAI Functions agent
// const agentRunnable = await createOpenAIFunctionsAgent({
//   llm,
//   tools,
//   prompt,
// });

// const agentExecutor = createAgentExecutor({
//   agentRunnable,
//   tools,
// });

export const agentPlanAndExecute = () => {
  //   await agentExecutor.invoke({ input: "who is the winnner of the us open" });
  return process.env;
};
