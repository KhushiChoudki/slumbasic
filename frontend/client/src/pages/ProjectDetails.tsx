import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, MapPin, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { Project, Report } from "@shared/schema";
import { format } from "date-fns";

export default function ProjectDetails() {
  const { id } = useParams();
  const [, navigate] = useLocation();
  const { toast } = useToast();

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", id],
    enabled: !!id,
  });

  const { data: reports } = useQuery<Report[]>({
    queryKey: ["/api/reports", { projectId: id }],
    enabled: !!id,
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/projects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      toast({
        title: "Success!",
        description: "Project deleted successfully",
      });
      navigate("/projects");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-4 text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="p-8 text-center">
          <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-xl text-muted-foreground">Project not found</p>
          <Button onClick={() => navigate("/projects")} className="mt-4">
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <Card className="mb-8">
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <CardTitle className="text-3xl font-display" data-testid="text-project-title">
                    {project.title}
                  </CardTitle>
                  <Badge variant={project.status === "completed" ? "default" : "secondary"}>
                    {project.status}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span data-testid="text-location">{project.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(project.createdAt), "MMMM d, yyyy")}</span>
                  </div>
                </div>
              </div>
              <Button
                variant="destructive"
                onClick={() => {
                  if (confirm("Are you sure you want to delete this project?")) {
                    deleteMutation.mutate();
                  }
                }}
                disabled={deleteMutation.isPending}
                data-testid="button-delete"
              >
                {deleteMutation.isPending ? "Deleting..." : "Delete Project"}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {project.imageUrl && (
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
                data-testid="img-project"
              />
            )}
            <p className="text-lg leading-relaxed" data-testid="text-description">
              {project.description}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Community Reports</CardTitle>
          </CardHeader>
          <CardContent>
            {!reports || reports.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                No reports for this project yet
              </p>
            ) : (
              <div className="space-y-4">
                {reports.map((report) => (
                  <Card key={report.id} className="p-4" data-testid={`card-report-${report.id}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{report.title}</h4>
                          <Badge variant="outline">{report.issueType}</Badge>
                          <Badge 
                            variant={report.status === "verified" ? "default" : "secondary"}
                          >
                            {report.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {report.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(report.createdAt), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
