import React from "react";
import { Search } from "lucide-react";
import "./SearchInput.css";

export default function SearchInput({ value, onChange, placeholder = "Search components…" }) {
  return (
    <div className="cf-search">
      <Search size={15} className="cf-search__icon" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="cf-search__input"
      />
    </div>
  );
}
