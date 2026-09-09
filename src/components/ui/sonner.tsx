import { Toaster as Sonner } from "sonner";

function Toaster() {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast bg-card text-card-foreground border-border shadow-[var(--shadow-border)]",
          description: "text-muted-foreground",
        },
      }}
    />
  );
}

export { Toaster };
