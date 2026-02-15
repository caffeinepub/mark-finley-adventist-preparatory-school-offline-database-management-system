import { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const { login, loginStatus, loginError } = useInternetIdentity();
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setError(null);
    try {
      await login();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto w-32 h-32 mb-4">
            <img 
              src="/assets/generated/mfaps-logo-placeholder.dim_512x512.png" 
              alt="School Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold">Mark Finley Adventist Preparatory School</CardTitle>
          <CardDescription>Database Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {(loginError || error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {loginError?.message || error}
              </AlertDescription>
            </Alert>
          )}
          
          <Button 
            onClick={handleLogin}
            disabled={loginStatus === 'logging-in'}
            className="w-full h-12 text-lg"
            size="lg"
          >
            {loginStatus === 'logging-in' ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>

          <div className="text-center text-sm text-muted-foreground mt-6">
            <p>Atimatim Chairman</p>
            <p>P. O. Box 6486</p>
            <p>markfinleyaps@gmail.com</p>
            <p>Tel: 0244094882</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
