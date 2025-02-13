import { HfInference } from "@huggingface/inference";
import { Pinecone } from "@pinecone-database/pinecone";
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { v4 as uuidv4 } from "uuid";
import { ChatOpenAI } from "@langchain/openai";

dotenv.config();
const apiKey = process.env.HUGGINGFACEHUB_API_KEY; // Use your Hugging Face API key
const client = new HfInference(apiKey);
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Pinecone client
const piKey = process.env.PINECONE_API_KEY;

const pc = new Pinecone({
  apiKey: piKey,
});

const llm = new ChatOpenAI({
  modelName: "meta-llama/Llama-3.3-70B-Instruct",
  apiKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkZXZidWxjaGFuZGFuaThAZ21haWwuY29tIiwiaWF0IjoxNzM5MTIyNTk4fQ.5lYeeFkVuhmPbEg-pK8CNevidDBFQiwXxaJmaVwyMcg", // you can input your API key in plaintext, but this is not recommended
  configuration: {
    baseURL: "https://api.hyperbolic.xyz/v1",
    defaultHeaders: {
      "Content-Type": "application/json",
    },
  },

  maxTokens: 2000, // specifies the maximum number of tokens to generate
  temperature: 0.65, // specifies the randomness of the output
  topP: 0.7, // specifies the top-p sampling parameter
});

const indexName = "goutam";
var model = "multilingual-e5-large"; // Hugging Face embedding model

// Define the upsert route for new events
app.post("/upsert", async (req, res) => {
  try {
    const event = req.body;
    const text = `Title: ${event.title},Description: ${event.description},Location: ${event.location},Date: ${event.date},Price: ${event.price},TotalTickets: ${event.totalTickets},OrganizerName: ${event.organizerName},OrganizerContact: ${event.organizerContact},Category: ${event.category}`;

    // Single data object with unique ID
    const id = uuidv4();

    // Generate embedding for single text
    const embedding = await pc.inference.embed(
      model,
      [text], // API expects array input even for single text
      { inputType: "passage", truncate: "END" }
    );

    // Create single vector
    const vector = {
      id: id,
      values: embedding[0].values,
      metadata: { text: text },
    };

    const index = pc.index(indexName);
    await index.namespace("utopia-bot").upsert([vector]); // API expects array input

    res.status(200).json({ message: "Event upserted successfully!" });
  } catch (error) {
    console.error("Error during upsert:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Handle user queries with the /chat route
app.post("/chat", async (req, res) => {
  try {
    const userQuery = req.body.query; // Frontend sends user query
   
    var model = "multilingual-e5-large";
    // Convert the query into a numerical vector
    const queryEmbedding = await pc.inference.embed(model, [userQuery], {
      inputType: "query",
    });
  

    // Search the Pinecone index for top matches
    const index = pc.index(indexName);
    const queryResponse = await index.namespace("utopia-bot").query({
      topK: 1,
      vector: queryEmbedding[0].values,
      includeValues: false,
      includeMetadata: true,
    });

    // Generate a response using ChatOpenAI instead of Hugging Face
    const response = await llm.invoke([
      {
        role: "system",
        content:
          "You are a helpful assistant that provides information about events based on the database response.",
      },
      {
        role: "user",
        content: `Answer from the database response: ${JSON.stringify(
          queryResponse
        )} for user query: ${userQuery}`,
      },
    ]);

    const reply = response.content;
    res.json({ reply });
  } catch (error) {
    console.error("Error during chat handling:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Express server
const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
