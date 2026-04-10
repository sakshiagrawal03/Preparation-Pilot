const Groq = require("groq-sdk");
require('dotenv').config();

const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer');
const chromium = isProduction ? require('@sparticuz/chromium') : null;

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// --- Function 1: Interview Report ---
async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
    try {
        const prompt = `Your prompt here...`; // Keep your detailed prompt
        const chatCompletion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are a JSON generator." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" },
        });

        return JSON.parse(chatCompletion.choices[0].message.content);
    } catch (error) {
        console.error("Report Error:", error);
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
        } : { headless: "new" };

        browser = await puppeteer.launch(options);
        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        return await page.pdf({
            format: 'A4',
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
            printBackground: true
        });
    } finally {
        if (browser) await browser.close();
    }
}

// --- Function 3: Resume Logic ---
async function generateResumePdf({ resume, selfDescription, jobDescription }) {
    // 1. Get HTML from Groq
    // 2. Pass HTML to generatePdfFromHtml
    // (Ensure you use the JSON cleaning logic we discussed)
}

module.exports = { generateInterviewReport, generateResumePdf };