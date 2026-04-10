const Groq = require("groq-sdk");
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer');
const chromium = isProduction ? require('@sparticuz/chromium') : null;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * HELPER: Safely cleans AI output to ensure it's parseable JSON.
 * AI often wraps JSON in markdown backticks which breaks JSON.parse().
 */
const cleanAndParseJSON = (text) => {
    try {
        const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("JSON Parsing Error. Raw Content:", text);
        throw new Error("AI returned invalid JSON format.");
    }
};

// --- Function 1: Interview Report ---
async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
    try {
        // 1. IMPROVED PROMPT: Strict key naming
        const prompt = `
        You are an expert technical interviewer. Analyze the provided details and generate a structured interview preparation report.

        CANDIDATE RESUME: ${resume}
        TARGET JOB DESCRIPTION: ${jobDescription}
        CANDIDATE SELF-INTRO: ${selfDescription}

        STRICT JSON SCHEMA (Return ONLY this structure):
        {
          "title": "A short professional title for this role (e.g., Junior Backend Developer)",
          "matchScore": 85,
          "technicalQuestions": [
            { "question": "string", "intention": "string", "answer": "string" }
          ],
          "behavioralQuestions": [
            { "question": "string", "intention": "string", "answer": "string" }
          ],
          "skillGaps": [
            { "skill": "string", "severity": "low | medium | high" }
          ],
          "preparationPlan": [
            { "day": 1, "focus": "string", "tasks": ["string"] }
          ]
        }
        `;

        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON generator. You output ONLY valid JSON without any conversational text." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
            temperature: 0.5, // Lower temperature makes the output more predictable
        });

        const rawContent = chatCompletion.choices[0].message.content;
        const parsedData = cleanAndParseJSON(rawContent);

        // 2. DATA INTEGRITY CHECK: Ensure 'title' exists before returning to Controller
        // This prevents the Mongoose ValidationError
        if (!parsedData.title) {
            parsedData.title = "Interview Preparation Report"; 
        }

        return parsedData;

    } catch (error) {
        console.error("Report Generation Error:", error);
        throw error;
    }
}

// --- Function 2: PDF Generation (The Engine) ---
async function generatePdfFromHtml(htmlContent) {
    let browser = null;
    try {
        const options = isProduction ? {
            args: chromium.args,
            defaultViewport: chromium.defaultViewport,
            executablePath: await chromium.executablePath(),
            headless: chromium.headless,
        } : { 
            headless: "new" 
            // Add executablePath here if local Puppeteer fails to find Chrome
        };

        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        
        // Set content and wait for it to render
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
            printBackground: true
        });

        return pdfBuffer;
    } catch (err) {
        console.error("Puppeteer Engine Error:", err);
        throw err;
    } finally {
        if (browser) await browser.close();
    }
}

// --- Function 3: Resume Logic (COMPLETED) ---
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    try {
        const prompt = `Generate a high-quality HTML resume based on:
        Resume: ${resume}
        Summary: ${selfDescription}
        Target JD: ${jobDescription}
        Return ONLY a JSON object: { "html": "full_html_string_here" }`;

        const response = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" },
            temperature: 0.6, // Lower temperature = more stable HTML
        });

        const jsonContent = cleanAndParseJSON(response.choices[0].message.content);

        if (!jsonContent.html) {
            throw new Error("AI failed to provide HTML in the JSON response.");
        }

        // Pass the generated HTML to the PDF Engine
        return await generatePdfFromHtml(jsonContent.html);

    } catch (error) {
        console.error("Resume PDF Service Error:", error);
        throw error;
    }
}

module.exports = { generateInterviewReport, generateResumePdf };