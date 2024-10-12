const { GoogleGenerativeAI } = require("@google/generative-ai");


const genAI = new GoogleGenerativeAI("AIzaSyCqUF6Ue1XMtf5Vb30Q2ndQIIj5bQddJEs");

async function evaluateQuestion(question, answer) {
  try {
    const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a university professor. Evaluate the following question and answer. 
    Question: "${question}"
    Answer: "${answer}"
    Provide marks and detailed feedback.`;

    const result = await model.generateContent(prompt);
    const response = result.response;
    return response.text();
  } catch (error) {
    console.error("Error occurred during evaluation:", error);
    throw error;
  }
}

module.exports = evaluateQuestion;
