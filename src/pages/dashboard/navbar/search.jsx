import { Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSearch } from "@/context/search-context";
import { cn } from "@/lib/utils";

export function Search({ className = "", placeholder = "Search" }) {
  const { setOpen } = useSearch();
  return (
    <Button
      variant="outline"
      className={cn(
        "relative h-9 w-full justify-start rounded-[0.5rem] bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64",
        className
      )}
      onClick={() => setOpen(true)}
    >
      <SearchIcon className="mr-2 h-4 w-4" />
      Search...
      <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
        <span className="text-xs">⌘</span>K
      </kbd>
    </Button>
  );
}
