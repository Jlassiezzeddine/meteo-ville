"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type ComboboxOption = {
  value: string;
  label: string;
  meta?: unknown;
};

type ComboboxProps = {
  value?: string;
  onValueChange?: (value: string, option?: ComboboxOption | null) => void;
  onInputChange?: (value: string) => void;
  inputValue?: string;
  options: ComboboxOption[];
  placeholder?: string;
  emptyText?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
};

export function Combobox({
  value,
  onValueChange,
  onInputChange,
  inputValue,
  options,
  placeholder = "Search...",
  emptyText = "No results",
  className,
  disabled,
  isLoading,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const selected = options.find((o) => o.value === value) || null;

  const handleSelect = (option: ComboboxOption) => {
    onValueChange?.(option.value, option);
    setOpen(false);
  };

  React.useEffect(() => {
    if (open) {
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  return (
    <div className={cn("relative", className)}>
      <Button
        type="button"
        variant="outline"
        role="combobox"
        aria-expanded={open}
        className="w-full justify-between"
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
      >
        <span className={cn(!selected && "text-muted-foreground")}>
          {selected ? selected.label : placeholder}
        </span>
        <svg
          viewBox="0 0 20 20"
          fill="currentColor"
          className="size-4 opacity-60"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.939l3.71-3.71a.75.75 0 111.06 1.061l-4.24 4.24a.75.75 0 01-1.06 0l-4.24-4.24a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </Button>

      {open && (
        <div className="bg-popover text-popover-foreground absolute z-50 mt-2 w-full rounded-md border shadow-md">
          <div className="p-2">
            <input
              ref={inputRef}
              className={cn(
                "w-full rounded-md border bg-transparent px-3 py-2 text-sm outline-none",
                "border-input focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
              )}
              placeholder={placeholder}
              value={inputValue}
              onChange={(e) => onInputChange?.(e.target.value)}
            />
          </div>
          <div className="max-h-64 overflow-auto py-1">
            {isLoading ? (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                Loading...
              </div>
            ) : options.length === 0 ? (
              <div className="text-muted-foreground px-3 py-2 text-sm">
                {emptyText}
              </div>
            ) : (
              options.map((opt) => (
                <button
                  key={opt.value}
                  className={cn(
                    "hover:bg-accent hover:text-accent-foreground flex w-full items-center justify-between px-3 py-2 text-left text-sm",
                    value === opt.value && "bg-accent/60",
                  )}
                  onClick={() => handleSelect(opt)}
                >
                  <span>{opt.label}</span>
                  {value === opt.value && (
                    <svg
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="size-4 opacity-80"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 5.29a1 1 0 010 1.414l-7.07 7.07a1 1 0 01-1.415 0L3.296 9.85a1 1 0 111.415-1.414l3.093 3.092 6.364-6.364a1 1 0 011.536.127z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setOpen(false)}
          aria-hidden
        />
      )}
    </div>
  );
}
