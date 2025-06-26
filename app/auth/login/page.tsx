import { Suspense } from "react";
import LoginForm from "./LoginForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

function LoginSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4">
      <Card className="w-full max-w-md shadow-xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
        <CardHeader className="space-y-1 pb-4">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Skeleton className="w-6 h-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-center">
            <Skeleton className="h-6 w-40 mx-auto" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-10 w-full mb-2" />
            <Skeleton className="h-6 w-32 mx-auto" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense fallback={<LoginSkeleton />}>
      <LoginForm />
    </Suspense>
  );
} 