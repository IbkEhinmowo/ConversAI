// Select.jsx
import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Selector({ onSelect }) {

  const handleChange = (value) => {
    onSelect(value);
   
  };

  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Model" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="phi3.5">phi 3.5</SelectItem>
        <SelectItem value="llama3.2">Llama-3.2 3b</SelectItem>
        <SelectItem value="qwen2.5:3b">qwen 2.5 3b</SelectItem>
      </SelectContent>
    </Select>
  );
}