"use client";
import { useState, useRef } from "react";

interface OSMPlace {
  display_name: string;
  lat: string;
  lon: string;
  address: Record<string, string>;
}

interface OSMAutocompleteProps {
  value: string;
  onChange: (value: string, place?: OSMPlace) => void;
  placeholder?: string;
}

export function OSMAutocomplete({
  value,
  onChange,
  placeholder,
}: OSMAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<OSMPlace[]>([]);
  const [show, setShow] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInput = (val: string) => {
    onChange(val);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (!val) {
      setSuggestions([]);
      setShow(false);
      return;
    }
    timeoutRef.current = setTimeout(async () => {
      const res = await fetch(`/api/osm-search?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      setSuggestions(data);
      setShow(true);
    }, 300);
  };

  const handleSelect = (place: OSMPlace) => {
    onChange(place.display_name, place);
    setSuggestions([]);
    setShow(false);
  };

  return (
    <div className="relative">
      <input
        className="input input-bordered w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => handleInput(e.target.value)}
        type="text"
        autoComplete="off"
        onFocus={() => value && suggestions.length > 0 && setShow(true)}
        onBlur={() => setTimeout(() => setShow(false), 200)}
      />
      {show && suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white border w-full mt-1 rounded shadow">
          {suggestions.map((s, i) => (
            <li
              key={i}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelect(s)}
            >
              {s.display_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
