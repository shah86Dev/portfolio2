import Link from "next/link";

import { Cta } from "@/components/ui/Cta";
import { publishedProjects } from "@/content";

export default function NotFound() {
  return (
    <div className="frame flex min-h-[60vh] flex-col justify-center py-20">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 text-h1 text-ink">That page is not here.</h1>
      <p className="measure mt-5 text-lead text-ink-muted">
        The link may be out of date, or the project may not be published yet.
        Here is the way back.
      </p>

      <div className="mt-9 flex flex-wrap gap-3">
        <Cta href="/">Back to the start</Cta>
        <Cta href="/work" variant="ghost">
          See the work
        </Cta>
      </div>

      <ul className="mt-12 flex flex-wrap gap-x-6 gap-y-2 border-t border-line pt-6">
        {publishedProjects.map((project) => (
          <li key={project.slug}>
            <Link
              href={`/work/${project.slug}`}
              className="text-caption text-ink-muted transition-colors duration-[--dur-fast] hover:text-signal"
            >
              {project.title}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
