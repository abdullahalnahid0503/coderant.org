import "dotenv/config";
import express from "express";

const app = express();
const PORT = 3001;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "CodeRant Jobs API is running",
  });
});

app.get("/api/jobs", async (req, res) => {
  try {
    const apiKey = process.env.RAPIDAPI_KEY;

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "RapidAPI key is not configured",
      });
    }

    const q = String(req.query.q || "software developer")
      .trim()
      .slice(0, 150);

    const country = String(req.query.country || "my")
      .trim()
      .toLowerCase();

    const params = new URLSearchParams({
      query: q,
      page: "1",
      num_pages: "1",
      date_posted: "all",
    });

    if (country !== "worldwide") {
      params.set("country", country);
    }

    const response = await fetch(
      `https://jsearch.p.rapidapi.com/search-v2?${params}`,
      {
        method: "GET",
        headers: {
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
        },
      },
    );

    const result = await response.json();

    console.log("JSearch response status:", response.status);
    console.log("JSearch data type:", typeof result.data);
    console.log(
      "JSearch data preview:",
      JSON.stringify(result.data).slice(0, 500),
    );

    if (!response.ok) {
      console.error("JSearch API error:", response.status);

      return res.status(response.status).json({
        success: false,
        message: "The external job provider returned an error",
      });
    }

    const jobList = Array.isArray(result.data)
      ? result.data
      : Array.isArray(result.data?.jobs)
        ? result.data.jobs
        : [];

    const jobs = jobList.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: [job.job_city, job.job_state, job.job_country]
        .filter(Boolean)
        .join(", "),
      employmentType: job.job_employment_type || "Not specified",
      description: job.job_description,
      source: job.job_publisher,
      url: job.job_apply_link,
      postedAt: job.job_posted_at_datetime_utc,
      isRemote: job.job_is_remote,
      salaryMin: job.job_min_salary,
      salaryMax: job.job_max_salary,
      salaryCurrency: job.job_salary_currency,
    }));

    res.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Job search failed:", error.message);

    res.status(500).json({
      success: false,
      message: "Unable to fetch jobs right now",
    });
  }
});

app.listen(PORT, () => {
  console.log(`CodeRant API running at http://localhost:${PORT}`);
});
