// const pdfParse = require('pdf-parse');
// const  {generateInterviewReport,generateResumePdf} = require('../services/ai.service');
// const interviewReportModel= require('../models/interviewReport.model');



// /**
//  * @desc Generates an interview report based on the candidate's resume, self-description, and the job description
//  **/


// async function generateInterviewReportController(req, res) {

//      const  resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
//      const { selfDescription, jobDescription } = req.body;

//      const interViewReportByAi= await generateInterviewReport({
//           resume:resumeContent.text,
//           selfDescription,
//           jobDescription
// })

//   const interviewReport= await interviewReportModel.create({
//      user:req.user._id,
//      resume:resumeContent.text,
//      selfDescription,
//      jobDescription,
//      ...interViewReportByAi
// })
//      res.status(201).json({
//           message:"Interview report generated successfully",
//           data: interviewReport
//      })

// }


// /** 
//  * @description Controller to get interview report by ID
// */

// async function getInterviewReportByIdController(req, res) {
//      const { interviewId } = req.params;
//      const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });
//      if (!interviewReport) {
//           return res.status(404).json({ message: 'Interview report not found' });
//      }
//      res.status(200).json({
//           message: 'Interview report retrieved successfully',
//           data :interviewReport
//      });
// }

// /**
//  * @description Controller to get all interview reports of logged in user
//  */

// async function getAllInterviewReportsController(req, res) {
     
//      const interviewReports = await interviewReportModel.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

     
//      res.status(200).json({
//                message: "Interview reports fetched successfully.",
//                data : interviewReports
//     })
// }

// /**
//  * @description Controller to generate resume PDF based on candidate's self-description, job description and resume content
//  */

// async function generateResumePdfController(req, res) {
//     try {
//         const { interviewReportId } = req.params;

//     const interviewReport = await interviewReportModel.findOne({
//   _id: interviewReportId,
//   user: req.user._id
//     });
//         if (!interviewReport) {
//             return res.status(404).json({ message: "Interview report not found" });
//         }

//         const { resume, selfDescription, jobDescription } = interviewReport;

//         const pdfBuffer = await generateResumePdf({
//             resume,
//             selfDescription,
//             jobDescription
//         });

//         res.set({
//             'Content-Type': 'application/pdf',
//             'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
//         });

//         res.send(pdfBuffer);

//     } catch (error) {
//         console.error("Controller Error:", error);
//         res.status(500).json({
//             message: error.message || "Failed to generate resume PDF"
//         });
//     }
// }

// /**
//  * @description Controller to delete an interview report by ID
//  */

// async function deleteInterviewReportController(req, res) {
//     try {
//         const { interviewId } = req.params;
//         const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user._id });
//         if (!deletedReport) {
//             return res.status(404).json({ message: 'Interview report not found or not authorized to delete' });
//         }
//         res.status(200).json({
//             message: 'Interview report deleted successfully'
//         });
//     } catch (error) {
//         console.error("Delete Error:", error);
//         res.status(500).json({
//             message: error.message || "Failed to delete interview report"
//         });
//     }
// }

// module.exports={generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController}


const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * Helper function to extract text from PDF Buffer.
 * Optimized for pdf-parse v2.4.5 and Vercel Serverless environment.
 */
async function getPdfText(buffer) {
    // 1. Polyfill browser globals for Vercel using the built-in worker
    require('pdf-parse/worker'); 
    
    // 2. Lazy load the Class and Factory
    const { PDFParse, CanvasFactory } = require('pdf-parse');

    try {
        // 3. Initialize the Class-based parser (v2.x syntax)
        // We pass CanvasFactory as a placeholder to satisfy internal checks
        const parser = new PDFParse({ 
            data: new Uint8Array(buffer), 
            CanvasFactory 
        });

        // 4. Extract text content
        const result = await parser.getText();
        
        // 5. Cleanup to prevent Vercel memory leaks
        await parser.destroy();
        
        return result.text;
    } catch (error) {
        console.error("PDF v2.4.5 Parser Internal Error:", error);
        throw new Error("Failed to extract text from PDF.");
    }
}

/**
 * @desc Generates an interview report
 **/
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        // Extract text using our Vercel-safe helper
        const resumeText = await getPdfText(req.file.buffer);
        const { selfDescription, jobDescription } = req.body;

        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        const interviewReport = await interviewReportModel.create({
            user: req.user._id,
            resume: resumeText,
            selfDescription,
            jobDescription,
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            data: interviewReport
        });
    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ message: error.message || "Internal Server Error" });
    }
}

/** * @description Controller to get interview report by ID
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });
        
        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found' });
        }
        
        res.status(200).json({
            message: 'Interview report retrieved successfully',
            data: interviewReport
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Controller to get all interview reports of logged in user
 */
async function getAllInterviewReportsController(req, res) {
    try {
        const interviewReports = await interviewReportModel.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

        res.status(200).json({
            message: "Interview reports fetched successfully.",
            data: interviewReports
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Controller to generate resume PDF based on saved report
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user._id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found" });
        }

        const pdfBuffer = await generateResumePdf({
            resume: interviewReport.resume,
            selfDescription: interviewReport.selfDescription,
            jobDescription: interviewReport.jobDescription
        });

        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
        });

        res.send(pdfBuffer);
    } catch (error) {
        console.error("PDF Generation Error:", error);
        res.status(500).json({
            message: error.message || "Failed to generate resume PDF"
        });
    }
}

/**
 * @description Controller to delete an interview report by ID
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user._id });
        
        if (!deletedReport) {
            return res.status(404).json({ message: 'Interview report not found or not authorized' });
        }
        
        res.status(200).json({
            message: 'Interview report deleted successfully'
        });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ message: "Failed to delete interview report" });
    }
}

module.exports = {
    generateInterviewReportController,
    getInterviewReportByIdController,
    getAllInterviewReportsController,
    generateResumePdfController,
    deleteInterviewReportController
};