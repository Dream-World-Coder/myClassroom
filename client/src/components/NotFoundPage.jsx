import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-6 p-4">
      {/* Large 404 Text */}
      <div className="text-9xl font-bold text-primary/20">404</div>

      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold tracking-tight">Page not found</h1>
        <p className="text-muted-foreground">
          Oops! The page you&apos;re looking for seems to have gone on vacation.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          variant="outline"
          onClick={() => window.history.back()}
          className="gap-2 hover:cursor-pointer hover:bg-lime-100 border border-lime-300"
        >
          <ArrowLeft className="h-4 w-4" />
          Go Back
        </Button>
        <Button
          onClick={() => navigate("/")}
          className="gap-2 hover:cursor-pointer bg-lime-400 hover:bg-lime-500 text-black"
        >
          <HomeIcon className="h-4 w-4" />
          Return Home
        </Button>
      </div>
    </div>
  );
}
