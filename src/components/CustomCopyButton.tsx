"use client"

import { Button } from "./ui/button";
import { ComponentProps, useState } from "react";
import { Copy, CopyCheck   } from "lucide-react"

type CopyStateProps = "idle" | "copied" | "error"

export function CustomCopyButton({ clerkUserId, EventId, ...buttonProps} : Omit<ComponentProps<typeof Button>, 'children' | 'onClick'> & {clerkUserId : string , EventId : string}) {
  
  const [copyState, setCopyState] = useState<CopyStateProps>("idle")

    const CopyIcon = getCopyState(copyState)
  
    return (
      <Button
        className="bg-secondary text-black"
        {...buttonProps}
        onClick={() =>
          navigator.clipboard
            .writeText(`${location.origin}/book/${clerkUserId}/${EventId}`)
            .then(() => setCopyState("copied"))
            .catch(() => setCopyState("error"))
            .finally(() => {
              setTimeout(() => {
                setCopyState("idle");
              }, 2000);
            })
        }
      >
        <CopyIcon className="size-5 mr-2"/>
        {getChildren(copyState)}
      </Button>
    );
}

const getCopyState = (state : CopyStateProps) => {
  switch (state) {
    case "idle":
      return Copy;
    case "copied":
      return CopyCheck;
    case "error":
      return Copy;
  }
};

function getChildren(copyState: CopyStateProps) {
  switch (copyState) {
    case "idle":
      return "Copy Link"
    case "copied":
      return "Copied!"
    case "error":
      return "Error"
  }
}

