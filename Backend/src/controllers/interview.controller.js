// // const pdfParse = require('pdf-parse');
// // const  {generateInterviewReport,generateResumePdf} = require('../services/ai.service');
// // const interviewReportModel= require('../models/interviewReport.model');



// // /**
// //  * @desc Generates an interview report based on the candidate's resume, self-description, and the job description
// //  **/


// // async function generateInterviewReportController(req, res) {

// //      const  resumeContent = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText()
// //      const { selfDescription, jobDescription } = req.body;

// //      const interViewReportByAi= await generateInterviewReport({
// //           resume:resumeContent.text,
// //           selfDescription,
// //           jobDescription
// // })

// //   const interviewReport= await interviewReportModel.create({
// //      user:req.user._id,
// //      resume:resumeContent.text,
// //      selfDescription,
// //      jobDescription,
// //      ...interViewReportByAi
// // })
// //      res.status(201).json({
// //           message:"Interview report generated successfully",
// //           data: interviewReport
// //      })

// // }


// // /** 
// //  * @description Controller to get interview report by ID
// // */

// // async function getInterviewReportByIdController(req, res) {
// //      const { interviewId } = req.params;
// //      const interviewReport = await interviewReportModel.findOne({ _id: interviewId, user: req.user._id });
// //      if (!interviewReport) {
// //           return res.status(404).json({ message: 'Interview report not found' });
// //      }
// //      res.status(200).json({
// //           message: 'Interview report retrieved successfully',
// //           data :interviewReport
// //      });
// // }

// // /**
// //  * @description Controller to get all interview reports of logged in user
// //  */

// // async function getAllInterviewReportsController(req, res) {
     
// //      const interviewReports = await interviewReportModel.find({ user: req.user._id }).sort({ createdAt: -1 }).select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

     
// //      res.status(200).json({
// //                message: "Interview reports fetched successfully.",
// //                data : interviewReports
// //     })
// // }

// // /**
// //  * @description Controller to generate resume PDF based on candidate's self-description, job description and resume content
// //  */

// // async function generateResumePdfController(req, res) {
// //     try {
// //         const { interviewReportId } = req.params;

// //     const interviewReport = await interviewReportModel.findOne({
// //   _id: interviewReportId,
// //   user: req.user._id
// //     });
// //         if (!interviewReport) {
// //             return res.status(404).json({ message: "Interview report not found" });
// //         }

// //         const { resume, selfDescription, jobDescription } = interviewReport;

// //         const pdfBuffer = await generateResumePdf({
// //             resume,
// //             selfDescription,
// //             jobDescription
// //         });

// //         res.set({
// //             'Content-Type': 'application/pdf',
// //             'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
// //         });

// //         res.send(pdfBuffer);

// //     } catch (error) {
// //         console.error("Controller Error:", error);
// //         res.status(500).json({
// //             message: error.message || "Failed to generate resume PDF"
// //         });
// //     }
// // }

// // /**
// //  * @description Controller to delete an interview report by ID
// //  */

// // async function deleteInterviewReportController(req, res) {
// //     try {
// //         const { interviewId } = req.params;
// //         const deletedReport = await interviewReportModel.findOneAndDelete({ _id: interviewId, user: req.user._id });
// //         if (!deletedReport) {
// //             return res.status(404).json({ message: 'Interview report not found or not authorized to delete' });
// //         }
// //         res.status(200).json({
// //             message: 'Interview report deleted successfully'
// //         });
// //     } catch (error) {
// //         console.error("Delete Error:", error);
// //         res.status(500).json({
// //             message: error.message || "Failed to delete interview report"
// //         });
// //     }
// // }

// // module.exports={generateInterviewReportController, getInterviewReportByIdController, getAllInterviewReportsController, generateResumePdfController, deleteInterviewReportController}




// // //deployyyyyycode


// // // const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
// // // const interviewReportModel = require('../models/interviewReport.model');
// // // const pdf = require('pdf-parse');

// // // /**
// // //  * Helper function to extract text from PDF Buffer.
// // //  * Detects environment to ensure local rendering is not compromised.
// // //  */
// // // async function getPdfText(buffer) {
// // //     try {
// // //         // Detect if we are on Vercel/Production
// // //         const isProduction = process.env.NODE_ENV === 'production' || process.env.VERCEL;

