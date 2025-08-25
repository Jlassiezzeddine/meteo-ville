import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

function WeatherWidgetLoader() {
  return (
    <Card className="p-3">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="size-32" />
      <Skeleton className="size-28" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-24 w-full" />
    </Card>
  );
}

export default WeatherWidgetLoader;
