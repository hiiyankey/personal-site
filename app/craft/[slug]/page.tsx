import Link from "next/link";
import { collections } from "@/lib/constants";
import type { Card } from "@/lib/models";
import { formatDate } from "@/lib/utils";
import { Container } from "@/ui/container";
import { Stage } from "@/ui/stage";

const cards: Card[] = collections.prototypes.cards;

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = cards.findIndex((card) => card.slug === slug);
  const card = cards[index];
  const previous = index > 0 ? cards[index - 1] : null;

  const next = index < cards.length - 1 ? cards[index + 1] : null;

  return (
    <div className="min-h-dvh">
      <main>
        <Container className="py-40">
          <div className="mb-8 flex items-center gap-2">
            <h3 className="text-gray-11">{card.title}</h3>
            <div className="size-1 rounded-full bg-gray-9" />
            <span className="text-gray-11">{formatDate(card.year)}</span>
          </div>

          <Stage>{card.title}</Stage>

          <footer>
            <div className="my-10 h-px w-full bg-gray-6" />
            <div className="flex items-center">
              <span className="relative flex flex-col gap-1">
                {previous ? (
                  <Link
                    className="text-14 text-gray-11"
                    href={`/craft/${previous.slug}`}
                  >
                    Previous
                    <span className="absolute inset-0 isolate" />
                  </Link>
                ) : null}
                <h3>{previous?.title}</h3>
              </span>
              <span className="relative ml-auto flex flex-col gap-1">
                {next ? (
                  <Link
                    className="text-14 text-gray-11"
                    href={`/craft/${next.slug}`}
                  >
                    Next
                    <span className="absolute inset-0 isolate" />
                  </Link>
                ) : null}
                <h3>{next?.title}</h3>
              </span>
            </div>
          </footer>
        </Container>
      </main>
    </div>
  );
}
