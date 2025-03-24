import React from "react";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useLocation } from "react-router-dom";

export const Header = ({ className, fixed, children, ...props }) => {
  const [offset, setOffset] = React.useState(0);
  const location = useLocation();

  React.useEffect(() => {
    const onScroll = () => {
      setOffset(document.body.scrollTop || document.documentElement.scrollTop);
    };

    // Add scroll listener to the body
    document.addEventListener("scroll", onScroll, { passive: true });

    // Clean up the event listener on unmount
    return () => document.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        " flex items-center gap-3 px-4 py-1 sm:gap-4",
        fixed && "header-fixed peer/header fixed z-50 w-[inherit] rounded-md",
        offset > 10 && fixed ? "shadow-sm" : "shadow-none",
        className
      )}
      {...props}
    >
      <SidebarTrigger  className="scale-150 sm:scale-150" />
      <Separator orientation="vertical" className="h-6" />
      {location.pathname}

      {children}
    </header>
  );
};

Header.displayName = "Header";
