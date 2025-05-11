"use client";
import useSideBar from "@/context/use-sidebar";
import React from "react";
import { cn } from '@/lib/utils'
import MaxMenu from "./maximized-menu";
import { MinMenu } from "./minimized-menu";

type Props = {
  domains:
    | {
        id: string;
        name: string;
        icon: string;
      }[]
    | null
    | undefined;
};

const SideBar = ({ domains }: Props) => {
  const { expand, onExpand, page, onSignOut } = useSideBar();

  return (
    <div
      className={cn(
        "bg-cream dark:bg-neutral-950 h-full fill-mode-forwards fixed md:relative",
        expand ? "w-[300px]" : "w-[60px]",
        expand == true ? "animate-open-sidebar" : expand == false && "animate-close-sidebar"
      )}
    >
      {expand ? (
        <MaxMenu domains={domains} current={page!} onExpand={onExpand} onSignOut={onSignOut} />
      ) : (
        <MinMenu domains={domains} current={page!} onShrink={onExpand} onSignOut={onSignOut} />
      )}
    </div>
  );
};

export default SideBar;
