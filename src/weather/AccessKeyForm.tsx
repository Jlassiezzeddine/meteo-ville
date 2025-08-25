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
  return (
    <Card className="w-full max-w-md p-6 shadow-lg">
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Please provide the OpenWeatherMap API key
        </h2>
        <Input
          placeholder="OpenWeatherMap access key"
          value={accessKey}
          onChange={(e) => setAccessKey(e.target.value)}
        />
        {isError && (
          <span className="text-sm text-red-600">
            {(error as Error)?.message || "Invalid API key"}
          </span>
        )}
        <Button
          disabled={!accessKey || isValidating}
          onClick={async () => {
            try {
              const result = await validateKey();
              setIsKeyValid(result.data === true);
            } catch {
              setIsKeyValid(false);
            }
          }}
        >
          {isValidating ? "Validating..." : "Proceed"}
        </Button>
      </div>
    </Card>
  );
}

export default AccessKeyForm;
