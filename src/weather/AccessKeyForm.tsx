import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useValidateApiKey } from "@/lib/openweathermap.queries";
import React from "react";

function AccessKeyForm({
  accessKey,
  setAccessKey,
  setIsKeyValid,
}: {
  accessKey: string;
  setAccessKey: (key: string) => void;
  setIsKeyValid: (valid: boolean) => void;
}) {
  const {
    refetch: validateKey,
    isFetching: isValidating,
    isError,
    error,
  } = useValidateApiKey(accessKey);
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!accessKey || isValidating) return;
    try {
      const result = await validateKey();
      setIsKeyValid(result.data === true);
    } catch {
      setIsKeyValid(false);
    }
  }
  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <form className="space-y-3" onSubmit={handleSubmit}>
        <h2 className="text-lg font-semibold">
          Please provide the OpenWeatherMap API key
        </h2>
        <Input
          autoFocus
          placeholder="OpenWeatherMap access key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
        />
        {isError && (
          <span className="text-sm text-red-600">
            {(error as Error)?.message || "Invalid API key"}
          </span>
        )}
        <Button type="submit" disabled={!accessKey || isValidating}>
          {isValidating ? "Validating..." : "Proceed"}
        </Button>
      </form>
    </Card>
  );
}

export default AccessKeyForm;
