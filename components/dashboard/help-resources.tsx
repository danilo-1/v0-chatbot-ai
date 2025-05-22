import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText } from "lucide-react"

export function HelpResources() {
  return (
    <Card className="bg-black text-white border-gray-800">
      <CardHeader>
        <CardTitle className="text-2xl">Need Help?</CardTitle>
        <CardDescription className="text-gray-400">Resources to get the most out of your chatbot.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2 list-disc pl-5">
          <li>How to write effective knowledge bases</li>
          <li>Optimizing chatbot responses</li>
          <li>Integrating with your website</li>
          <li>Best practices for AI chatbots</li>
        </ul>
      </CardContent>
      <CardFooter>
        <Link href="/dashboard/documentation" passHref>
          <Button variant="outline" className="text-white border-gray-700 hover:bg-gray-800">
            <FileText className="mr-2 h-4 w-4" />
            View Documentation
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
