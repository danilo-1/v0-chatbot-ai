import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export function HelpResources() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Need Help?</CardTitle>
        <CardDescription>Resources to get the most out of your chatbot.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="list-disc pl-5 text-sm space-y-2">
          <li>How to write effective knowledge bases</li>
          <li>Optimizing chatbot responses</li>
          <li>Integrating with your website</li>
          <li>Best practices for AI chatbots</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/documentation">
          <Button variant="outline" className="w-full">
            View Documentation
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
