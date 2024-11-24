/** @format */

import { Moon, Sun, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";


export default function Header() {

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b transition-all duration-300 ease-in-out"
        style={{ transform: `translateY(${scrollY > 50 ? "0" : "-100%"})` }}
      >
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Brain className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold">Convers.AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Button>
              <Link to="/Chat">Start</Link>
            </Button>
          </div>
        </div>
      </header>
    </>
  );
}