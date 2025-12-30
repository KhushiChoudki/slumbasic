import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Plus, MapPin, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { queryClient } from "@/lib/queryClient";
import type { Project } from "@shared/schema";
import { format } from "date-fns";

export default function Projects() {
  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading prototype...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-12">
          <div>
            <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-2" data-testid="text-projects-title">
              Road Planning Prototype
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore community infrastructure prototype
            </p>
          </div>
          <Link href="/projects/new">
            <Button size="lg" className="shadow-lg" data-testid="button-new-project">
              <Plus className="h-5 w-5 mr-2" />
              New Prototype
            </Button>
          </Link>
        </div>

        {!projects || projects.length === 0 ? (
          <Card className="p-12 text-center">
            <CardContent>
              <p className="text-xl text-muted-foreground mb-4">No prototype yet</p>
              <Link href="/projects/new">
                <Button data-testid="button-create-first">
                  Create your first prototype
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card 
                  className="h-full hover-elevate active-elevate-2 transition-all duration-300 cursor-pointer group"
                  data-testid={`card-project-${project.id}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {project.title}
                      </CardTitle>
                      <Badge 
                        variant={project.status === "completed" ? "default" : "secondary"}
                        data-testid={`badge-status-${project.id}`}
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {project.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {project.description}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      {format(new Date(project.createdAt), "MMM d, yyyy")}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
