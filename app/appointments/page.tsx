import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Calendar, MapPin, Award, CheckCircle, ArrowRight } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { UserAvatar } from "@/components/user-avatar"

export const metadata = {
  title: "Find a Counselor | Voices4Minds",
  description:
    "Connect with licensed mental health professionals. Browse our network of counselors and schedule appointments.",
}

export default async function AppointmentsPage() {
  const supabase = await createClient()

  const { data: counselors } = await supabase
    .from("counselor_profiles")
    .select(`
      *,
      profiles (
        id,
        full_name,
        avatar_url
      )
    `)
    .eq("is_accepting_patients", true)
    .eq("approval_status", "approved")
    .order("created_at", { ascending: false })

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="space-y-16">
        {/* Header */}
        <ScrollAnimation className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Find Your Counselor</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Connect with licensed mental health professionals who specialize in various areas. Browse our network of
            compassionate counselors and schedule an appointment that works for you.
          </p>
        </ScrollAnimation>

        {/* Counselors Grid */}
        {counselors && counselors.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {counselors.map((counselor, index) => (
              <ScrollAnimation key={counselor.id} delay={index * 100}>
                <Card className="flex flex-col h-full card-animate border-2 hover:border-primary/50">
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <UserAvatar
                        avatarUrl={counselor.profiles?.avatar_url}
                        fullName={counselor.profiles?.full_name}
                        size="xl"
                      />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-xl mb-1">{counselor.profiles?.full_name || "Counselor"}</CardTitle>
                        <p className="text-sm text-muted-foreground">{counselor.credentials || "Licensed Counselor"}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col gap-6">
                    {counselor.bio && (
                      <CardDescription className="line-clamp-3 leading-relaxed text-base">
                        {counselor.bio}
                      </CardDescription>
                    )}

                    {counselor.specializations && counselor.specializations.length > 0 && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Award className="h-4 w-4 text-primary" aria-hidden="true" />
                          <span>Specializations:</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {counselor.specializations.slice(0, 3).map((spec: string, idx: number) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {spec}
                            </Badge>
                          ))}
                          {counselor.specializations.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{counselor.specializations.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="space-y-2 text-sm text-muted-foreground">
                      {counselor.years_experience && (
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-primary" aria-hidden="true" />
                          <span>{counselor.years_experience} years of experience</span>
                        </div>
                      )}
                      {counselor.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" aria-hidden="true" />
                          <span>{counselor.location}</span>
                        </div>
                      )}
                    </div>

                    <div className="mt-auto pt-4">
                      <Button className="w-full btn-animate group" asChild>
                        <Link href={`/appointments/book/${counselor.id}`}>
                          <Calendar className="h-4 w-4 mr-2" aria-hidden="true" />
                          Schedule Appointment
                          <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <ScrollAnimation>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-16 text-center">
                <p className="text-muted-foreground mb-6 text-lg">
                  No counselors are currently accepting new patients. Please check back soon or contact us for
                  assistance.
                </p>
                <Button variant="outline" asChild className="btn-animate bg-transparent">
                  <Link href="/resources#crisis">View Crisis Resources</Link>
                </Button>
              </CardContent>
            </Card>
          </ScrollAnimation>
        )}

        {/* Info Section */}
        <ScrollAnimation>
          <Card className="bg-muted/50 max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl md:text-3xl">How It Works</CardTitle>
              <CardDescription className="text-base">
                Simple steps to connect with a mental health professional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ol className="space-y-8 max-w-2xl mx-auto">
                <li className="flex gap-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Browse Counselors</p>
                    <p className="text-muted-foreground">
                      Review profiles, specializations, and experience to find the right match for you
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Select Available Time</p>
                    <p className="text-muted-foreground">
                      View the counselor&apos;s availability and choose a date and time that works for your schedule
                    </p>
                  </div>
                </li>
                <li className="flex gap-6">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold flex-shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-semibold text-lg mb-1">Confirm Appointment</p>
                    <p className="text-muted-foreground">
                      Receive confirmation and reminders. Access your appointments from your dashboard
                    </p>
                  </div>
                </li>
              </ol>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  )
}
