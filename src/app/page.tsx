"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioItem } from "@/components/ui/radio-group"
import { ChevronDown, ChevronUp, Plus, AlertTriangle, AlertCircle, Info, Search, Filter, Clock } from "lucide-react"
import Image from "next/image"
import { IncidentDetailsDialog } from "@/components/incident-details-dialog"
import { TakeActionDialog } from "@/components/take-action-dialog"

// Define the Incident type
interface Incident {
  id: number
  title: string
  description: string
  severity: "Low" | "Medium" | "High"
  reported_at: string
  category?: string
  status?: "Open" | "In Progress" | "Resolved"
}

// Initial mock data
const initialIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description:
      "Algorithm consistently favored certain demographics in job recommendations, leading to potential discrimination issues. The bias was identified during a routine audit of recommendation patterns across different user groups.",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z",
    category: "Fairness",
    status: "In Progress",
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description:
      "Large Language Model provided incorrect safety procedure information when queried about emergency protocols. This could have led to dangerous situations if the information had been followed in a real emergency scenario.",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z",
    category: "Reliability",
    status: "Open",
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description:
      "Chatbot inadvertently exposed non-sensitive user metadata during conversation. The leak was contained to basic information and did not include any personally identifiable information or sensitive data.",
    severity: "Low",
    reported_at: "2025-03-20T09:15:00Z",
    category: "Privacy",
    status: "Resolved",
  },
  {
    id: 4,
    title: "Unexpected Model Behavior in Edge Case",
    description:
      "AI model produced unexpected outputs when presented with specific edge case inputs. The behavior was inconsistent with training objectives and could potentially lead to user confusion.",
    severity: "Medium",
    reported_at: "2025-03-25T11:45:00Z",
    category: "Robustness",
    status: "In Progress",
  },
]

