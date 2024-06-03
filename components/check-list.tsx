"use client";

import { InitialChecks } from "@/app/(tabs)/checks/page";
import ListCheck from "./list-check";
import { useEffect, useRef, useState } from "react";
import { getMoreChecks } from "@/app/(tabs)/checks/actions";

interface CheckListProps {
  initialChecks: InitialChecks;
}

export default function CheckList({ initialChecks }: CheckListProps) {
  const [checks, setChecks] = useState(initialChecks);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(false);
  const trigger = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      async (
        entries: IntersectionObserverEntry[],
        observer: IntersectionObserver
      ) => {
        const element = entries[0];
        if (element.isIntersecting && trigger.current) {
          observer.unobserve(trigger.current);
          setIsLoading(true);
          const newChecks = await getMoreChecks(page + 1);

          if (newChecks.length !== 0) {
            setPage((prev) => prev + 1);
            setChecks((prev) => [...prev, ...newChecks]);
          } else {
            setIsLastPage(true);
          }
          setIsLoading(false);
        }
        // console.log(entries[0].isIntersecting);
      },
      {
        threshold: 1.0,
        rootMargin: "0px 0px -100px 0px",
      }
    );

    if (trigger.current) {
      observer.observe(trigger.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [page]);

  return (
    <div className="p-5 flex flex-col gap-5">
      {checks.map((check) => (
        <ListCheck key={check.id} {...check} />
      ))}
      {!isLastPage && (
        <span
          ref={trigger}
          className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95"
        >
          {isLoading ? "Loading..." : "Load more"}
        </span>
      )}
    </div>
  );
}
