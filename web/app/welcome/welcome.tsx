import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "~/components/ui/card";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "~/components/ui/alert"

import { Info } from "lucide-react"

export function Welcome() {
  return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center space-y-8 px-4">
        {/* Header */}
        <header className="text-center prose">
          <h1>Welcome to Geo Intel</h1>
          <p>
            Store, manage, analyze and share geolocations.
          </p>
        </header>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl w-full">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Save Locations</CardTitle>
              <CardDescription>
                Securely store and access geolocation data.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your data is encrypted and available whenever you need it.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Organize Data</CardTitle>
              <CardDescription>
                Keep your geolocations structured and updated.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Retrieve extensive analytics and insights for free.
              </p>
            </CardContent>
          </Card>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Collaborate</CardTitle>
              <CardDescription>
                Share data securely with your team or publically
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Control access to ensure data privacy and security.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Invite-Only Section */}
        <div className="max-w-6xl w-full">
          <Alert variant="informative">
            <Info className="h-4 w-4" />
            <AlertTitle>Invite only</AlertTitle>
            <AlertDescription>
              Geo Intel is currently invite only.
            </AlertDescription>
          </Alert>
        </div>
        
      </div>
  );
}
