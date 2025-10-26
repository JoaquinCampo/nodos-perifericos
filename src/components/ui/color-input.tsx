"use client";

import * as React from "react";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export interface ColorInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  value?: string;
  onValueChange?: (value: string) => void;
}

const ColorInput = React.forwardRef<HTMLInputElement, ColorInputProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const [colorValue, setColorValue] = React.useState(value ?? "#000000");

    React.useEffect(() => {
      if (value) {
        setColorValue(value);
      }
    }, [value]);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setColorValue(newValue);
      onValueChange?.(newValue);
      onChange?.(e);
    };

    const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setColorValue(newValue);
      onValueChange?.(newValue);
      onChange?.(e);
    };

    return (
      <div className="flex gap-2">
        <div className="relative">
          <input
            type="color"
            value={colorValue}
            onChange={handleColorChange}
            className={cn(
              "border-input h-10 w-14 cursor-pointer rounded-md border",
              className,
            )}
            ref={ref}
            {...props}
          />
        </div>
        <Input
          type="text"
          value={colorValue}
          onChange={handleTextChange}
          placeholder="#000000"
          className="flex-1 font-mono uppercase"
          maxLength={7}
        />
      </div>
    );
  },
);

ColorInput.displayName = "ColorInput";

export { ColorInput };
