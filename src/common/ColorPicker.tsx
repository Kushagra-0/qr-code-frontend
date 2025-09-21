// components/SimpleColorPicker.tsx
import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";

interface SimpleColorPickerProps {
  color: string;
  onChange: (color: string) => void;
  size?: number
}

const ColorPicker: React.FC<SimpleColorPickerProps> = ({ color, onChange, size = 8 }) => {
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setShowPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block" ref={pickerRef}>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className={`w-${size} h-${size} rounded-full border border-gray-300 shadow-sm`}
        style={{ backgroundColor: color }}
      />
      {showPicker && (
        <div className="absolute right-0 z-50 mt-1 border-2 border-gray-200 rounded-lg shadow-[0_0_20px_rgba(100,100,100,0.5)]">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
