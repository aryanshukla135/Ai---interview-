const pdfParse = require("pdf-parse");
const { generateInterviewReport, generateResumePdf } = require("../services/ai.service");
const interviewReportModel = require("../models/interviewReport.model");





async function generateInterviewReportController(req,res){
      const {selfDescription, jobDescription} = req.body;

      if (!jobDescription || (!req.file && !selfDescription)) {
        return res.status(400).json({ message: "Job description and a resume or self description are required" });
      }

      let resumeContent = "";
      if (req.file) {
        const parsedResume = await (new pdfParse.PDFParse(Uint8Array.from(req.file.buffer))).getText();
        resumeContent = parsedResume.text;
      }

      const interViewReportByAi = await generateInterviewReport({resume: resumeContent, selfDescription, jobDescription});

      const interviewReport  = await interviewReportModel.create({
        user : req.user.id,
        resume: resumeContent,
        selfDescription,
        jobDescription,
        ...interViewReportByAi
        })
      
    res.status(201).json({
        message:"Interview report generated successfully ",
        interviewReport
    })    
}


async function getInterviewReportByIdController(req,res){
   const {interviewId} = req.params;
   const interviewReport = await interviewReportModel.findOne({_id:interviewId, user:req.user.id});
   if (!interviewReport) {
     return res.status(404).json({ message: "Interview report not found" });
   }
   res.status(200).json({ 
    message: "Interview report fetched successfully",
    interviewReport });
}



async function getAllInterviewReportsController(req,res){
  const interviewReports = await interviewReportModel.find({ user 
: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan");

res.status(200).json({
  message: "All interview reports fetched successfully",
  interviewReports
});
}

async function downloadResumePdfController(req, res) {
  const { interviewId } = req.params;
  const interviewReport = await interviewReportModel.findOne({
    _id: interviewId,
    user: req.user.id
  }).select("resume selfDescription jobDescription title");

  if (!interviewReport) {
    return res.status(404).json({ message: "Interview report not found" });
  }

  const pdf = await generateResumePdf({
    resume: interviewReport.resume || "",
    selfDescription: interviewReport.selfDescription || "",
    jobDescription: interviewReport.jobDescription
  });

  const filename = `${(interviewReport.title || "interview-plan")
    .replace(/[^a-z0-9]+/gi, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase() || "interview-plan"}.pdf`;

  res
    .type("application/pdf")
    .attachment(filename)
    .send(pdf);
}




module.exports = {
  generateInterviewReportController,
  getInterviewReportByIdController,
  getAllInterviewReportsController,
  downloadResumePdfController
}