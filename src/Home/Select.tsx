// Select.jsx
import React, { useEffect, useState} from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";




export default function Selector({ onSelect }) {
  const [name, setName] = useState([]);


  const handleChange = (value) => {
    onSelect(value);
   
  };
useEffect(() => { 
  const fetchData = async () => {
  try{
    const res = await fetch("http://localhost:11434/api/tags");
    const data = await res.json();
    const names = data.models.map((model) => {return model.name});
    console.log(names);
  setName(names);
  }
  catch(e){
    console.log(e);
  }
  }
  fetchData();

}, []);


  return (
    <Select onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Model"  />
      </SelectTrigger>
      <SelectContent>
        {name.map((name, index) => (
          <SelectItem key={index} value={name}>
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );  
}