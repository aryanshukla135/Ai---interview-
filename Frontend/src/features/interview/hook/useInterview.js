import {getAllInterviewReports,getInterviewReportById,generateInterviewReport,downloadResumePdf} from "../services/interview.api"
import { useCallback, useContext } from "react"
import { InterviewContext } from "../interview.context.js"

export const useInterview = () =>{
     const context = useContext(InterviewContext)
     if(!context){
        throw new Error("useInterview must be used within an InterviewProvider")
     } 
     const {loading,setLoading,report,setReport,reports,setReports} = context; 
     const generateReport = useCallback(async ({jobDescription, selfDescription, resumeFile}) => {
        setLoading(true);    
        try{
            const data = await generateInterviewReport({jobDescription, selfDescription, resumeFile});
            setReport(data.interviewReport);
            return data.interviewReport;
         }catch(error){
            console.error("Error generating interview report:", error);
            throw error;
         } finally{
            setLoading(false);
         } 
        }, [setLoading, setReport])

        const getReportById = useCallback(async (interviewId) => {
            setLoading(true);
            try{
                const data = await getInterviewReportById(interviewId);
                setReport(data.interviewReport);
            }catch(error){
                console.error("Error fetching interview report by ID:", error);
                throw error;
            }finally{
                setLoading(false);
            }
            }, [setLoading, setReport])

    const getAllReports = useCallback(async () => {
            setLoading(true);   
            try {
                const data = await getAllInterviewReports();
                setReports(data.interviewReports);
                return data.interviewReports;
            } catch (error) {
                console.error("Error fetching interview reports:", error);
                throw error;
            } finally {
                setLoading(false);
            }
        }, [setLoading, setReports])

    const getResumePdf = useCallback(async (interviewId) => {
        setLoading(true);
        try {
            return await downloadResumePdf(interviewId);
        } catch (error) {
            console.error("Error generating resume PDF:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, [setLoading])
    return {
        loading,
        report,
        reports,
        generateReport,
        getReportById,
        getAllReports,
        getResumePdf
    }   


}
