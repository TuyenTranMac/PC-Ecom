/// <reference types="@types/google.maps" />
"use client";
import { useRef, useEffect } from "react";

export interface GoogleAutocompleteProps {
  value: string;
  onChange: (value: string, place?: google.maps.places.PlaceResult) => void;
  placeholder?: string;
}

export function GoogleAutocomplete({
  value,
  onChange,
  placeholder,
}: GoogleAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google || !window.google.maps) return;
    const autocomplete = new window.google.maps.places.Autocomplete(
      inputRef.current!,
      {
        types: ["geocode"],
        componentRestrictions: { country: "vn" },
      }
    );
    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onChange(place.formatted_address || "", place);
    });
    // Cleanup
    return () => {
      window.google.maps.event.clearInstanceListeners(inputRef.current!);
    };
  }, [onChange]);

  return (
    <input
      ref={inputRef}
      className="input input-bordered w-full"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      type="text"
      autoComplete="off"
    />
  );
}
