"use client";
import { useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";

export function AddressAutocomplete({ value, onSelect }: { value: string; onSelect: (data: any) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!window.google) {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY&libraries=places`;
      script.async = true;
      script.onload = () => initAutocomplete();
      document.body.appendChild(script);
    } else {
      initAutocomplete();
    }
    function initAutocomplete() {
      if (!inputRef.current || !window.google) return;
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ["geocode"],
        componentRestrictions: { country: "vn" },
      });
      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (!place.address_components) return;
        // Parse các trường từ Google
        const get = (type: string) => {
          const comp = place.address_components.find((c: any) => c.types.includes(type));
          return comp ? comp.long_name : "";
        };
        onSelect({
          addressLine1: place.name || place.formatted_address,
          ward: get("administrative_area_level_3"),
          district: get("administrative_area_level_2"),
          province: get("administrative_area_level_1"),
          country: get("country"),
          lat: place.geometry?.location?.lat(),
          lng: place.geometry?.location?.lng(),
        });
      });
    }
  }, []);

  return (
    <Input
      ref={inputRef}
      placeholder="Nhập địa chỉ và chọn từ Google Maps"
      defaultValue={value}
      autoComplete="off"
    />
  );
}
