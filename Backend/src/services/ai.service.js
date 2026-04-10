// const Groq = require("groq-sdk");
// const { z } = require("zod");
// require('dotenv').config();
// const puppeteer = require('puppeteer');

// const groq = new Groq({
//     apiKey: process.env.GROQ_API_KEY
// });




// async function generateInterviewReport({ resume, jobDescription, selfDescription }) {
//     try {
//         const prompt = `
// You are an expert interviewer.

// Analyze:

// RESUME:
// ${resume}

// JOB DESCRIPTION:
// ${jobDescription}

// CANDIDATE INTRO:
// ${selfDescription}

// Return ONLY valid JSON:

// {
//   "title": "string",
//   "matchScore": MUST be an integer between 0 and 100.
// DO NOT return decimals.
// DO NOT return values between 0 and 1.
// Examples of valid values: 65, 78, 90.
// Examples of invalid values: 0.85, 0.92, 85.5

//   "technicalQuestions": [
//     { "question": "string", "intention": "string", "answer": "string" }
//   ],

//   "behavioralQuestions": [
//     { "question": "string", "intention": "string", "answer": "string" }
//   ],

//   "skillGaps": [
//     { "skill": "string", "severity": "low | medium | high" }
//   ],

//   "preparationPlan": [
//     { "day": number, "focus": "string", "tasks": ["string"] }
//   ]
// }

// STRICT RULES:
// - Generate 5–8 technical questions
// - Generate 4–6 behavioral questions
// - Generate a 5–10 day preparation plan
// - Base everything strictly on resume + job description
// - Avoid generic content
// - Vary output each time
// `;

//         const chatCompletion = await groq.chat.completions.create({
//             messages: [
//                 {
//                     role: "system",
//                     content: "You are a JSON generator. You only output valid JSON. You never talk or explain."
//                 },
//                 { role: "user", content: prompt }
//             ],
//             model: "llama-3.3-70b-versatile",
//             response_format: { type: "json_object" },
//           temperature: 0.7,
//           top_p: 0.9,
//         });

//         // 1. Get the content string
//         const rawResponse = chatCompletion.choices[0].message.content;

//         // 2. Parse and Validate
//         const parsedData = JSON.parse(rawResponse);

//         // 3. Return the validated object directly
//         return parsedData;

//     } catch (error) {
//         return { error: "Failed to generate report", details: error.message };
//     }
// }



// async function  generatePdfFromHtml(htmlContent) {
//     const browser = await puppeteer.launch({ headless: "new" });    const page = await browser.newPage();  
//     await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
    
//     const pdfBuffer = await page.pdf({ format: 'A4', margin: 
//     { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' }
//     });

//     await browser.close();

//     return pdfBuffer;
// }


// async function generateResumePdf({ resume, selfDescription, jobDescription }) {

//     const prompt = `
// Generate a HIGH-QUALITY, recruiter-ready professional resume in clean HTML format.

// Candidate Details:
// Resume: ${resume}
// Self Description: ${selfDescription}
// Job Description: ${jobDescription}

// 🔥 STRICT STRUCTURE (VERY IMPORTANT):
// Follow EXACT section order:

// 1. Header (Name, Email, Phone, Links)
// 2. Professional Summary  ← (USE selfDescription here, NOT at bottom)
// 3. Skills
// 4. Experience / Projects
// 5. Education
// 6. Additional Sections (if needed)

// ❌ DO NOT place "Self Description" as a separate section
// ❌ DO NOT place it at the bottom
// ✅ It MUST be converted into a strong "Professional Summary" at the TOP
// The Professional Summary must be 2–4 lines, concise and impactful.

// ---

// CONTENT REQUIREMENTS:
// - Write strong, impactful bullet points with measurable results
// - Use action verbs (Built, Optimized, Designed, Implemented)
// - Tailor resume to the job description
// - Make it human-like and professional
// - Highlight ATS keywords from job description in Skills section
// - Prioritize projects/experience relevant to job
// - Use bullet points with metrics (%, speed, scale)

// ---

// DESIGN & SPACING REQUIREMENTS:
// - Include a <style> tag inside the <head>
// - Use '@page { size: A4; margin: 0.75in; }'
// - Use 'break-inside: avoid;' for sections
// - Use clean spacing and readable typography
// - Use professional sans-serif fonts

// ---

// IMPORTANT:
// Return ONLY JSON:
// {
//   "html": "<complete styled HTML resume>"
// }

// No explanation, no markdown.
// `;

//     const response = await groq.chat.completions.create({
//         model: "llama-3.3-70b-versatile",
//         messages: [
//             {
//                 role: "user",
//                 content: prompt
//             }
//         ],
//         temperature: 0.7,
//     });


//     try{
//         if (!response.choices || !response.choices[0]?.message?.content) {
//         throw new Error("Empty response from Groq");
//     }
        
// const rawContent = response.choices[0].message.content;

// console.log("RAW RESPONSE:\n", rawContent);

// const jsonMatch = rawContent.match(/\{[\s\S]*\}/);

// if (!jsonMatch) {
//     throw new Error("No JSON found in response");
// }

// let jsonString = jsonMatch[0];


// jsonString = jsonString
//     .replace(/[\u0000-\u001F]+/g, "") 
//     .replace(/\n/g, "\\n")           
//     .replace(/\r/g, "");           

// const jsonContent = JSON.parse(jsonString);

// if (!jsonContent.html) {
//     throw new Error("Invalid response: 'html' missing");
// }

//         const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

//         return pdfBuffer;

//     } catch (error) {
//         console.error("Error parsing Groq response:", error);
//         throw new Error("Failed to generate resume PDF");
//     }
// }    
// module.exports = {generateInterviewReport,generateResumePdf}



const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;
const puppeteer = isProduction ? require('puppeteer-core') : require('puppeteer');
const chromium = isProduction ? require('@sparticuz/chromium') : null;

async function generatePdfFromHtml(htmlContent) {
    let browser = null;
    try {
        if (isProduction) {
            // VERCEL CONFIGURATION
            browser = await puppeteer.launch({
                args: chromium.args,
                defaultViewport: chromium.defaultViewport,
                executablePath: await chromium.executablePath(),
                headless: chromium.headless,
                ignoreHTTPSErrors: true,
            });
        } else {
            // LOCAL CONFIGURATION
            browser = await puppeteer.launch({ 
                headless: "new" 
            });
        }

        const page = await browser.newPage();
        await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

        const pdfBuffer = await page.pdf({
            format: 'A4',
            margin: { top: '20mm', right: '15mm', bottom: '20mm', left: '15mm' },
            printBackground: true
        });

        return pdfBuffer;
    } catch (err) {
        console.error("PDF Engine Error:", err);
        throw err;
    } finally {
        if (browser !== null) await browser.close();
    }
}