/* eslint-disable react/prop-types */
import { Boxes, BriefcaseBusiness, Download, School } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { updateApplicationStatus } from "@/api/apiApplication";
import useFetch from "@/hooks/use-fetch";
import { BarLoader } from "react-spinners";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";

const ApplicationCard = ({ application, isCandidate = false }) => {
  const [status, setStatus] = useState(application.status);
  
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = application?.resume;
    link.target = "_blank";
    link.click();
  };

  const { loading: loadingHiringStatus, fn: fnHiringStatus } = useFetch(
    updateApplicationStatus,
    {
      job_id: application.job_id,
      candidate_id: application.candidate_id, // Correctly use candidate_id from application
    }
  );

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus);
    fnHiringStatus(newStatus).catch((error) => {
      console.error("Error updating status", error);
    });
  };

  return (
    <Card>
      {loadingHiringStatus && <BarLoader width={"100%"} color="#36d7b7" />}
      <CardHeader>
        <CardTitle className="flex justify-between font-bold">
          {application?.name}
          <Download
            size={18}
            className="bg-white text-black rounded-full h-8 w-8 p-1.5 cursor-pointer"
            onClick={handleDownload}
          />
        </CardTitle>
      </CardHeader>
      
      <CardFooter className="flex justify-between">
        <span>{new Date(application?.created_at).toLocaleString()}</span>
        
        <div className="flex items-center gap-4">
          <span className="capitalize font-bold">Status: {status}</span>

          <Link to={`/applicant/${application.candidate_id}`} className="flex-1">
            <Button variant="secondary" className="w-full">
              Applicant Details
            </Button>
          </Link>

          {/* {!isCandidate && (
            <Select onValueChange={handleStatusChange} value={status}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Application Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="applied">Applied</SelectItem>
                <SelectItem value="interviewing">Interviewing</SelectItem>
                <SelectItem value="hired">Hired</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          )} */}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ApplicationCard;
