import supabaseClient, { supabaseUrl } from "@/utils/supabase";
// import supabaseClient from "@/utils/supabase";

// - Apply to job ( candidate )
export async function applyToJob(token, _, jobData) {
  const supabase = await supabaseClient(token);

  const random = Math.floor(Math.random() * 90000);
  const fileName = `resume-${random}-${jobData.candidate_id}`;

  const { error: storageError } = await supabase.storage
    .from("resumes")
    .upload(fileName, jobData.resume);

  if (storageError) throw new Error("Error uploading Resume");

  const resume = `${supabaseUrl}/storage/v1/object/public/resumes/${fileName}`;

  const { data, error } = await supabase
    .from("applications")
    .insert([
      {
        ...jobData,
        resume,
      },
    ])
    .select();

  if (error) {
    console.error(error);
    throw new Error("Error submitting Application");
  }

  return data;
}

export async function updateApplicationStatus(token, { candidate_id }, status) {
  try {
    if (!token) {
      console.error("Authentication token is missing.");
      throw new Error("User authentication required.");
    }

    const supabase = await supabaseClient(token);
    const { data, error } = await supabase
      .from("applications")
      .update({ status })
      .eq("candidate_id", candidate_id)
      .select();

    if (error) {
      console.error("Supabase error updating application status:", error);
      throw new Error("Failed to update application status in the database.");
    }

    if (!data || data?.length === 0) {
      console.error("No matching application found with the provided job ID.");
      throw new Error("Application not found with the given job ID.");
    }

    return data;
  } catch (error) {
    console.error("updateApplicationStatus error:", error.message);
    return null;
  }
}


export async function getApplications(token, { user_id }) {
  const supabase = await supabaseClient(token);
  const { data, error } = await supabase
    .from("applications")
    .select("*, job:jobs(title, company:companies(name))")
    .eq("candidate_id", user_id);

  if (error) {
    console.error("Error fetching Applications:", error);
    return null;
  }

  return data;
}
