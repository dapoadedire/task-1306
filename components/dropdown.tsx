import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";

interface SelectOption {
  value: string;
  label: string;
}

const AccessibleDropdown: React.FC = () => {
  const [selectOpen, setSelectOpen] = useState<boolean>(false);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [selectedLabel, setSelectedLabel] = useState<string>(
    "Select your crypto asset"
  );
  const [activeIndex, setActiveIndex] = useState<number>(-1);

  const selectRef = useRef<HTMLDivElement>(null);
  const selectButtonRef = useRef<HTMLButtonElement>(null);

  const selectOptions: SelectOption[] = [
    { value: "bitcoin", label: "Bitcoin (BTC)" },
    { value: "ethereum", label: "Ethereum (ETH)" },
    { value: "solana", label: "Solana (SOL)" },
    { value: "cardano", label: "Cardano (ADA)" },
    { value: "polygon", label: "Polygon (MATIC)" },
  ];

  // Handle clicks outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setSelectOpen(false);
        setActiveIndex(-1);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    switch (e.key) {
      case "Escape":
        setSelectOpen(false);
        setActiveIndex(-1);
        selectButtonRef.current?.focus();
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!selectOpen) {
          setSelectOpen(true);
          setActiveIndex(0);
        } else {
          setActiveIndex((prev) =>
            prev < selectOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (!selectOpen) {
          setSelectOpen(true);
          setActiveIndex(selectOptions.length - 1);
        } else {
          setActiveIndex((prev) =>
            prev > 0 ? prev - 1 : selectOptions.length - 1
          );
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!selectOpen) {
          setSelectOpen(true);
          setActiveIndex(0);
        } else if (activeIndex >= 0) {
          handleSelectOption(selectOptions[activeIndex]);
        }
        break;
      case "Home":
        if (selectOpen) {
          e.preventDefault();
          setActiveIndex(0);
        }
        break;
      case "End":
        if (selectOpen) {
          e.preventDefault();
          setActiveIndex(selectOptions.length - 1);
        }
        break;
    }
  };

  const handleSelectOption = (option: SelectOption): void => {
    setSelectedValue(option.value);
    setSelectedLabel(option.label);
    setSelectOpen(false);
    setActiveIndex(-1);
    selectButtonRef.current?.focus();
  };

  const toggleSelect = (): void => {
    setSelectOpen(!selectOpen);
    setActiveIndex(selectOpen ? -1 : 0);
  };

  return (
    <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-xl mx-auto">
        <div className="grid gap-8">
          {/* Select Dropdown */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Cryptocurrency Selector
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select your preferred cryptocurrency from the available options.
            </p>

            <div className="relative inline-block w-auto" ref={selectRef}>
              <button
                ref={selectButtonRef}
                onClick={toggleSelect}
                onKeyDown={handleSelectKeyDown}
                className="w-full flex items-center justify-between px-4 py-2 bg-white border border-gray-300 rounded-lg hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                aria-expanded={selectOpen}
                aria-haspopup="listbox"
                aria-label="Select an option"
                aria-activedescendant={
                  activeIndex >= 0 ? `option-${activeIndex}` : undefined
                }
                role="combobox"
              >
                <span
                  className={selectedValue ? "text-gray-900" : "text-gray-500"}
                >
                  {selectedLabel}
                </span>
                <ChevronDown
                  className={` w-4 h-4 text-gray-400 transition-transform ${
                    selectOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {selectOpen && (
                <div
                  className="w-64 absolute left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10 max-h-60 overflow-auto"
                  role="listbox"
                  aria-label="Options"
                >
                  {selectOptions.map((option, index) => (
                    <button
                      key={option.value}
                      id={`option-${index}`}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left text-gray-700 hover:bg-blue-50 focus:outline-none focus:bg-blue-50 ${
                        activeIndex === index ? "bg-blue-50" : ""
                      } ${
                        selectedValue === option.value
                          ? "text-blue-600 bg-blue-50"
                          : ""
                      }`}
                      role="option"
                      aria-selected={selectedValue === option.value}
                      tabIndex={-1}
                    >
                      <span>{option.label}</span>
                      {selectedValue === option.value && (
                        <Check className="w-4 h-4 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selectedValue && (
              <div className="mt-4 p-3 bg-green-50 rounded-lg">
                <p className="text-sm text-green-700">
                  Selected: <strong>{selectedLabel}</strong>
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessibleDropdown;
