    "use client"

    import type React from "react"
    import { useState } from "react"
    import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
    import { Button } from "@/components/ui/button"
    import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
    import { Textarea } from "@/components/ui/textarea"
    import { Label } from "@/components/ui/label"
    import { Avatar, AvatarFallback } from "@/components/ui/avatar"
    import { Card, CardContent } from "@/components/ui/card"
    import { AlertTriangle, AlertCircle, Info, CheckCircle, Users, MessageSquare, Clock } from "lucide-react"

    interface Incident {
    id: number
    title: string
    description: string
    severity: "Low" | "Medium" | "High"
    reported_at: string
    category?: string
    status?: "Open" | "In Progress" | "Resolved"
    }

    interface TakeActionDialogProps {
    incident: Incident
    open: boolean
    onOpenChange: (open: boolean) => void
    }

    export function TakeActionDialog({ incident, open, onOpenChange }: TakeActionDialogProps) {
    const [actionTab, setActionTab] = useState("update")
    const [newStatus, setNewStatus] = useState(incident.status || "Open")
    const [assignee, setAssignee] = useState("")
    const [priority, setPriority] = useState(incident.severity)
    const [notes, setNotes] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

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

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
        setIsSubmitting(false)
        onOpenChange(false)

        // In a real app, you would update the incident here
        // For now, we'll just close the dialog
        }, 1000)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px] overflow-y-auto max-h-[85vh]">
            <DialogHeader>
            <div className="flex items-center gap-2">
                {getSeverityIcon(incident.severity)}
                <DialogTitle className="text-xl">Take Action</DialogTitle>
            </div>
            <DialogDescription>
                Incident: {incident.title} (INC-{incident.id.toString().padStart(4, "0")})
            </DialogDescription>
            </DialogHeader>

            <Tabs value={actionTab} onValueChange={setActionTab} className="mt-4">
            <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="update" className="flex items-center gap-1">
                <AlertCircle className="h-4 w-4" /> Update Status
                </TabsTrigger>
                <TabsTrigger value="assign" className="flex items-center gap-1">
                <Users className="h-4 w-4" /> Assign
                </TabsTrigger>
                <TabsTrigger value="comment" className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" /> Comment
                </TabsTrigger>
            </TabsList>

            <form onSubmit={handleSubmit}>
                <TabsContent value="update" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="status">Update Status</Label>
                    <Select value={newStatus} onValueChange={setNewStatus}>
                        <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Resolved">Resolved</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="priority">Priority</Label>
                    <Select value={priority} onValueChange={setPriority as (value: string) => void}>
                        <SelectTrigger id="priority">
                        <SelectValue placeholder="Select priority" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="notes">Status Notes</Label>
                    <Textarea
                        id="notes"
                        placeholder="Add notes about this status change"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px]"
                    />
                    </div>
                </div>
                </TabsContent>

                <TabsContent value="assign" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="assignee">Assign To</Label>
                    <Select value={assignee} onValueChange={setAssignee}>
                        <SelectTrigger id="assignee">
                        <SelectValue placeholder="Select team member" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="jane_doe">Jane Doe (AI Safety Lead)</SelectItem>
                        <SelectItem value="mike_smith">Mike Smith (ML Engineer)</SelectItem>
                        <SelectItem value="alex_johnson">Alex Johnson (Data Scientist)</SelectItem>
                        <SelectItem value="rachel_lee">Rachel Lee (Ethics Specialist)</SelectItem>
                        </SelectContent>
                    </Select>
                    </div>

                    <div className="space-y-2">
                    <Label>Team Members</Label>
                    <div className="space-y-2">
                        <Card className="hover:bg-blue-50 cursor-pointer transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                            <Avatar>
                            <AvatarFallback className="bg-blue-100 text-blue-600">JD</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium">Jane Doe</p>
                            <p className="text-sm text-gray-500">AI Safety Lead</p>
                            </div>
                            <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Available
                            </span>
                            </div>
                        </CardContent>
                        </Card>
                        <Card className="hover:bg-blue-50 cursor-pointer transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                            <Avatar>
                            <AvatarFallback className="bg-green-100 text-green-600">MS</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium">Mike Smith</p>
                            <p className="text-sm text-gray-500">ML Engineer</p>
                            </div>
                            <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                Busy
                            </span>
                            </div>
                        </CardContent>
                        </Card>
                        <Card className="hover:bg-blue-50 cursor-pointer transition-colors">
                        <CardContent className="p-3 flex items-center gap-3">
                            <Avatar>
                            <AvatarFallback className="bg-purple-100 text-purple-600">AJ</AvatarFallback>
                            </Avatar>
                            <div>
                            <p className="font-medium">Alex Johnson</p>
                            <p className="text-sm text-gray-500">Data Scientist</p>
                            </div>
                            <div className="ml-auto">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                Available
                            </span>
                            </div>
                        </CardContent>
                        </Card>
                    </div>
                    </div>

                    <div className="space-y-2">
                    <Label htmlFor="assignment-notes">Assignment Notes</Label>
                    <Textarea
                        id="assignment-notes"
                        placeholder="Add notes about this assignment"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[100px]"
                    />
                    </div>
                </div>
                </TabsContent>

                <TabsContent value="comment" className="space-y-4 py-4 animate-in fade-in-50 duration-300">
                <div className="space-y-4">
                    <div className="space-y-2">
                    <Label htmlFor="comment">Add Comment</Label>
                    <Textarea
                        id="comment"
                        placeholder="Add your comment or notes about this incident"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        className="min-h-[150px]"
                    />
                    </div>

                    <div className="space-y-2">
                    <Label>Recent Comments</Label>
                    <div className="space-y-3 max-h-[200px] overflow-y-auto">
                        <div className="p-3 border rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <Avatar className="h-6 w-6">
                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">JD</AvatarFallback>
                            </Avatar>
                            <span className="font-medium text-sm">Jane Doe</span>
                            <span className="text-xs text-gray-500 flex items-center">
                            <Clock className="h-3 w-3 mr-1" /> 2 hours ago
                            </span>
                        </div>
                        <p className="text-sm text-gray-700">
                            Initial investigation shows this might be related to the recent model update.
                        </p>
                        </div>
                    </div>
                    </div>
                </div>
                </TabsContent>

                <div className="flex justify-end gap-2 mt-6">
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                </Button>
                <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white relative overflow-hidden group"
                >
                    <span className="relative z-10 flex items-center">
                    {isSubmitting ? "Processing..." : "Submit"}
                    {!isSubmitting && <CheckCircle className="ml-2 h-4 w-4 group-hover:scale-110 transition-transform" />}
                    </span>
                    <span className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></span>
                </Button>
                </div>
            </form>
            </Tabs>
        </DialogContent>
        </Dialog>
    )
    }