// // //         // On Vercel, we MUST skip pagerender to avoid "Canvas" dependency crashes.
// // //         // Locally, we use the default (empty object) so your full PDF features work.
// // //         const options = isProduction ? {
// // //             pagerender: function() { return ""; } 
// // //         } : {}; 

// // //         const data = await pdf(buffer, options);
        
// // //         if (!data || !data.text) {
// // //             throw new Error("PDF text extraction resulted in empty content.");
// // //         }

// // //         return data.text;
// // //     } catch (error) {
// // //         console.error("PDF Parsing Error:", error);
// // //         throw new Error("Failed to extract text from PDF. Please check the file format.");
// // //     }
// // // }

// // // /**
// // //  * @desc Generates an interview report
// // //  **/
// // // async function generateInterviewReportController(req, res) {
// // //     try {
// // //         if (!req.file) {
// // //             return res.status(400).json({ message: "Resume file is required" });
// // //         }

// // //         // Extract text using our Environment-Aware helper
// // //         const resumeText = await getPdfText(req.file.buffer);
        
// // //         const { selfDescription, jobDescription } = req.body;

// // //         // Generate report via AI Service
// // //         const interViewReportByAi = await generateInterviewReport({
// // //             resume: resumeText,
// // //             selfDescription,
// // //             jobDescription
// // //         });

// // //         // Save the result to MongoDB
// // //         const interviewReport = await interviewReportModel.create({
// // //             user: req.user._id,
// // //             resume: resumeText,
// // //             selfDescription,
// // //             jobDescription,
// // //             ...interViewReportByAi
// // //         });

// // //         res.status(201).json({
// // //             message: "Interview report generated successfully",
// // //             data: interviewReport
// // //         });
// // //     } catch (error) {
// // //         console.error("Report Generation Error:", error);
// // //         res.status(500).json({ message: error.message || "Internal Server Error" });
// // //     }
// // // }

// // // /**
// // //  * @desc Get interview report by ID
// // //  */
// // // async function getInterviewReportByIdController(req, res) {
// // //     try {
// // //         const { interviewId } = req.params;
// // //         const interviewReport = await interviewReportModel.findOne({ 
// // //             _id: interviewId, 
// // //             user: req.user._id 
// // //         });
        
// // //         if (!interviewReport) {
// // //             return res.status(404).json({ message: 'Interview report not found' });
// // //         }
        
// // //         res.status(200).json({
// // //             message: 'Interview report retrieved successfully',
// // //             data: interviewReport
// // //         });
// // //     } catch (error) {
// // //         res.status(500).json({ message: error.message });
// // //     }
// // // }

// // // /**
// // //  * @desc Get all interview reports for the logged-in user
// // //  */
// // // async function getAllInterviewReportsController(req, res) {
// // //     try {
// // //         const interviewReports = await interviewReportModel.find({ user: req.user._id })
// // //             .sort({ createdAt: -1 })
// // //             .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

// // //         res.status(200).json({
// // //             message: "Interview reports fetched successfully.",
// // //             data: interviewReports
// // //         });
// // //     } catch (error) {
// // //         res.status(500).json({ message: error.message });
// // //     }
// // // }

// // // /**
// // //  * @desc Generate resume PDF based on saved report
// // //  */
// // // async function generateResumePdfController(req, res) {
// // //     try {
// // //         const { interviewReportId } = req.params;

// // //         const interviewReport = await interviewReportModel.findOne({
// // //             _id: interviewReportId,
// // //             user: req.user._id
// // //         });

// // //         if (!interviewReport) {
// // //             return res.status(404).json({ message: "Interview report not found" });
// // //         }

// // //         // This calls the PDF generation logic in your ai.service.js
// // //         const pdfBuffer = await generateResumePdf({
// // //             resume: interviewReport.resume,
// // //             selfDescription: interviewReport.selfDescription,
// // //             jobDescription: interviewReport.jobDescription
// // //         });

