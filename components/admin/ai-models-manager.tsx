"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Plus, Pencil, Trash2, Check, X } from "lucide-react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"

// Define the model schema
const modelSchema = z.object({
  id: z.string().min(1, "ID is required"),
  name: z.string().min(1, "Name is required"),
  provider: z.string().min(1, "Provider is required"),
  modelId: z.string().min(1, "Model ID is required"),
  maxTokens: z.coerce.number().int().min(1, "Max tokens must be at least 1"),
  isActive: z.boolean().default(true),
  isDefault: z.boolean().default(false),
})

type AIModel = z.infer<typeof modelSchema>

export function AIModelsManager() {
  const [models, setModels] = useState<AIModel[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentModel, setCurrentModel] = useState<AIModel | null>(null)
  const [deleteModelId, setDeleteModelId] = useState<string | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<AIModel>({
    resolver: zodResolver(modelSchema),
    defaultValues: {
      id: "",
      name: "",
      provider: "openai",
      modelId: "",
      maxTokens: 4096,
      isActive: true,
      isDefault: false,
    },
  })

  // Fetch models on component mount
  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/ai-models")
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(data)
    } catch (error) {
      console.error("Error fetching models:", error)
      toast({
        title: "Error",
        description: "Failed to fetch AI models",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddModel = () => {
    setIsEditing(false)
    setCurrentModel(null)
    form.reset({
      id: "",
      name: "",
      provider: "openai",
      modelId: "",
      maxTokens: 4096,
      isActive: true,
      isDefault: false,
    })
    setIsDialogOpen(true)
  }

  const handleEditModel = (model: AIModel) => {
    setIsEditing(true)
    setCurrentModel(model)
    form.reset({
      id: model.id,
      name: model.name,
      provider: model.provider,
      modelId: model.modelId,
      maxTokens: model.maxTokens,
      isActive: model.isActive,
      isDefault: model.isDefault,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteModel = (id: string) => {
    setDeleteModelId(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteModel = async () => {
    if (!deleteModelId) return

    try {
      const response = await fetch(`/api/admin/ai-models?id=${deleteModelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to delete model")
      }

      toast({
        title: "Success",
        description: "AI model deleted successfully",
      })

      // Refresh the models list
      fetchModels()
    } catch (error: any) {
      console.error("Error deleting model:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to delete AI model",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeleteModelId(null)
    }
  }

  const onSubmit = async (data: AIModel) => {
    try {
      const method = isEditing ? "PUT" : "POST"
      const response = await fetch("/api/admin/ai-models", {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Failed to ${isEditing ? "update" : "create"} model`)
      }

      toast({
        title: "Success",
        description: `AI model ${isEditing ? "updated" : "created"} successfully`,
      })

      // Close the dialog and refresh the models list
      setIsDialogOpen(false)
      fetchModels()
    } catch (error: any) {
      console.error(`Error ${isEditing ? "updating" : "creating"} model:`, error)
      toast({
        title: "Error",
        description: error.message || `Failed to ${isEditing ? "update" : "create"} AI model`,
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      // Find the model
      const model = models.find((m) => m.id === id)
      if (!model) return

      // Update the model to be default
      const response = await fetch("/api/admin/ai-models", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...model,
          isDefault: true,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to set default model")
      }

      toast({
        title: "Success",
        description: "Default AI model updated successfully",
      })

      // Refresh the models list
      fetchModels()
    } catch (error: any) {
      console.error("Error setting default model:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to set default model",
        variant: "destructive",
      })
    }
  }

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      // Find the model
      const model = models.find((m) => m.id === id)
      if (!model) return

      // Update the model's active status
      const response = await fetch("/api/admin/ai-models", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...model,
          isActive: !currentActive,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Failed to update model status")
      }

      toast({
        title: "Success",
        description: `Model ${!currentActive ? "activated" : "deactivated"} successfully`,
      })

      // Refresh the models list
      fetchModels()
    } catch (error: any) {
      console.error("Error toggling model status:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to update model status",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Models</CardTitle>
        <CardDescription>Manage the AI models available for chatbots</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <div className="mb-4 flex justify-end">
              <Button onClick={handleAddModel}>
                <Plus className="mr-2 h-4 w-4" /> Add Model
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Model ID</TableHead>
                  <TableHead>Max Tokens</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                      No AI models found
                    </TableCell>
                  </TableRow>
                ) : (
                  models.map((model) => (
                    <TableRow key={model.id}>
                      <TableCell>{model.name}</TableCell>
                      <TableCell>{model.provider}</TableCell>
                      <TableCell>{model.modelId}</TableCell>
                      <TableCell>{model.maxTokens}</TableCell>
                      <TableCell>
                        <Badge variant={model.isActive ? "success" : "secondary"}>
                          {model.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {model.isDefault ? (
                          <Badge variant="default">Default</Badge>
                        ) : (
                          <Button variant="outline" size="sm" onClick={() => handleSetDefault(model.id)}>
                            Set Default
                          </Button>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="ghost" size="icon" onClick={() => handleEditModel(model)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleToggleActive(model.id, model.isActive)}
                          >
                            {model.isActive ? <X className="h-4 w-4" /> : <Check className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteModel(model.id)}
                            disabled={model.isDefault}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>

      {/* Model Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit AI Model" : "Add AI Model"}</DialogTitle>
            <DialogDescription>
              {isEditing ? "Update the details of this AI model" : "Add a new AI model to the system"}
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., gpt-4o" disabled={isEditing} />
                    </FormControl>
                    <FormDescription>Unique identifier for the model</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., GPT-4o" />
                    </FormControl>
                    <FormDescription>Display name for the model</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="provider"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Provider</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., openai" />
                    </FormControl>
                    <FormDescription>The AI provider (e.g., openai, anthropic)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="modelId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Model ID</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., gpt-4o" />
                    </FormControl>
                    <FormDescription>The actual ID used when calling the API</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="maxTokens"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Tokens</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" min="1" />
                    </FormControl>
                    <FormDescription>Maximum tokens the model can process</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Active</FormLabel>
                      <FormDescription>Whether this model is available for use</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isDefault"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                    <div className="space-y-0.5">
                      <FormLabel>Default</FormLabel>
                      <FormDescription>Set as the default model for new chatbots</FormDescription>
                    </div>
                    <FormControl>
                      <Switch checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">{isEditing ? "Update Model" : "Add Model"}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the AI model.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteModel}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
