import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Map, Route, Compass, MoveRight } from "lucide-react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-background to-muted">
      <Card className="w-full max-w-md border-none shadow-lg">
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Map className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent dark:text-white">
              Ambalay Maps
            </h1>
          </div>
          <div className="flex justify-center gap-2">
            <Badge variant="secondary" className="text-sm font-medium">
              Beta Release
            </Badge>
            <Badge variant="outline" className="text-sm font-medium">
              v1.1.0
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <p className="text-muted-foreground text-center text-lg leading-relaxed">
            Smart routing, distance matrices, and optimized paths for modern
            city mapping.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <Button
              size="lg"
              className="w-full gap-2 transition-all hover:gap-3 bg-[#034638] hover:bg-[#1c6e5c] dark:bg-inherit  text-white dark:border-white border-2"
              onClick={() => navigate("/dashboard")}
            >
              <Route className="w-5 h-5" />
              <span>Launch Dashboard</span>
              <MoveRight className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="w-full gap-2 border-primary/30 hover:border-primary/50"
            >
              <Compass className="w-5 h-5" />
              <span>Explore Features</span>
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            Start your journey with intelligent mapping
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