// // //         res.set({
// // //             'Content-Type': 'application/pdf',
// // //             'Content-Disposition': `attachment; filename=resume_${interviewReportId}.pdf`,
// // //         });

// // //         res.send(pdfBuffer);
// // //     } catch (error) {
// // //         console.error("PDF Generation Error:", error);
// // //         res.status(500).json({
// // //             message: "PDF Generation failed. If this is on Vercel, check Puppeteer compatibility."
// // //         });
// // //     }
// // // }

// // // /**
// // //  * @desc Delete an interview report
// // //  */
// // // async function deleteInterviewReportController(req, res) {
// // //     try {
// // //         const { interviewId } = req.params;
// // //         const deletedReport = await interviewReportModel.findOneAndDelete({ 
// // //             _id: interviewId, 
// // //             user: req.user._id 
// // //         });
        
// // //         if (!deletedReport) {
// // //             return res.status(404).json({ message: 'Interview report not found or unauthorized' });
// // //         }
        
// // //         res.status(200).json({
// // //             message: 'Interview report deleted successfully'
// // //         });
// // //     } catch (error) {
// // //         res.status(500).json({ message: "Failed to delete interview report" });
// // //     }
// // // }

// // // module.exports = {
// // //     generateInterviewReportController,
// // //     getInterviewReportByIdController,
// // //     getAllInterviewReportsController,
// // //     generateResumePdfController,
// // //     deleteInterviewReportController
// // // };

// const pdfParse = require('pdf-parse-fork'); // Use the fork to prevent Vercel crash
// const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
// const interviewReportModel = require('../models/interviewReport.model');

// /**
//  * @desc Generates an interview report based on resume, self-description, and JD
//  **/
// async function generateInterviewReportController(req, res) {
//     try {
//         if (!req.file) {
//             return res.status(400).json({ message: "Resume file is required" });
//         }

//         // pdf-parse-fork extracts text simply without triggering Canvas/DOM errors
//         const resumeData = await pdfParse(req.file.buffer);
//         const resumeText = resumeData.text;

//         const { selfDescription, jobDescription } = req.body;

//         // Generate report via Gemini AI
//         const interViewReportByAi = await generateInterviewReport({
//             resume: resumeText,
//             selfDescription,
//             jobDescription
//         });

//         // Save to Database
//         const interviewReport = await interviewReportModel.create({
//             user: req.user._id,
//             resume: resumeText,
//             selfDescription,
//             jobDescription,
//             ...interViewReportByAi
//         });

//         res.status(201).json({
//             message: "Interview report generated successfully",
//             data: interviewReport
//         });

//     } catch (error) {
//         console.error("Report Generation Error:", error);
//         res.status(500).json({ 
//             message: error.message || "Internal Server Error during report generation" 
//         });
//     }
// }

// /** * @desc Get interview report by ID
//  */
// async function getInterviewReportByIdController(req, res) {
//     try {
//         const { interviewId } = req.params;
//         const interviewReport = await interviewReportModel.findOne({ 
//             _id: interviewId, 
//             user: req.user._id 
//         });

//         if (!interviewReport) {
//             return res.status(404).json({ message: 'Interview report not found' });
//         }

//         res.status(200).json({
//             message: 'Interview report retrieved successfully',
//             data: interviewReport
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// /**
//  * @desc Get all interview reports for logged-in user
//  */
// async function getAllInterviewReportsController(req, res) {
//     try {
//         const interviewReports = await interviewReportModel.find({ user: req.user._id })
//             .sort({ createdAt: -1 })
//             .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

//         res.status(200).json({
//             message: "Interview reports fetched successfully.",
//             data: interviewReports
//         });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

// /**
//  * @desc Generate resume PDF based on saved report
//  */
// async function generateResumePdfController(req, res) {
//     try {
//         const { interviewReportId } = req.params;

//         const interviewReport = await interviewReportModel.findOne({
//             _id: interviewReportId,
//             user: req.user._id
//         });

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
//         console.error("PDF Generation Error:", error);
//         res.status(500).json({
//             message: error.message || "Failed to generate resume PDF"
//         });
//     }
// }

