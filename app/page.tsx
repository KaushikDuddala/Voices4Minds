import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Users, Calendar, BookOpen, Phone, Shield, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { ScrollAnimation } from "@/components/scroll-animation"

export default async function HomePage() {
  const supabase = await createClient()
  const { data: testimonials } = await supabase.from("testimonials").select("*").eq("is_approved", true).limit(3)

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 via-primary/5 to-background py-24 md:py-40 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(234,154,208,0.15),transparent_50%)]" />
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="animate-bounce-in">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/20 text-sm font-medium text-primary mb-6">
                <Sparkles className="h-4 w-4" />
                Your Journey to Wellness Starts Here
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-balance animate-fade-in-up">
              You Are Not Alone in Your Journey
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto text-balance animate-fade-in-up animate-delay-200">
              Access compassionate mental health support, connect with professional counselors, and join a community
              that understands. Your path to wellness starts here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6 animate-fade-in-up animate-delay-300">
              <Button size="lg" asChild className="btn-animate text-lg px-8 py-6">
                <Link href="/appointments">
                  Find a Counselor
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-animate text-lg px-8 py-6 bg-transparent">
                <Link href="/resources">Explore Resources</Link>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground pt-6 animate-fade-in animate-delay-500">
              <strong>Crisis Support:</strong> Call{" "}
              <a href="tel:988" className="font-semibold text-primary hover:underline transition-all">
                988
              </a>{" "}
              for immediate help — available 24/7
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 md:py-32">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">How We Support You</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Comprehensive mental health resources and support designed to meet you where you are
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <ScrollAnimation delay={0}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Calendar className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Professional Counseling</CardTitle>
                  <CardDescription className="text-base">
                    Connect with licensed counselors through our easy appointment scheduling system
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/appointments">
                      Book Appointment
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={100}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Community Support</CardTitle>
                  <CardDescription className="text-base">
                    Join forums where you can share experiences and find understanding in a safe space
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/forum">
                      Join Community
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={200}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <BookOpen className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Educational Resources</CardTitle>
                  <CardDescription className="text-base">
                    Access articles, guides, and information about mental health conditions and coping strategies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/resources">
                      Learn More
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={300}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Phone className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Crisis Resources</CardTitle>
                  <CardDescription className="text-base">
                    Immediate access to national and local helplines for urgent mental health support
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/resources#crisis">
                      Get Help Now
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={400}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Wellness Blog</CardTitle>
                  <CardDescription className="text-base">
                    Read personal stories, expert advice, and practical tips for mental health and self-care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/blog">
                      Read Blog
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>

            <ScrollAnimation delay={500}>
              <Card className="h-full card-animate border-2 hover:border-primary/50">
                <CardHeader className="pb-4">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
                    <Shield className="h-7 w-7 text-primary" aria-hidden="true" />
                  </div>
                  <CardTitle className="text-xl">Privacy & Security</CardTitle>
                  <CardDescription className="text-base">
                    Your privacy is our priority. All communications are confidential and secure
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="link" className="px-0 group" asChild>
                    <Link href="/about">
                      Learn About Privacy
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-muted/50 to-background">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center max-w-5xl mx-auto">
            <ScrollAnimation delay={0}>
              <div className="space-y-4">
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">1 in 5</p>
                <p className="text-muted-foreground text-lg">Adults experience mental illness each year</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={150}>
              <div className="space-y-4">
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">50%</p>
                <p className="text-muted-foreground text-lg">Of mental illness begins by age 14</p>
              </div>
            </ScrollAnimation>
            <ScrollAnimation delay={300}>
              <div className="space-y-4">
                <p className="text-5xl md:text-6xl lg:text-7xl font-bold text-primary">75%</p>
                <p className="text-muted-foreground text-lg">Can improve with proper treatment</p>
              </div>
            </ScrollAnimation>
          </div>
          <ScrollAnimation delay={400} className="text-center mt-16">
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              Mental health conditions are common and treatable. Seeking help is a sign of strength, not weakness.
            </p>
          </ScrollAnimation>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <ScrollAnimation className="text-center space-y-4 mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Stories of Hope</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Real experiences from individuals who found support and healing
              </p>
            </ScrollAnimation>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {testimonials.map((testimonial, index) => (
                <ScrollAnimation key={testimonial.id} delay={index * 150}>
                  <Card className="h-full bg-background card-animate border-2">
                    <CardHeader>
                      <CardDescription className="text-base leading-relaxed italic">
                        &ldquo;{testimonial.content}&rdquo;
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="font-semibold text-sm">— {testimonial.author_name}</p>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
            <ScrollAnimation delay={500} className="text-center mt-12">
              <Button variant="outline" asChild className="btn-animate bg-transparent">
                <Link href="/testimonials">Read More Stories</Link>
              </Button>
            </ScrollAnimation>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-gradient-to-b from-background to-primary/10">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollAnimation className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">Ready to Take the First Step?</h2>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join our supportive community and access the resources you need for your mental health journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
              <Button size="lg" asChild className="btn-animate text-lg px-8 py-6">
                <Link href="/auth/sign-up">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="btn-animate text-lg px-8 py-6 bg-transparent">
                <Link href="/about">Learn More About Us</Link>
              </Button>
            </div>
          </ScrollAnimation>
        </div>
      </section>
    </div>
  )
}
