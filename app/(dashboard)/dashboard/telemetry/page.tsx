import { getServerSession } from "next-auth/next"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { TelemetryOverview } from "@/components/telemetry/telemetry-overview"
import { TelemetryChats } from "@/components/telemetry/telemetry-chats"
import { TelemetryUsers } from "@/components/telemetry/telemetry-users"
import { TelemetryPerformance } from "@/components/telemetry/telemetry-performance"

export const dynamic = "force-dynamic" // Disable caching for this page

export default async function TelemetryPage() {
  const session = await getServerSession(authOptions)

  // Get user ID from session
  const userId = session?.user?.id

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <p className="text-muted-foreground">Please log in to view telemetry data.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Telemetry & Analytics</h1>
        <p className="text-muted-foreground">Detailed analytics and performance metrics for your chatbots.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="chats">Chat Analytics</TabsTrigger>
          <TabsTrigger value="users">User Metrics</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <TelemetryOverview userId={userId} />
        </TabsContent>

        <TabsContent value="chats" className="space-y-4">
          <TelemetryChats userId={userId} />
        </TabsContent>

        <TabsContent value="users" className="space-y-4">
          <TelemetryUsers userId={userId} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <TelemetryPerformance userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
