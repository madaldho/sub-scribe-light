import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { useUniqueCategories } from "@/hooks/useUniqueCategories";
import { cn } from "@/lib/utils";

interface CategoryAutocompleteProps {
  id: string;
  name: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
  required?: boolean;
}

export function CategoryAutocomplete({
  id,
  name,
  placeholder = "contoh: Entertainment, Development",
  defaultValue = "lainnya",
  value,
  onChange,
  className,
  required
}: CategoryAutocompleteProps) {
  const [inputValue, setInputValue] = useState(value || defaultValue);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { data: categories = [] } = useUniqueCategories();
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Filter categories based on input
  const filteredCategories = categories.filter(cat =>
    cat.toLowerCase().includes(inputValue.toLowerCase())
  );

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange?.(newValue);
    setShowSuggestions(true);
  };

  const handleSelectCategory = (category: string) => {
    setInputValue(category);
    onChange?.(category);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative">
      <Input
        ref={inputRef}
        id={id}
        name={name}
        value={inputValue}
        onChange={handleInputChange}
        onFocus={() => setShowSuggestions(true)}
        placeholder={placeholder}
        className={className}
        required={required}
        autoComplete="off"
      />
      
      {showSuggestions && filteredCategories.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-48 overflow-y-auto"
        >
          {filteredCategories.map((category, index) => (
            <button
              key={index}
              type="button"
              onClick={() => handleSelectCategory(category)}
              className={cn(
                "w-full px-4 py-2 text-left text-sm hover:bg-accent hover:text-accent-foreground transition-colors",
                "first:rounded-t-lg last:rounded-b-lg"
              )}
            >
              {category}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
