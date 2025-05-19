"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Loader2, Plus, Trash, Edit, Check } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
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

// Change the interface to match the AIModel table structure
interface AIModel {
  id: string
  name: string
  modelid: string
  provider: string
  isdefault: boolean
  isactive: boolean
  maxtokens: number
  createdat: string
  updatedat: string
}

// Rename the component to AIModelsManager
export function AIModelsManager() {
  const [models, setModels] = useState<AIModel[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [editingModel, setEditingModel] = useState<AIModel | null>(null)
  const [deleteModelId, setDeleteModelId] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    modelid: "",
    provider: "openai",
    isdefault: false,
    isactive: true,
    maxtokens: 4000,
  })

  useEffect(() => {
    fetchModels()
  }, [])

  const fetchModels = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/ai-models")
      if (!response.ok) {
        throw new Error("Failed to fetch models")
      }
      const data = await response.json()
      setModels(data)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch AI models. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? Number.parseInt(value) : value,
    }))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData((prev) => ({ ...prev, [name]: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const url = editingModel ? `/api/admin/ai-models/${editingModel.id}` : "/api/admin/ai-models"
      const method = editingModel ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error("Failed to save model")
      }

      toast({
        title: editingModel ? "Model updated" : "Model created",
        description: editingModel
          ? "The AI model has been updated successfully."
          : "A new AI model has been added successfully.",
      })

      // Reset form and refresh models
      resetForm()
      fetchModels()
      setDialogOpen(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save AI model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (model: AIModel) => {
    setEditingModel(model)
    setFormData({
      name: model.name,
      modelid: model.modelid,
      provider: model.provider,
      isdefault: model.isdefault,
      isactive: model.isactive,
      maxtokens: model.maxtokens,
    })
    setDialogOpen(true)
  }

  const handleDelete = async () => {
    if (!deleteModelId) return

    try {
      const response = await fetch(`/api/admin/ai-models/${deleteModelId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete model")
      }

      toast({
        title: "Model deleted",
        description: "The AI model has been deleted successfully.",
      })

      // Refresh models
      fetchModels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete AI model. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteModelId(null)
      setAlertDialogOpen(false)
    }
  }

  const confirmDelete = (id: string) => {
    setDeleteModelId(id)
    setAlertDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      modelid: "",
      provider: "openai",
      isdefault: false,
      isactive: true,
      maxtokens: 4000,
    })
    setEditingModel(null)
  }

  const handleToggleActive = async (id: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/admin/ai-models/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ isactive: !currentStatus }),
      })

      if (!response.ok) {
        throw new Error("Failed to update model status")
      }

      toast({
        title: "Model updated",
        description: `The model has been ${!currentStatus ? "activated" : "deactivated"}.`,
      })

      // Refresh models
      fetchModels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update model status. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/ai-models/${id}/set-default`, {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to set default model")
      }

      toast({
        title: "Default model updated",
        description: "The default AI model has been updated successfully.",
      })

      // Refresh models
      fetchModels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to set default model. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Add a function to initialize default models
  const initializeDefaultModels = async () => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/admin/init-ai-models", {
        method: "POST",
      })

      if (!response.ok) {
        throw new Error("Failed to initialize default models")
      }

      const data = await response.json()

      toast({
        title: "Default models initialized",
        description: data.message,
      })

      // Refresh models
      fetchModels()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to initialize default models. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>AI Models</CardTitle>
          <CardDescription>Manage the available AI models for chatbots.</CardDescription>
        </div>
        <div className="flex gap-2">
          {models.length === 0 && (
            <Button onClick={initializeDefaultModels} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Initialize Default Models
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Model
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingModel ? "Edit AI Model" : "Add AI Model"}</DialogTitle>
                <DialogDescription>
                  {editingModel ? "Update the details of this AI model." : "Add a new AI model to use with chatbots."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g., GPT-4o"
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="modelid">Model ID</Label>
                    <Input
                      id="modelid"
                      name="modelid"
                      value={formData.modelid}
                      onChange={handleChange}
                      placeholder="e.g., gpt-4o"
                      required
                    />
                    <p className="text-sm text-muted-foreground">
                      The exact model ID used by the API (e.g., gpt-4o, gpt-3.5-turbo)
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="provider">Provider</Label>
                    <select
                      id="provider"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      required
                    >
                      <option value="openai">OpenAI</option>
                      <option value="anthropic">Anthropic</option>
                      <option value="google">Google</option>
                      <option value="mistral">Mistral</option>
                      <option value="groq">Groq</option>
                    </select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="maxtokens">Max Tokens</Label>
                    <Input
                      id="maxtokens"
                      name="maxtokens"
                      type="number"
                      value={formData.maxtokens}
                      onChange={handleChange}
                      min={1}
                      required
                    />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isactive"
                      checked={formData.isactive}
                      onCheckedChange={(checked) => handleSwitchChange("isactive", checked)}
                    />
                    <Label htmlFor="isactive">Active</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="isdefault"
                      checked={formData.isdefault}
                      onCheckedChange={(checked) => handleSwitchChange("isdefault", checked)}
                    />
                    <Label htmlFor="isdefault">Default Model</Label>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      "Save Model"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : models.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No AI models configured yet. Add your first model.</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Model ID</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Max Tokens</TableHead>
                  <TableHead>Default</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {models.map((model) => (
                  <TableRow key={model.id}>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell className="font-mono text-sm">{model.modelid}</TableCell>
                    <TableCell>{model.provider}</TableCell>
                    <TableCell>{model.maxtokens.toLocaleString()}</TableCell>
                    <TableCell>
                      {model.isdefault ? (
                        <Check className="h-4 w-4 text-green-500" />
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSetDefault(model.id)}
                          className="h-8 text-xs"
                        >
                          Set Default
                        </Button>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={model.isactive}
                        onCheckedChange={() => handleToggleActive(model.id, model.isactive)}
                        aria-label={model.isactive ? "Active" : "Inactive"}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(model)}>
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => confirmDelete(model.id)}>
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

      <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this AI model. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
