import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { insertProjectSchema, type InsertProject } from "@shared/schema";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  imageUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.string().default("in_progress"),
});

export default function NewProject() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      location: "",
      description: "",
      imageUrl: "",
      status: "in_progress",
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertProject) => {
      const res = await apiRequest("POST", "/api/projects", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/projects"] });
      toast({
        title: "Success!",
        description: "Project created successfully",
      });
      navigate("/projects");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create project",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    const projectData: InsertProject = {
      title: data.title,
      location: data.location,
      description: data.description,
      imageUrl: data.imageUrl && data.imageUrl.length > 0 ? data.imageUrl : undefined,
      status: data.status || "in_progress",
    };
    createMutation.mutate(projectData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-muted/20 to-background py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate("/projects")}
          className="mb-6"
          data-testid="button-back"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Projects
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-display">Create New Project</CardTitle>
            <CardDescription>
              Start a new road planning project for your community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Project Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Dharavi Road Network" 
                          {...field}
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="e.g., Dharavi, Mumbai" 
                          {...field}
                          data-testid="input-location"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your road planning project..."
                          rows={5}
                          {...field}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide details about the project goals and scope
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="https://example.com/image.jpg" 
                          {...field}
                          data-testid="input-image-url"
                        />
                      </FormControl>
                      <FormDescription>
                        Add a satellite or aerial image of the area
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger data-testid="select-status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="in_progress">In Progress</SelectItem>
                          <SelectItem value="completed">Completed</SelectItem>
                          <SelectItem value="planning">Planning</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    disabled={createMutation.isPending}
                    className="flex-1"
                    data-testid="button-create"
                  >
                    {createMutation.isPending ? "Creating..." : "Create Project"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate("/projects")}
                    disabled={createMutation.isPending}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