export default function Home() {
  // State for incidents
  const [incidents, setIncidents] = useState<Incident[]>(initialIncidents)
  const [filter, setFilter] = useState<"All" | "Low" | "Medium" | "High">("All")
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest")
  const [expandedId, setExpandedId] = useState<number | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Dialog states
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showActionDialog, setShowActionDialog] = useState(false)

  // Form state
  const [newIncident, setNewIncident] = useState<{
    title: string
    description: string
    severity: "Low" | "Medium" | "High"
    category: string
  }>({
    title: "",
    description: "",
    severity: "Medium",
    category: "",
  })

  // Form validation state
  const [errors, setErrors] = useState({
    title: false,
    description: false,
    category: false,
  })

  // Filter incidents
  const filteredIncidents = incidents
    .filter((incident) => filter === "All" || incident.severity === filter)
    .filter(
      (incident) =>
        incident.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        incident.description.toLowerCase().includes(searchQuery.toLowerCase()),
    )

  // Sort incidents
  const sortedIncidents = [...filteredIncidents].sort((a, b) => {
    const dateA = new Date(a.reported_at).getTime()
    const dateB = new Date(b.reported_at).getTime()
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB
  })

  // Toggle incident details
  const toggleDetails = (id: number) => {
    setExpandedId(expandedId === id ? null : id)
  }

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setNewIncident((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: false,
      }))
    }
  }

  // Handle severity selection
  const handleSeverityChange = (value: string) => {
    setNewIncident((prev) => ({
      ...prev,
      severity: value as "Low" | "Medium" | "High",
    }))
  }

  // Handle category selection
  const handleCategoryChange = (value: string) => {
    setNewIncident((prev) => ({
      ...prev,
      category: value,
    }))
    if (errors.category) {
      setErrors((prev) => ({
        ...prev,
        category: false,
      }))
    }
  }

  // Submit new incident
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    const newErrors = {
      title: !newIncident.title.trim(),
      description: !newIncident.description.trim(),
      category: !newIncident.category.trim(),
    }

    if (newErrors.title || newErrors.description || newErrors.category) {
      setErrors(newErrors)
      return
    }

    // Create new incident
    const newId = Math.max(0, ...incidents.map((i) => i.id)) + 1
    const now = new Date().toISOString()

    setIncidents((prev) => [
      ...prev,
      {
        id: newId,
        ...newIncident,
        reported_at: now,
        status: "Open",
      },
    ])

    // Reset form
    setNewIncident({
      title: "",
      description: "",
      severity: "Medium",
      category: "",
    })
    setShowForm(false)
  }

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Get severity badge color
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "Low":
        return "bg-green-100 text-green-800"
      case "Medium":
        return "bg-yellow-100 text-yellow-800"
      case "High":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Get severity icon
  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "Low":
        return <Info className="h-5 w-5 text-green-600" />
      case "Medium":
        return <AlertCircle className="h-5 w-5 text-yellow-600" />
      case "High":
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      default:
        return null
    }
  }

  // Get status badge color
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Open":
        return "bg-blue-100 text-blue-800"
      case "In Progress":
        return "bg-purple-100 text-purple-800"
      case "Resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  // Handle view details button click
  const handleViewDetails = (incident: Incident) => {
    setSelectedIncident(incident)
    setShowDetailsDialog(true)
  }

  // Handle take action button click
  const handleTakeAction = (incident: Incident) => {
    setSelectedIncident(incident)
    setShowActionDialog(true)
  }

  useEffect(() => {
    // This is to handle hydration mismatch. Ensures client and server rendering matches
    const timer = setTimeout(() => setShowForm(false), 100) // Added delay to prevent hydration issues
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h1 className="text-3xl font-bold flex items-center">
                <AlertCircle className="mr-2 h-8 w-8" />
                AI Safety Incident Dashboard
              </h1>
              <p className="mt-2 text-blue-100">Monitor, track, and report AI safety incidents</p>
            </div>
            <div className="flex space-x-2">
              <Button
                onClick={() => setShowForm(!showForm)}
                className="bg-white text-blue-700 hover:bg-blue-50 flex items-center gap-2"
              >
                <Plus size={16} />
                Report New Incident
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Total Incidents</p>
                  <h3 className="text-3xl font-bold mt-1">{incidents.length}</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">High Severity</p>
                  <h3 className="text-3xl font-bold mt-1">{incidents.filter((i) => i.severity === "High").length}</h3>
                </div>
                <div className="bg-red-100 p-3 rounded-full">
                  <AlertTriangle className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Medium Severity</p>
                  <h3 className="text-3xl font-bold mt-1">{incidents.filter((i) => i.severity === "Medium").length}</h3>
                </div>
                <div className="bg-yellow-100 p-3 rounded-full">
                  <AlertCircle className="h-6 w-6 text-yellow-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">Low Severity</p>
                  <h3 className="text-3xl font-bold mt-1">{incidents.filter((i) => i.severity === "Low").length}</h3>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <Info className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-8">
          <div className="flex flex-col md:flex-row justify-between gap-4 items-start md:items-center">
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search incidents..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2 items-center">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select value={filter} onValueChange={(value) => setFilter(value as "All" | "Low" | "Medium" | "High")}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filter by Severity" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Severities</SelectItem>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 items-center">
                <Clock className="h-4 w-4 text-gray-500" />
                <Select value={sortOrder} onValueChange={(value) => setSortOrder(value as "newest" | "oldest")}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by Date" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 w-full md:w-auto">
              <Plus size={16} />
              Report New Incident
            </Button>
          </div>
        </div>

        {/* New Incident Form */}
        {showForm && (
          <Card className="bg-white p-6 mb-8 border shadow-sm">
            <CardHeader className="px-0 pt-0">
              <CardTitle className="text-xl font-semibold">Report New AI Safety Incident</CardTitle>
              <CardDescription>
                Please provide detailed information about the incident to help with assessment and mitigation.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="title">Incident Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={newIncident.title}
                      onChange={handleInputChange}
                      className={errors.title ? "border-red-500" : ""}
                      placeholder="Brief title describing the incident"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">Title is required</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select value={newIncident.category} onValueChange={handleCategoryChange}>
                      <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fairness">Fairness</SelectItem>
                        <SelectItem value="Privacy">Privacy</SelectItem>
                        <SelectItem value="Security">Security</SelectItem>
                        <SelectItem value="Reliability">Reliability</SelectItem>
                        <SelectItem value="Robustness">Robustness</SelectItem>
                        <SelectItem value="Transparency">Transparency</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">Category is required</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Detailed Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={newIncident.description}
                    onChange={handleInputChange}
                    className={`min-h-[120px] ${errors.description ? "border-red-500" : ""}`}
                    placeholder="Provide a detailed description of what happened, potential impacts, and any immediate actions taken"
                  />
                  {errors.description && <p className="text-red-500 text-sm mt-1">Description is required</p>}
                </div>

                <div className="space-y-2">
  <Label>Severity Level</Label>
  <RadioGroup value={newIncident.severity} onValueChange={handleSeverityChange} className="space-y-2">
    <div className="flex items-start space-x-3">
      <RadioItem value="Low" />
      <div>
        <p className="font-medium">Low</p>
        <p className="text-sm text-gray-500">Minor issue with minimal impact</p>
      </div>
    </div>
    <div className="flex items-start space-x-3">
      <RadioItem value="Medium" />
      <div>
        <p className="font-medium">Medium</p>
        <p className="text-sm text-gray-500">Moderate issue with potential for harm</p>
      </div>
    </div>
    <div className="flex items-start space-x-3">
      <RadioItem value="High" />
      <div>
        <p className="font-medium">High</p>
        <p className="text-sm text-gray-500">Serious issue with significant harm potential</p>
      </div>
    </div>
  </RadioGroup>
</div>


                <div className="flex justify-end gap-2 pt-2">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Submit Incident Report</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Incident List */}
        <div className="space-y-4">
          {sortedIncidents.length === 0 ? (
            <div className="bg-white rounded-lg border p-8 text-center">
              <Image
                src="/placeholder.svg?height=120&width=120"
                alt="No incidents"
                width={120}
                height={120}
                className="mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900">No incidents found</h3>
              <p className="text-gray-500 mt-1">
                {searchQuery ? "Try adjusting your search or filters" : "Report an incident to get started"}
              </p>
            </div>
          ) : (
            sortedIncidents.map((incident) => (
              <Card
                key={incident.id}
                className={`bg-white border overflow-hidden transition-all duration-200 ${expandedId === incident.id ? "shadow-md" : "shadow-sm"}`}
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div className="flex items-center gap-3">
                      {getSeverityIcon(incident.severity)}
                      <h3 className="text-lg font-semibold">{incident.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSeverityColor(incident.severity)}`}
                      >
                        {incident.severity} Severity
                      </span>
                      {incident.status && (
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(incident.status)}`}
                        >
                          {incident.status}
                        </span>
                      )}
                      <button
                        onClick={() => toggleDetails(incident.id)}
                        className="ml-2 p-1 rounded-full hover:bg-gray-100 transition-colors"
                        aria-label={expandedId === incident.id ? "Collapse details" : "Expand details"}
                      >
                        {expandedId === incident.id ? (
                          <ChevronUp size={18} className="text-gray-500" />
                        ) : (
                          <ChevronDown size={18} className="text-gray-500" />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedId === incident.id && (
                    <div className="mt-4 pt-4 border-t">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Reported</p>
                          <p className="mt-1">{formatDate(incident.reported_at)}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Category</p>
                          <p className="mt-1">{incident.category || "Uncategorized"}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">ID</p>
                          <p className="mt-1">INC-{incident.id.toString().padStart(4, "0")}</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-500 mb-2">Description</p>
                        <p className="text-gray-700 whitespace-pre-line">{incident.description}</p>
                      </div>

                      <div className="mt-4 flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(incident)}
                          className="relative overflow-hidden group"
                        >
                          <span className="relative z-10">View Details</span>
                          <span className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleTakeAction(incident)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white relative overflow-hidden group"
                        >
                          <span className="relative z-10">Take Action</span>
                          <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Incident Details Dialog */}
      {selectedIncident && (
        <IncidentDetailsDialog
          incident={selectedIncident}
          open={showDetailsDialog}
          onOpenChange={setShowDetailsDialog}
        />
      )}

      {/* Take Action Dialog */}
      {selectedIncident && (
        <TakeActionDialog incident={selectedIncident} open={showActionDialog} onOpenChange={setShowActionDialog} />
      )}
    </main>
  )
}