// /**
//  * @desc Delete an interview report
//  */
// async function deleteInterviewReportController(req, res) {
//     try {
//         const { interviewId } = req.params;
//         const deletedReport = await interviewReportModel.findOneAndDelete({ 
//             _id: interviewId, 
//             user: req.user._id 
//         });

//         if (!deletedReport) {
//             return res.status(404).json({ message: 'Interview report not found or unauthorized' });
//         }

//         res.status(200).json({
//             message: 'Interview report deleted successfully'
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Failed to delete interview report" });
//     }
// }

// module.exports = {
//     generateInterviewReportController,
//     getInterviewReportByIdController,
//     getAllInterviewReportsController,
//     generateResumePdfController,
//     deleteInterviewReportController
// };
const pdfParse = require('pdf-parse-fork'); 
const { generateInterviewReport, generateResumePdf } = require('../services/ai.service');
const interviewReportModel = require('../models/interviewReport.model');

/**
 * @desc Generates an interview report based on resume, self-description, and JD
 **/
async function generateInterviewReportController(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Resume file is required" });
        }

        // pdf-parse-fork extracts text simply without triggering Canvas/DOM errors on Vercel
        const resumeData = await pdfParse(req.file.buffer);
        const resumeText = resumeData.text;

        const { selfDescription, jobDescription } = req.body;

        // Generate report via AI Service
        const interViewReportByAi = await generateInterviewReport({
            resume: resumeText,
            selfDescription,
            jobDescription
        });

        // Save to Database
        // We use req.user.id to link the report to the logged-in user
        const interviewReport = await interviewReportModel.create({
            user: req.user.id, 
            resume: resumeText,
            selfDescription,
            jobDescription,
            // Fallback for title to prevent Mongoose ValidationError
            title: interViewReportByAi.title || "Interview Preparation Report",
            ...interViewReportByAi
        });

        res.status(201).json({
            message: "Interview report generated successfully",
            data: interviewReport
        });

    } catch (error) {
        console.error("Report Generation Error:", error);
        res.status(500).json({ 
            message: error.message || "Internal Server Error during report generation" 
        });
    }
}

/** * @desc Get interview report by ID (Private to User)
 */
async function getInterviewReportByIdController(req, res) {
    try {
        const { interviewId } = req.params;
        
        // Ensure the report belongs to the requesting user
        const interviewReport = await interviewReportModel.findOne({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!interviewReport) {
            return res.status(404).json({ message: 'Interview report not found or unauthorized' });
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
 * @desc Get all interview reports for the logged-in user only
 */
async function getAllInterviewReportsController(req, res) {
    try {
        // This query is the fix for User A seeing User B's reports
        const interviewReports = await interviewReportModel.find({ user: req.user.id })
            .sort({ createdAt: -1 })
            .select('-resume -selfDescription -jobDescription -__v -technicalQuestions -skillGaps -preparationPlan');

        res.status(200).json({
            message: "Your interview reports fetched successfully.",
            data: interviewReports
        });
    } catch (error) {
        console.error("Fetch Error:", error);
        res.status(500).json({ message: error.message });
    }
}

/**
 * @desc Generate resume PDF based on saved report
 */
async function generateResumePdfController(req, res) {
    try {
        const { interviewReportId } = req.params;

        const interviewReport = await interviewReportModel.findOne({
            _id: interviewReportId,
            user: req.user.id
        });

        if (!interviewReport) {
            return res.status(404).json({ message: "Interview report not found or unauthorized" });
        }

        const { resume, selfDescription, jobDescription } = interviewReport;

        const pdfBuffer = await generateResumePdf({
            resume,
            selfDescription,
            jobDescription
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
 * @desc Delete an interview report
 */
async function deleteInterviewReportController(req, res) {
    try {
        const { interviewId } = req.params;
        
        // Only allow deletion if the user owns the report
        const deletedReport = await interviewReportModel.findOneAndDelete({ 
            _id: interviewId, 
            user: req.user.id 
        });

        if (!deletedReport) {
            return res.status(404).json({ message: 'Interview report not found or unauthorized' });
        }

        res.status(200).json({
            message: 'Interview report deleted successfully'
        });
    } catch (error) {
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