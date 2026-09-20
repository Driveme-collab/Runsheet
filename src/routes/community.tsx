import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Handshake, MessageCircle, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/page-header";
import { useRunsheet } from "@/lib/store";

export const Route = createFileRoute("/community")({ component: CommunityPage });

function CommunityPage() {
  const availability = useRunsheet((s) => s.availability);
  const handoffs = useRunsheet((s) => s.handoffs);
  const conversations = useRunsheet((s) => s.conversations);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Community"
        subtitle="Driver to driver. This is not an employer feed, and it is not live yet."
      />

      <Card>
        <CardContent className="grid gap-2">
          <h2 className="font-display text-xl">This stays your space</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Family goals, savings, the emergency fund, allocations and private notes stay in your
            book. They will never be part of a handoff or a conversation unless you export them
            yourself. A future connection with an operator would only share work you choose — trips
            or hours, not this private layer.
          </p>
          <Link to="/settings" className="mt-1 inline-flex h-11 items-center gap-2 text-sm font-medium underline-offset-4 hover:underline">
            Privacy in Profile
            <ArrowRight className="size-4" />
          </Link>
        </CardContent>
      </Card>

      <div className="grid gap-3 sm:grid-cols-3">
        <ReadyCard
          icon={Users}
          title="Availability"
          body={
            availability.length
              ? `${availability.length} window${availability.length === 1 ? "" : "s"} on file.`
              : "Not enough data yet. Later you will be able to mark when you can take work — without broadcasting your money."
          }
        />
        <ReadyCard
          icon={Handshake}
          title="Handoff"
          body={
            handoffs.length
              ? `${handoffs.length} request${handoffs.length === 1 ? "" : "s"} on file.`
              : "Not enough data yet. A later stage can pass a pickup and drop-off to another driver. Client money stays out of it."
          }
        />
        <ReadyCard
          icon={MessageCircle}
          title="Conversations"
          body={
            conversations.length
              ? `${conversations.length} thread${conversations.length === 1 ? "" : "s"}.`
              : "Not enough data yet. No messages until you start them. Nothing here is invented."
          }
        />
      </div>
    </div>
  );
}

function ReadyCard({
  icon: Icon,
  title,
  body,
}: {
  icon: typeof Users;
  title: string;
  body: string;
}) {
  return (
    <Card>
      <CardContent className="grid gap-2">
        <div className="flex size-11 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
          <Icon className="size-4" />
        </div>
        <h2 className="font-display text-xl">{title}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{body}</p>
      </CardContent>
    </Card>
  );
}
