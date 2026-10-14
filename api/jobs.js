export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({
      success: false,
      message: "Method not allowed",
    });
  }

  try {
    const apiKey = process.env.RAPIDAPI_KEY;
    const apiHost = process.env.RAPIDAPI_HOST || "jsearch.p.rapidapi.com";

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        message: "RapidAPI key is not configured",
      });
    }

    const rawQuery = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q;

    const rawCountry = Array.isArray(req.query.country)
      ? req.query.country[0]
      : req.query.country;

    const q = String(rawQuery || "software developer")
      .trim()
      .slice(0, 150);

    const country = String(rawCountry || "my")
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

    const response = await fetch(`https://${apiHost}/search-v2?${params}`, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": apiHost,
      },
      signal: AbortSignal.timeout(15000),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("RapidAPI returned status:", response.status);

      return res.status(502).json({
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

    return res.status(200).json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error) {
    console.error("Job search failed:", error.message);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch jobs right now",
    });
  }
}
