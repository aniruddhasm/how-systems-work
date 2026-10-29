
const { get_encoding } = require("tiktoken");

// Load the tokenizer
const encoding = get_encoding("cl100k_base");

const text = "Hello, how are you?";

const tokens = encoding.encode(text);

// console.log("Original text:", text);
// console.log("Token IDs:", tokens);
// console.log("Token count:", tokens.length);

// Release resources
encoding.free();

function countTokens(inputText, outputText) {
    const encoding = get_encoding("cl100k_base");

    const inputTokens = encoding.encode(inputText).length;
    const outputTokens = encoding.encode(outputText).length;

    encoding.free();

    return {
        inputTokens,
        outputTokens,
        totalTokens: inputTokens + outputTokens
    };
}

// Example
const result = countTokens(
    "Explain what Generative AI is? in 100 words.",
    "Generative AI is a type of artificial intelligence that learns patterns from existing data and uses them to create new content, such as text, images, audio, videos, and code. Unlike traditional AI, which often classifies or predicts information, Generative AI generates new outputs based on user instructions called prompts."
);

console.log(result);