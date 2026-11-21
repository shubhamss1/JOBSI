type BloggerEntry = {
  title?: { $t?: string };
  content?: { $t?: string };
  summary?: { $t?: string };
  published?: { $t?: string };
  category?: { term?: string }[];
  link?: { rel?: string; href?: string }[];
};

async function getJob(slug: string) {
  const response = await fetch(
    "https://jobsiind.blogspot.com/feeds/posts/default?alt=json&max-results=100",
    { next: { revalidate: 300 } }
  );
  if (!response.ok) return null;
  const data = await response.json();
  const entries: BloggerEntry[] = data?.feed?.entry ?? [];
  return entries.find((entry) => {
    const url = entry.link?.find((link) => link.rel === "alternate")?.href ?? "";
return url.replace(/\/$/, "").split("/").pop() === slug;
      }) ?? null;
}

function plainText(html: string) {
  return html
    .replace(/<\\/(p|div|h[1-6]|li|br)>/gi, "\\n")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

export default async function JobDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let job: BloggerEntry | null = null;
  try {
    job = await getJob(decodeURIComponent(slug));
  } catch {
    job = null;
  }

  if (!job) {
    return (
      <main className="detailPage">
        <a className="backLink" href="/">← Back to JOBSI</a>
        <section className="detailCard">
          <p className="eyebrow">JOBSI</p>
          <h1>Job not found</h1>
          <p>This post may have been removed or is not published. Please return to the latest job updates.</p>
          <a className="primary" href="/">Browse latest jobs</a>
        </section>
      </main>
    );
  }

  const title = job.title?.$t ?? "Job opportunity";
  const content = plainText(job.content?.$t ?? job.summary?.$t ?? "");
  const labels = (job.category ?? []).map((item) => item.term).filter(Boolean) as string[];
  const published = job.published?.$t
    ? new Date(job.published.$t).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })
    : "";

  return (
    <main className="detailPage">
      <header className="detailHeader">
        <a className="brand" href="/">JOBSI<span>.</span></a>
        <a className="backLink" href="/">← All jobs</a>
      </header>
      <article className="detailCard">
        <p className="eyebrow">JOBSI · JOB NOTIFICATION</p>
        <h1>{title}</h1>
        <div className="detailMeta">
          {published && <span>Published: {published}</span>}
          {labels.map((label) => <span className="detailTag" key={label}>{label}</span>)}
        </div>
        <div className="detailContent">{content.split(/\\n+/).filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}</div>
        <div className="detailActions">
          <a className="primary" href="https://jobsiind.blogspot.com" target="_blank" rel="noreferrer">Open original Blogger post ↗</a>
          <a className="backLink" href="/">← Back to latest jobs</a>
        </div>
        <p className="disclaimer">Please verify all eligibility, dates, fees and application details on the official recruitment website before applying.</p>
      </article>
      <footer><a className="brand" href="/">JOBSI<span>.</span></a><p>Find Opportunities. Build Your Future.</p></footer>
    </main>
  );
}
