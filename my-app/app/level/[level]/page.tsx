import { notFound } from "next/navigation";
import Main from "../../Main";

export async function generateStaticParams() {
  return Array.from({ length: 10 }, (_, i) => ({ level: String(i + 1) }));
}

export default async function LevelPage({ params }: { params: Promise<{ level: string }> }) {
  const { level: levelParam } = await params;
  const level = Number(levelParam);

  if (!Number.isInteger(level) || level < 1 || level > 10) {
    notFound();
  }

  return <Main level={level} />;
}
