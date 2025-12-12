import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export const metadata = {
  title: "My Appointments | Counselor Portal",
  description: "View and manage your client appointments",
}

export default async function CounselorAppointmentsPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "counselor") {
    redirect("/dashboard")
  }

  const { data: appointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      user:profiles!appointments_user_id_fkey(full_name, avatar_url)
    `,
    )
    .eq("counselor_id", user.id)
    .order("appointment_date", { ascending: true })
    .order("start_time", { ascending: true })

  const upcomingAppointments = appointments?.filter((apt) => {
    const aptDate = new Date(`${apt.appointment_date}T${apt.start_time}`)
    return aptDate >= new Date() && apt.status !== "cancelled"
  })

  const pastAppointments = appointments?.filter((apt) => {
    const aptDate = new Date(`${apt.appointment_date}T${apt.start_time}`)
    return aptDate < new Date() || apt.status === "cancelled"
  })

  const formatTime = (time: string) => {
    const hour = Number.parseInt(time.split(":")[0])
    const minute = time.split(":")[1]
    const ampm = hour >= 12 ? "PM" : "AM"
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minute} ${ampm}`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "pending":
        return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
      case "cancelled":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "completed":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      default:
        return "bg-muted"
    }
  }

  return (
    <div className="w-full min-h-screen py-8 md:py-12">
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Client Appointments</h1>
            <p className="text-muted-foreground mt-2">View and manage all your scheduled sessions</p>
          </div>

          {/* Upcoming Appointments */}
          {upcomingAppointments && upcomingAppointments.length > 0 ? (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Upcoming Sessions</h2>
              <div className="grid gap-4">
                {upcomingAppointments.map((appointment) => (
                  <Card key={appointment.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            avatarUrl={appointment.user?.avatar_url}
                            fullName={appointment.user?.full_name}
                            size="lg"
                          />
                          <div>
                            <CardTitle className="text-xl">{appointment.user?.full_name || "Client"}</CardTitle>
                            <CardDescription>Client Session</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)} variant="outline">
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="grid gap-3 md:grid-cols-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                          <span>
                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                          </span>
                        </div>
                      </div>
                      {appointment.notes && (
                        <div className="mt-4 p-3 bg-muted/50 rounded-md">
                          <p className="text-sm font-medium mb-1">Client Notes:</p>
                          <p className="text-sm text-muted-foreground">{appointment.notes}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
                <h3 className="text-xl font-semibold mb-2">No Upcoming Appointments</h3>
                <p className="text-muted-foreground">Your schedule is clear</p>
              </CardContent>
            </Card>
          )}

          {/* Past Appointments */}
          {pastAppointments && pastAppointments.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-2xl font-semibold">Past Sessions</h2>
              <div className="grid gap-4">
                {pastAppointments.slice(0, 10).map((appointment) => (
                  <Card key={appointment.id} className="opacity-75">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-start gap-4">
                          <UserAvatar
                            avatarUrl={appointment.user?.avatar_url}
                            fullName={appointment.user?.full_name}
                            size="lg"
                          />
                          <div>
                            <CardTitle className="text-xl">{appointment.user?.full_name || "Client"}</CardTitle>
                            <CardDescription>Client Session</CardDescription>
                          </div>
                        </div>
                        <Badge className={getStatusColor(appointment.status)} variant="outline">
                          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid gap-3 md:grid-cols-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" aria-hidden="true" />
                          <span>{new Date(appointment.appointment_date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          <span>
                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
