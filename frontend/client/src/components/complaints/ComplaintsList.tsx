import { useEffect, useState, useCallback } from 'react';
import { getComplaints, type Complaint } from '@/services/complaintsApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, ExternalLink, AlertCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintsListProps {
  area: string;
}

const PAGE_SIZE = 10;

/**
 * Format timestamp to friendly relative time
 * TODO: Adjust if backend uses different date format
 */
function formatTimestamp(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString; // Return as-is if invalid
    }
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return dateString;
  }
}

/**
 * Get badge variant based on status
 * TODO: Adjust status values if backend uses different naming
 */
function getStatusVariant(status: string): "default" | "secondary" | "destructive" | "outline" {
  const normalizedStatus = status.toLowerCase();
  
  if (normalizedStatus.includes('resolved') || normalizedStatus.includes('closed')) {
    return 'default';
  }
  if (normalizedStatus.includes('pending') || normalizedStatus.includes('open')) {
    return 'secondary';
  }
  if (normalizedStatus.includes('rejected') || normalizedStatus.includes('invalid')) {
    return 'destructive';
  }
  return 'outline';
}

/**
 * Skeleton loader for complaints
 */
function ComplaintSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="animate-pulse space-y-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="h-4 bg-muted rounded w-24" />
              <div className="h-3 bg-muted rounded w-32" />
            </div>
            <div className="h-6 w-20 bg-muted rounded" />
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-muted rounded w-full" />
            <div className="h-3 bg-muted rounded w-3/4" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ComplaintsList({ area }: ComplaintsListProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [total, setTotal] = useState(0);

  // Reset and fetch complaints when area changes
  useEffect(() => {
    const controller = new AbortController();

    async function fetchInitialComplaints() {
      try {
        setLoading(true);
        setError(null);
        setComplaints([]);
        setPage(1);

        const response = await getComplaints(area, 1, PAGE_SIZE, controller.signal);
        
        // TODO: Adjust these field mappings if backend response structure differs
        setComplaints(response.complaints);
        setTotal(response.total);
        setHasMore(response.complaints.length < response.total);
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchInitialComplaints();

    return () => {
      controller.abort();
    };
  }, [area]);

  // Load more complaints
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    const controller = new AbortController();

    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const response = await getComplaints(area, nextPage, PAGE_SIZE, controller.signal);
      
      setComplaints(prev => [...prev, ...response.complaints]);
      setPage(nextPage);
      setHasMore(complaints.length + response.complaints.length < response.total);
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setLoadingMore(false);
    }

    return () => {
      controller.abort();
    };
  }, [area, page, hasMore, loadingMore, complaints.length]);

  // Loading state
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Complaints</h3>
          <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
        </div>
        {Array.from({ length: 3 }).map((_, i) => (
          <ComplaintSkeleton key={i} />
        ))}
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Failed to Load Complaints
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">{error}</p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => window.location.reload()}
          >
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (complaints.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center space-y-2">
            <div className="text-4xl mb-4">📋</div>
            <p className="text-sm font-medium">No complaints found for {area}</p>
            <p className="text-xs text-muted-foreground">
              This area currently has no reported complaints.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          Complaints - {area}
        </h3>
        <span className="text-sm text-muted-foreground">
          Showing {complaints.length} of {total}
        </span>
      </div>

      <div className="space-y-3">
        {complaints.map((complaint) => (
          <Card key={complaint.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="space-y-3">
                {/* Header: ID, Status, Time */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-mono text-muted-foreground">
                        #{complaint.id}
                      </span>
                      <Badge variant={getStatusVariant(complaint.status)}>
                        {complaint.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {/* TODO: Adjust field name if backend uses 'createdAt', 'timestamp', etc */}
                      {formatTimestamp(complaint.created_at)}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <div className="text-sm">
                  <p className="line-clamp-3">{complaint.description}</p>
                </div>

                {/* Footer: Reporter and Attachment */}
                <div className="flex items-center justify-between gap-4 pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    {/* TODO: Adjust field name if backend uses 'reported_by', 'user', etc */}
                    Reported by: <span className="font-medium">{complaint.reporter}</span>
                  </div>
                  
                  {/* TODO: Adjust field name if backend uses 'attachment', 'image', 'photo_url' */}
                  {complaint.image_url && (
                    <Button
                      variant="ghost"
                      size="sm"
                      asChild
                      className="h-8"
                    >
                      <a
                        href={complaint.image_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1"
                      >
                        View Image
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button
            variant="outline"
            onClick={loadMore}
            disabled={loadingMore}
          >
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              `Load More (${total - complaints.length} remaining)`
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
