import { headers } from "next/headers";

type Job = { title: string; url: string; slug: string; published: string; labels: string[]; summary: string };

async function getJobs(): Promise<Job[]> {
  try {
    const response = await fetch("https://jobsiind.blogspot.com/feeds/posts/default?alt=json&max-results=30", {
      next: { revalidate: 300 }
    });
    if (!response.ok) return [];
    const data = await response.json();
    const entries = data?.feed?.entry ?? [];
    return entries.map((entry: any) => {
      const links = entry.link ?? [];
      const alternate = links.find((link: any) => link.rel === "alternate");
      const content = entry.content?.$t ?? entry.summary?.$t ?? "";
      const plain = content.replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
      return {
        title: entry.title?.$t ?? "Job opportunity",
url: alternate?.href ?? "https://jobsiind.blogspot.com",
slug: (alternate?.href ?? "").replace(/\/$/, "").split("/").pop() ?? "",
                published: entry.published?.$t ?? "",
        labels: (entry.category ?? []).map((item: any) => item.term),
        summary: plain.slice(0, 180)
      };
    });
  } catch {
    return [];
  }
}

export default async function Home() {
  const jobs = await getJobs();
  return (
    <main>
      <header className="topbar"><a className="brand" href="/">JOBSI<span>.</span></a><nav><a href="#jobs">Latest Jobs</a><a href="#about">About</a><a className="blogLink" href="https://jobsiind.blogspot.com" target="_blank" rel="noreferrer">JOBSI Blog ↗</a></nav></header>
      <section className="hero">
        <div className="decor decorOne">✿</div><div className="decor decorTwo">✧</div>
        <div className="heroCopy"><p className="eyebrow">YOUR NEXT CHAPTER STARTS HERE</p><h1>Find the job.<br/><em>Build your future.</em></h1><p className="intro">Explore the latest government, banking, private and IT job opportunities — all in one place.</p><a className="primary" href="#jobs">Explore latest jobs <span>→</span></a><div className="trust">✦ Fresh opportunities · Clear information · Official links</div></div>
        <div className="heroArt"><div className="sun"></div><div className="artCard"><div className="screen"><div className="screenTop"></div><div className="screenLine"></div><div className="screenLine short"></div><div className="screenButton"></div></div><div className="person"><div className="hair"></div><div className="face"></div><div className="body"></div></div></div><div className="floatingNote">✦ New opportunities<br/><b>Start exploring</b></div></div>
      </section>
      <section className="searchWrap"><div className="searchIcon">⌕</div><input aria-label="Search jobs" placeholder="Search by job title, company or keyword..." /><a className="searchButton" href="#jobs">Search jobs</a></section>
      <section className="categories"><div><p className="eyebrow">EXPLORE BY INTEREST</p><h2>Find your <em>career path</em></h2></div><div className="categoryGrid">{[["🏛️","Government"],["🏦","Banking"],["🚆","Railway"],["💻","IT & Tech"],["🏢","Private Jobs"],["🎓","Teaching"],["🩺","Healthcare"],["📋","Other Jobs"]].map(([icon,name])=><a className="category" href="#jobs" key={name}><span>{icon}</span><b>{name}</b><small>Explore jobs ↗</small></a>)}</div></section>
      <section className="jobsSection" id="jobs"><div className="sectionHead"><div><p className="eyebrow">UPDATED FROM OUR BLOG</p><h2>Latest <em>job updates</em></h2><p className="muted">New posts published on the JOBSI Blog appear here automatically.</p></div><a className="textLink" href="https://jobsiind.blogspot.com" target="_blank" rel="noreferrer">View all posts ↗</a></div>
        {jobs.length ? <div className="jobGrid">{jobs.map((job, i)=><article className="jobCard" key={job.url}><div className="jobTop"><span className="jobIcon">{["🏛️","🏦","💼"][i%3]}</span><span className="newTag">LATEST</span></div><h3>{job.title}</h3><p>{job.summary || "Open this post to read eligibility, important dates and application details."}</p><div className="tags">{(job.labels.length ? job.labels.slice(0,3) : ["JOBSI"]).map(label=><span key={label}>{label}</span>)}</div><a className="cardLink" href={`/jobs/${encodeURIComponent(job.slug)}`}>View details <b>→</b></a></article>)}</div> : <div className="empty"><div>✿</div><h3>Your next opportunity will appear here</h3><p>Publish your first job notification on the JOBSI Blogger blog. It will automatically show up in this section.</p><a className="primary" href="https://jobsiind.blogspot.com" target="_blank" rel="noreferrer">Publish a job on Blogger ↗</a></div>}
      </section>
      <section className="career" id="about"><div><p className="eyebrow">A LITTLE HELP GOES A LONG WAY</p><h2>Make your next<br/><em>move with confidence.</em></h2><p>JOBSI brings useful job updates together so you can spend less time searching and more time preparing.</p></div><div className="careerFeatures"><div>✦ <b>Clear job information</b><small>Eligibility, dates and details in one place.</small></div><div>✦ <b>Official application links</b><small>Find the source and apply with confidence.</small></div><div>✦ <b>Fresh updates</b><small>New posts flow in from the JOBSI Blog.</small></div></div></section>
      <footer><a className="brand" href="/">JOBSI<span>.</span></a><p>Find Opportunities. Build Your Future.</p><small>© {new Date().getFullYear()} JOBSI. Always verify details on the official recruitment website.</small></footer>
    </main>
  );
}
