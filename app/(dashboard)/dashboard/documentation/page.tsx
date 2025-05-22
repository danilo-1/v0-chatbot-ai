"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function DocumentationPage() {
  const [activeTab, setActiveTab] = useState("knowledge-bases")

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center space-x-2">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">ChatbotAI Documentation</h1>
      </div>

      <Tabs defaultValue="knowledge-bases" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="knowledge-bases">Knowledge Bases</TabsTrigger>
          <TabsTrigger value="responses">Optimizing Responses</TabsTrigger>
          <TabsTrigger value="integration">Website Integration</TabsTrigger>
          <TabsTrigger value="best-practices">Best Practices</TabsTrigger>
        </TabsList>

        <TabsContent value="knowledge-bases" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>How to Write Effective Knowledge Bases</CardTitle>
              <CardDescription>Create comprehensive knowledge bases for your chatbot</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-medium">What is a Knowledge Base?</h3>
              <p>
                A knowledge base is a collection of information that your chatbot can reference when answering
                questions. Think of it as your chatbot's memory or database of facts. The more comprehensive and
                well-structured your knowledge base is, the more accurate and helpful your chatbot's responses will be.
              </p>

              <h3 className="text-xl font-medium mt-6">Best Practices for Knowledge Bases</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">1. Be Clear and Concise</h4>
                  <p>
                    Write in simple, straightforward language. Avoid jargon unless it's necessary for your specific
                    audience. Break complex concepts into smaller, digestible pieces of information.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">2. Structure Information Logically</h4>
                  <p>
                    Organize your knowledge base into categories and subcategories. Use headings, subheadings, and
                    bullet points to make information easy to scan and understand.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">3. Include Common Questions and Variations</h4>
                  <p>
                    Anticipate the different ways users might ask for the same information. Include variations of
                    questions and their answers to improve your chatbot's ability to match user queries with the right
                    information.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">4. Keep Information Up-to-Date</h4>
                  <p>
                    Regularly review and update your knowledge base to ensure the information remains accurate. Outdated
                    information can lead to incorrect responses and frustrated users.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">5. Use Examples</h4>
                  <p>
                    Include practical examples to illustrate concepts. Examples help users understand how to apply the
                    information in real-world situations.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium mt-6">Knowledge Base Template</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">
                  <code>{`# [Topic Title]

## Overview
Brief explanation of what this topic covers.

## Key Points
- Important point 1
- Important point 2
- Important point 3

## Common Questions
Q: [Common question 1]?
A: [Clear, concise answer]

Q: [Common question 2]?
A: [Clear, concise answer]

## Examples
1. [Example scenario 1]
2. [Example scenario 2]

## Related Topics
- [Link to related topic 1]
- [Link to related topic 2]`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="responses" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Optimizing Chatbot Responses</CardTitle>
              <CardDescription>Techniques to improve your chatbot's answers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-medium">Creating Natural Responses</h3>
              <p>
                The quality of your chatbot's responses greatly impacts user satisfaction. Well-crafted responses feel
                natural, helpful, and personalized, while poor responses can frustrate users and diminish trust in your
                chatbot.
              </p>

              <h3 className="text-xl font-medium mt-6">Response Optimization Techniques</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">1. Use a Conversational Tone</h4>
                  <p>
                    Write responses in a natural, conversational style that matches your brand voice. Avoid overly
                    formal or robotic language unless it aligns with your brand identity.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">2. Keep Responses Concise</h4>
                  <p>
                    Provide direct answers to questions without unnecessary information. For complex topics, start with
                    a brief answer followed by more detailed information if needed.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">3. Personalize When Possible</h4>
                  <p>
                    Use available user information to personalize responses. Simple touches like including the user's
                    name can make interactions feel more human.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">4. Implement Progressive Disclosure</h4>
                  <p>
                    For complex information, use a progressive disclosure approach. Provide basic information first,
                    then offer to provide more details if the user is interested.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">5. Include Clear Next Steps</h4>
                  <p>
                    When appropriate, guide users on what to do next. This could be suggesting related topics, providing
                    links to more information, or offering to help with a related task.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium mt-6">Response Templates</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">
                  <code>{`# Answering a Question
"[Brief direct answer]. [Additional context or details]. [Optional: Would you like to know more about X?]"

# Handling Uncertainty
"I'm not entirely sure about [topic], but [provide what information you do have]. [Suggest where they might find more information]."

# Offering Help
"I can help you with [list of relevant topics]. What specifically would you like to know about?"

# Providing Options
"There are a few ways to approach this:
1. [Option 1] - [Brief explanation]
2. [Option 2] - [Brief explanation]
3. [Option 3] - [Brief explanation]
Which would you like me to explain further?"`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integration" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Integrating with Your Website</CardTitle>
              <CardDescription>Methods to add your chatbot to your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-medium">Integration Options</h3>
              <p>
                ChatbotAI offers multiple ways to integrate your chatbot with your website, from simple embed codes to
                advanced API integrations. Choose the method that best fits your technical requirements and user
                experience goals.
              </p>

              <h3 className="text-xl font-medium mt-6">Integration Methods</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">1. Embed Widget (Recommended)</h4>
                  <p>
                    The simplest way to add your chatbot to your website. Just copy and paste a small code snippet into
                    your website's HTML, and the chatbot will appear as a floating button that expands into a chat
                    window.
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2">
                    <pre className="whitespace-pre-wrap">
                      <code>{`<script src="https://v0-chatbot-ai-kf.vercel.app/api/widget/YOUR_CHATBOT_ID" async></script>`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium">2. Inline Embed</h4>
                  <p>
                    Embed the chatbot directly within a specific section of your webpage, rather than as a floating
                    widget. This is useful for dedicated support pages or when you want the chatbot to be a central
                    feature.
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2">
                    <pre className="whitespace-pre-wrap">
                      <code>{`<div id="chatbot-container" style="width: 100%; height: 500px;"></div>
<script>
  (function() {
    var script = document.createElement('script');
    script.src = "https://v0-chatbot-ai-kf.vercel.app/api/widget/YOUR_CHATBOT_ID";
    script.async = true;
    script.dataset.container = "chatbot-container";
    document.body.appendChild(script);
  })();
</script>`}</code>
                    </pre>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-medium">3. API Integration</h4>
                  <p>
                    For complete control over the chatbot's appearance and behavior, use our API to build a custom
                    integration. This requires more technical expertise but offers maximum flexibility.
                  </p>
                  <div className="bg-muted p-4 rounded-md mt-2">
                    <pre className="whitespace-pre-wrap">
                      <code>{`// Example API request
async function sendMessage(message) {
  const response = await fetch('https://v0-chatbot-ai-kf.vercel.app/api/v1/chatbots/YOUR_CHATBOT_ID/chat', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
      message: message,
      userId: 'optional-user-identifier'
    })
  });
  
  return await response.json();
}`}</code>
                    </pre>
                  </div>
                </div>
              </div>

              <h3 className="text-xl font-medium mt-6">Customization Options</h3>
              <p>
                You can customize the appearance and behavior of your chatbot widget by adding data attributes to the
                script tag:
              </p>
              <div className="bg-muted p-4 rounded-md mt-2">
                <pre className="whitespace-pre-wrap">
                  <code>{`<script 
  src="https://v0-chatbot-ai-kf.vercel.app/api/widget/YOUR_CHATBOT_ID" 
  data-theme="dark"
  data-position="bottom-left"
  data-initial-message="How can I help you today?"
  data-button-text="Chat with us"
  data-primary-color="#7c3aed"
  async></script>`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="best-practices" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Best Practices for AI Chatbots</CardTitle>
              <CardDescription>Guidelines for creating effective AI chatbots</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <h3 className="text-xl font-medium">Creating an Effective Chatbot Experience</h3>
              <p>
                Building an effective AI chatbot involves more than just technical implementation. It requires careful
                planning, thoughtful design, and ongoing optimization to ensure it meets user needs and business goals.
              </p>

              <h3 className="text-xl font-medium mt-6">Key Best Practices</h3>

              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">1. Set Clear Expectations</h4>
                  <p>
                    Clearly communicate what your chatbot can and cannot do. Setting realistic expectations helps
                    prevent user frustration and builds trust. Consider adding an introduction message that explains the
                    chatbot's capabilities.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">2. Design Conversation Flows</h4>
                  <p>
                    Map out common user journeys and design conversation flows that guide users toward their goals.
                    Anticipate different paths users might take and prepare appropriate responses for each scenario.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">3. Handle Edge Cases Gracefully</h4>
                  <p>
                    Prepare for situations where your chatbot might not understand a user's request or cannot provide
                    the requested information. Create helpful fallback responses and consider offering alternative ways
                    to get help, such as contacting human support.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">4. Continuously Monitor and Improve</h4>
                  <p>
                    Regularly review chatbot conversations to identify areas for improvement. Look for patterns in user
                    queries that your chatbot struggles with and update your knowledge base or conversation flows
                    accordingly.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">5. Balance Automation with Human Touch</h4>
                  <p>
                    While automation is valuable, maintain a human touch in your chatbot's responses. Use natural
                    language, show empathy where appropriate, and provide an easy way for users to reach human support
                    when needed.
                  </p>
                </div>

                <div>
                  <h4 className="text-lg font-medium">6. Respect User Privacy</h4>
                  <p>
                    Be transparent about what data your chatbot collects and how it's used. Only ask for information
                    that's necessary to provide assistance, and ensure you comply with relevant privacy regulations.
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-medium mt-6">Chatbot Evaluation Checklist</h3>
              <div className="bg-muted p-4 rounded-md">
                <pre className="whitespace-pre-wrap">
                  <code>{`# Chatbot Evaluation Checklist

## Functionality
- [ ] Accurately understands common user queries
- [ ] Provides helpful and accurate responses
- [ ] Handles edge cases gracefully
- [ ] Offers clear paths to human support when needed

## User Experience
- [ ] Introduces itself and its capabilities clearly
- [ ] Uses conversational, natural language
- [ ] Responds in a timely manner
- [ ] Maintains context throughout conversations
- [ ] Provides clear next steps or follow-up options

## Technical Performance
- [ ] Loads quickly on various devices and browsers
- [ ] Functions reliably without errors or downtime
- [ ] Integrates smoothly with existing systems
- [ ] Scales to handle expected user volume

## Business Alignment
- [ ] Addresses key user needs and pain points
- [ ] Aligns with business goals and objectives
- [ ] Provides measurable value (e.g., reduced support tickets)
- [ ] Represents brand voice and values appropriately`}</code>
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-between items-center">
        <Button variant="outline" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  )
}
