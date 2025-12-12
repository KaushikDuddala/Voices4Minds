import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Calendar, Users, Settings, Clock, CheckCircle, AlertCircle } from "lucide-react"

export const metadata = {
  title: "Counselor Dashboard | MindWell",
  description: "Manage your counseling profile, appointments, and availability",
}

export default async function CounselorDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a counselor
  const { data: profile } = await supabase.from("profiles").select("user_type").eq("id", user.id).single()

  if (profile?.user_type !== "counselor") {
    redirect("/dashboard")
  }

  // Get counselor profile
  const { data: counselorProfile } = await supabase.from("counselor_profiles").select("*").eq("id", user.id).single()

  // Get today's appointments
  const today = new Date().toISOString().split("T")[0]
  const { data: todayAppointments } = await supabase
    .from("appointments")
    .select(
      `
      *,
      user:profiles!appointments_user_id_fkey(full_name)
    `,
    )
    .eq("counselor_id", user.id)
    .eq("appointment_date", today)
    .in("status", ["pending", "confirmed"])
    .order("start_time")

  // Get upcoming appointments
  const { data: upcomingAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("counselor_id", user.id)
    .gte("appointment_date", today)
    .in("status", ["pending", "confirmed"])
    .order("appointment_date")
    .order("start_time")
    .limit(5)

  // Get availability count
  const { count: availabilityCount } = await supabase
    .from("counselor_availability")
    .select("*", { count: "exact", head: true })
    .eq("counselor_id", user.id)
    .eq("is_active", true)

  const approvalStatus = counselorProfile?.approval_status || "pending"

  return (
    <div className="w-full min-h-screen py-8 md:py-12">
      <div className="flex items-center justify-center px-4">
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold">Counselor Dashboard</h1>
            <p className="text-muted-foreground mt-2">Manage your practice and connect with clients</p>
          </div>

          {approvalStatus === "pending" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="flex items-start gap-3 py-4">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-orange-900">Profile Under Review</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Your counselor profile is currently being reviewed. You'll be visible to clients once approved
                    (typically 1-2 business days).
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {approvalStatus === "approved" && (
            <Card className="border-green-200 bg-green-50">
              <CardContent className="flex items-start gap-3 py-4">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-green-900">Profile Approved</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your profile is live and visible to clients seeking counseling services.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {approvalStatus === "rejected" && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="flex items-start gap-3 py-4">
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-red-900">Profile Requires Updates</p>
                  <p className="text-sm text-red-700 mt-1">
                    Please review and update your profile information. Contact support if you need assistance.
                  </p>
                  <Button size="sm" variant="outline" className="mt-3 bg-white" asChild>
                    <Link href="/counselor/profile">Update Profile</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Stats */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Profile Status</CardTitle>
                <Settings className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold capitalize">{approvalStatus}</div>
                <p className="text-xs text-muted-foreground">
                  {approvalStatus === "approved"
                    ? "Visible to clients"
                    : approvalStatus === "pending"
                      ? "Awaiting review"
                      : "Needs updates"}
                </p>
                <Button size="sm" variant="outline" className="mt-4 w-full bg-transparent" asChild>
                  <Link href="/counselor/profile">Edit Profile</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Today&apos;s Appointments</CardTitle>
                <Calendar className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{todayAppointments?.length || 0}</div>
                <p className="text-xs text-muted-foreground">Scheduled for today</p>
                <Button size="sm" variant="outline" className="mt-4 w-full bg-transparent" asChild>
                  <Link href="/counselor/appointments">View All</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Upcoming Appointments</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{upcomingAppointments?.length || 0}</div>
                <p className="text-xs text-muted-foreground">In your schedule</p>
                <Button size="sm" variant="outline" className="mt-4 w-full bg-transparent" asChild>
                  <Link href="/counselor/appointments">Manage</Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Availability</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{availabilityCount || 0}</div>
                <p className="text-xs text-muted-foreground">Time slots set</p>
                <Button size="sm" variant="outline" className="mt-4 w-full bg-transparent" asChild>
                  <Link href="/counselor/availability">Set Hours</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Today's Appointments */}
          {todayAppointments && todayAppointments.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Today&apos;s Schedule</CardTitle>
                <CardDescription>{new Date().toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {todayAppointments.map((appointment) => {
                    const formatTime = (time: string) => {
                      const hour = Number.parseInt(time.split(":")[0])
                      const minute = time.split(":")[1]
                      const ampm = hour >= 12 ? "PM" : "AM"
                      const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
                      return `${displayHour}:${minute} ${ampm}`
                    }

                    return (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between border-b pb-4 last:border-0"
                      >
                        <div>
                          <p className="font-medium">{appointment.user?.full_name || "Client"}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatTime(appointment.start_time)} - {formatTime(appointment.end_time)}
                          </p>
                          {appointment.notes && (
                            <p className="text-xs text-muted-foreground mt-1">Note: {appointment.notes}</p>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground capitalize">{appointment.status}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-3">
              <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent">
                <Link href="/counselor/profile">
                  <Settings className="h-6 w-6 mb-2" aria-hidden="true" />
                  <span className="font-semibold">Update Profile</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Edit your bio, specializations, and contact info
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent">
                <Link href="/counselor/availability">
                  <Clock className="h-6 w-6 mb-2" aria-hidden="true" />
                  <span className="font-semibold">Manage Availability</span>
                  <span className="text-xs text-muted-foreground font-normal">
                    Set your available hours for booking
                  </span>
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-auto p-6 flex flex-col items-start gap-2 bg-transparent">
                <Link href="/counselor/appointments">
                  <Calendar className="h-6 w-6 mb-2" aria-hidden="true" />
                  <span className="font-semibold">View Appointments</span>
                  <span className="text-xs text-muted-foreground font-normal">See all scheduled sessions</span>
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
