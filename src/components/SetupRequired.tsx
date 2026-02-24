import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, Database, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export const SetupRequired: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center gap-3 mb-2">
            <Database className="h-8 w-8 text-primary" />
            <CardTitle className="text-2xl">Database Setup Required</CardTitle>
          </div>
          <CardDescription>
            Your Supabase database needs to be configured before you can use the
            app
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              The app detected invalid or missing Supabase credentials. Please
              follow the steps below to get started.
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  1
                </span>
                Create a Supabase Project
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Go to{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline inline-flex items-center gap-1"
                >
                  supabase.com <ExternalLink className="h-3 w-3" />
                </a>{" "}
                and create a free account and project
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  2
                </span>
                Run the Database Schema
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                In Supabase Dashboard → SQL Editor, run the entire{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  supabase-schema.sql
                </code>{" "}
                file from the project root
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  3
                </span>
                Configure Environment Variables
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Copy{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  .env.example
                </code>{" "}
                to <code className="px-1 py-0.5 bg-muted rounded">.env</code>{" "}
                and add your credentials
              </p>
              <div className="ml-8 mt-2 p-3 bg-muted rounded-lg font-mono text-xs space-y-1">
                <div>VITE_SUPABASE_URL="https://your-project.supabase.co"</div>
                <div>VITE_SUPABASE_ANON_KEY="eyJ..."</div>
              </div>
              <p className="text-xs text-muted-foreground ml-8 mt-2">
                Find these in: Supabase Dashboard → Settings → API
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="font-semibold flex items-center gap-2">
                <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-sm">
                  4
                </span>
                Restart the Development Server
              </h3>
              <p className="text-sm text-muted-foreground ml-8">
                Stop the server (Ctrl+C) and run{" "}
                <code className="px-1 py-0.5 bg-muted rounded">
                  npm run dev
                </code>{" "}
                again
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button asChild className="flex-1">
              <a
                href="https://supabase.com/dashboard"
                target="_blank"
                rel="noopener noreferrer"
              >
                Go to Supabase Dashboard
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" className="flex-1">
              <a
                href="https://github.com/Scraayp/finance-tracker/blob/main/DATABASE_README.md"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Setup Guide
                <ExternalLink className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Note:</strong> After setting up Supabase, you'll also need
              to enable authentication providers (Email, Google, Discord) in
              your Supabase dashboard under Authentication → Providers.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
};
