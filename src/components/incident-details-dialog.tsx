    "use client"
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
    import { Button } from "@/components/ui/button"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { Progress } from "@/components/ui/progress"
    import { Avatar, AvatarFallback } from "@/components/ui/avatar"
    import { Card, CardContent } from "@/components/ui/card"
    import { AlertTriangle, AlertCircle, Info, FileText, Clock, Users, Activity, CheckCircle } from "lucide-react"

    interface Incident {
    id: number
    title: string
    description: string
    severity: "Low" | "Medium" | "High"
    reported_at: string
    category?: string
    status?: "Open" | "In Progress" | "Resolved"
    }

    interface IncidentDetailsDialogProps {
    incident: Incident
    open: boolean
    onOpenChange: (open: boolean) => void
    }

    export function IncidentDetailsDialog({ incident, open, onOpenChange }: IncidentDetailsDialogProps) {
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

    // Get severity color
    const getSeverityColor = (severity: string) => {
        switch (severity) {
        case "Low":
            return "text-green-600"
        case "Medium":
            return "text-yellow-600"
        case "High":
            return "text-red-600"
        default:
            return "text-gray-600"
        }
    }

    // Get status color
    const getStatusColor = (status?: string) => {
        switch (status) {
        case "Open":
            return "text-blue-600"
        case "In Progress":
            return "text-purple-600"
        case "Resolved":
            return "text-green-600"
        default:
            return "text-gray-600"
        }
    }

    // Get progress value based on status
    const getProgressValue = (status?: string) => {
        switch (status) {
        case "Open":
            return 25
        case "In Progress":
            return 65
        case "Resolved":
            return 100
        default:
            return 0
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px] overflow-y-auto max-h-[85vh]">
            <DialogHeader>
            <div className="flex items-center gap-2">
                {getSeverityIcon(incident.severity)}
                <DialogTitle className="text-xl">{incident.title}</DialogTitle>
            </div>
            <DialogDescription>
                Incident ID: INC-{incident.id.toString().padStart(4, "0")} • Reported: {formatDate(incident.reported_at)}
            </DialogDescription>
            </DialogHeader>

            <Tabs defaultValue="details" className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details" className="flex items-center gap-1">
                <FileText className="h-4 w-4" /> Details
                </TabsTrigger>
                <TabsTrigger value="timeline" className="flex items-center gap-1">
                <Clock className="h-4 w-4" /> Timeline
                </TabsTrigger>
                <TabsTrigger value="team" className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Team
                </TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="grid grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Severity</h3>
                    <p className={`font-medium ${getSeverityColor(incident.severity)}`}>{incident.severity}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Category</h3>
                    <p className="font-medium">{incident.category || "Uncategorized"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                    <p className={`font-medium ${getStatusColor(incident.status)}`}>{incident.status || "Unknown"}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Reported</h3>
                    <p className="font-medium">{formatDate(incident.reported_at)}</p>
                </div>
                </div>

                <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Progress</h3>
                <div className="space-y-2">
                    <Progress value={getProgressValue(incident.status)} className="h-2" />
                    <div className="flex justify-between text-xs text-gray-500">
                    <span>Reported</span>
                    <span>In Progress</span>
                    <span>Resolved</span>
                    </div>
                </div>
                </div>

                <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
                <Card>
                    <CardContent className="p-4 text-gray-700 whitespace-pre-line">{incident.description}</CardContent>
                </Card>
                </div>

                <div className="mt-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Risk Assessment</h3>
                <div className="grid grid-cols-3 gap-4">
                    <Card className="bg-red-50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <AlertTriangle className="h-8 w-8 text-red-500 mb-2" />
                        <h4 className="font-medium">Impact</h4>
                        <p className="text-sm text-gray-600">
                        {incident.severity === "High" ? "High" : incident.severity === "Medium" ? "Medium" : "Low"}
                        </p>
                    </CardContent>
                    </Card>
                    <Card className="bg-yellow-50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <Activity className="h-8 w-8 text-yellow-500 mb-2" />
                        <h4 className="font-medium">Likelihood</h4>
                        <p className="text-sm text-gray-600">
                        {incident.severity === "High" ? "High" : incident.severity === "Medium" ? "Medium" : "Low"}
                        </p>
                    </CardContent>
                    </Card>
                    <Card className="bg-blue-50">
                    <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="h-8 w-8 text-blue-500 mb-2" />
                        <h4 className="font-medium">Priority</h4>
                        <p className="text-sm text-gray-600">
                        {incident.severity === "High" ? "Critical" : incident.severity === "Medium" ? "High" : "Medium"}
                        </p>
                    </CardContent>
                    </Card>
                </div>
                </div>
            </TabsContent>

            <TabsContent value="timeline" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="relative pl-6 border-l-2 border-gray-200 space-y-8">
                <div className="relative">
                    <div className="absolute -left-[25px] p-1 rounded-full bg-blue-100 border-2 border-white">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="mb-1">
                    <span className="text-sm font-medium">Incident Reported</span>
                    <span className="text-xs text-gray-500 ml-2">{formatDate(incident.reported_at)}</span>
                    </div>
                    <p className="text-sm text-gray-600">
                    Incident was reported and assigned ID INC-{incident.id.toString().padStart(4, "0")}
                    </p>
                </div>

                {incident.status === "In Progress" || incident.status === "Resolved" ? (
                    <div className="relative">
                    <div className="absolute -left-[25px] p-1 rounded-full bg-purple-100 border-2 border-white">
                        <Activity className="h-4 w-4 text-purple-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-sm font-medium">Investigation Started</span>
                        <span className="text-xs text-gray-500 ml-2">
                        {formatDate(
                            new Date(new Date(incident.reported_at).getTime() + 2 * 60 * 60 * 1000).toISOString(),
                        )}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">Investigation team assigned and began analyzing the incident</p>
                    </div>
                ) : null}

                {incident.status === "Resolved" ? (
                    <div className="relative">
                    <div className="absolute -left-[25px] p-1 rounded-full bg-green-100 border-2 border-white">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="mb-1">
                        <span className="text-sm font-medium">Incident Resolved</span>
                        <span className="text-xs text-gray-500 ml-2">
                        {formatDate(
                            new Date(new Date(incident.reported_at).getTime() + 24 * 60 * 60 * 1000).toISOString(),
                        )}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">
                        All issues were addressed and the incident was marked as resolved
                    </p>
                    </div>
                ) : null}
                </div>
            </TabsContent>

            <TabsContent value="team" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="space-y-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Incident Owner</h3>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                        <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
                    </Avatar>
                    <div>
                        <p className="font-medium">Jane Doe</p>
                        <p className="text-sm text-gray-500">AI Safety Lead</p>
                    </div>
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-2">Response Team</h3>
                    <div className="space-y-2">
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                        <AvatarFallback className="bg-green-100 text-green-600">MS</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">Mike Smith</p>
                        <p className="text-sm text-gray-500">ML Engineer</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                        <AvatarFallback className="bg-purple-100 text-purple-600">AJ</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">Alex Johnson</p>
                        <p className="text-sm text-gray-500">Data Scientist</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 border rounded-lg">
                        <Avatar>
                        <AvatarFallback className="bg-yellow-100 text-yellow-600">RL</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-medium">Rachel Lee</p>
                        <p className="text-sm text-gray-500">Ethics Specialist</p>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline">Export Report</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white">
                Update Status
            </Button>
            </div>
        </DialogContent>
        </Dialog>
    )
    }
