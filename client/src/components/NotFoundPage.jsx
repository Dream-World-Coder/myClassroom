import { Button } from "@/components/ui/button";
import { HomeIcon, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <div className="h-screen w-full flex flex-col items-center justify-center gap-6 p-4">
            {/* Large 404 Text */}
            <div className="text-9xl font-bold text-primary/20">404</div>

            {/* Error Messages */}
            <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold tracking-tight">
                    Page not found
                </h1>
                <p className="text-muted-foreground">
                    Oops! The page you&apos;re looking for seems to have gone on
                    vacation.
                </p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button
                    variant="outline"
                    onClick={() => window.history.back()}
                    className="gap-2"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Go Back
                </Button>
                <Button
                    onClick={() => (window.location.href = "/")}
                    className="gap-2"
                >
                    <HomeIcon className="h-4 w-4" />
                    Return Home
                </Button>
            </div>
        </div>
    );
}
