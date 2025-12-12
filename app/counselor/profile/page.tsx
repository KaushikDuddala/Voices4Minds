"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { AlertCircle, X, Plus, CheckCircle, Clock } from "lucide-react"
import { ProfilePictureUpload } from "@/components/profile-picture-upload"

export default function CounselorProfilePage() {
  const [profile, setProfile] = useState<any>(null)
  const [counselorProfile, setCounselorProfile] = useState<any>(null)
  const [user, setUser] = useState<any>(null)
  const [fullName, setFullName] = useState("")
  const [bio, setBio] = useState("")
  const [credentials, setCredentials] = useState("")
  const [specializations, setSpecializations] = useState<string[]>([])
  const [newSpecialization, setNewSpecialization] = useState("")
  const [phone, setPhone] = useState("")
  const [location, setLocation] = useState("")
  const [yearsExperience, setYearsExperience] = useState("")
  const [isAcceptingPatients, setIsAcceptingPatients] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)

      // Fetch profiles

      
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      const { data: counselorData } = await supabase.from("counselor_profiles").select("*").eq("id", user.id).single()

      setProfile(profileData)
      setCounselorProfile(counselorData)
      setCounselorProfile(counselorData)

      if (profileData) {
        setFullName(profileData.full_name || "")
      }

      if (counselorData) {
        setBio(counselorData.bio || "")
        setCredentials(counselorData.credentials || "")
        setSpecializations(counselorData.specializations || [])
        setPhone(counselorData.phone || "")
        setLocation(counselorData.location || "")
        setYearsExperience(counselorData.years_experience?.toString() || "")
        setIsAcceptingPatients(counselorData.is_accepting_patients ?? true)
      }
    }

    fetchData()
  }, [router])

  const addSpecialization = () => {
    if (newSpecialization.trim() && !specializations.includes(newSpecialization.trim())) {
      setSpecializations([...specializations, newSpecialization.trim()])
      setNewSpecialization("")
    }
  }

  const removeSpecialization = (spec: string) => {
    setSpecializations(specializations.filter((s) => s !== spec))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setIsSubmitting(true)
    setError(null)
    setSuccess(false)

    try {
      // Update profile name
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ full_name: fullName })
        .eq("id", profile.id)

      if (profileError) throw profileError

      const { error: counselorError } = await supabase.from("counselor_profiles").upsert({
        id: profile.id,
        bio,
        credentials,
        specializations,
        phone: phone || null,
        location: location || null,
        years_experience: yearsExperience ? Number.parseInt(yearsExperience) : null,
        is_accepting_patients: isAcceptingPatients,
        // Only set to pending if it's a new profile, otherwise keep existing status
        ...(counselorProfile ? {} : { approval_status: "pending" }),
      })

      if (counselorError) throw counselorError

      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)

      const { data: updatedCounselorData } = await supabase
        .from("counselor_profiles")
        .select("*")
        .eq("id", profile.id)
        .single()
      setCounselorProfile(updatedCounselorData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update profile")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!profile) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="container py-8 md:py-12">
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const approvalStatus = counselorProfile?.approval_status || "pending"

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Counselor Profile</h1>
            <p className="text-muted-foreground">Manage your professional information and availability settings</p>
          </div>

          {approvalStatus === "pending" && (
            <Card className="border-orange-200 bg-orange-50">
              <CardContent className="flex items-start gap-3 py-4">
                <Clock className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" aria-hidden="true" />
                <div>
                  <p className="font-semibold text-orange-900">Profile Under Review</p>
                  <p className="text-sm text-orange-700 mt-1">
                    Your counselor profile is currently being reviewed by our team. You'll be able to accept
                    appointments once your profile is approved. This typically takes 1-2 business days.
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
                    Your counselor profile has been approved! You can now accept appointments and manage your
                    availability.
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
                    Your profile needs additional information or updates. Please review your information and resubmit.
                    Contact support if you need assistance.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

        <Card className="border-2">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
            <CardDescription>Upload or change your profile picture</CardDescription>
          </CardHeader>
          <CardContent>
            <ProfilePictureUpload userId={user.id} currentAvatarUrl={profile?.avatar_url} />
          </CardContent>
        </Card>

          <Card>
            <CardHeader>
              <CardTitle>Professional Information</CardTitle>
              <CardDescription>This information will be visible to potential clients</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                    placeholder="Dr. Jane Smith"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="credentials">Credentials *</Label>
                  <Input
                    id="credentials"
                    value={credentials}
                    onChange={(e) => setCredentials(e.target.value)}
                    required
                    placeholder="Licensed Clinical Social Worker (LCSW)"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Professional Bio *</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    required
                    rows={6}
                    placeholder="Share your approach to therapy, experience, and what clients can expect..."
                  />
                </div>

                <div className="space-y-2">
                  <Label>Specializations</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newSpecialization}
                      onChange={(e) => setNewSpecialization(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSpecialization())}
                      placeholder="e.g., Anxiety, Depression, PTSD"
                    />
                    <Button type="button" onClick={addSpecialization} size="icon">
                      <Plus className="h-4 w-4" aria-hidden="true" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {specializations.map((spec, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-1">
                        {spec}
                        <button
                          type="button"
                          onClick={() => removeSpecialization(spec)}
                          className="ml-1 hover:text-destructive"
                          aria-label={`Remove ${spec}`}
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      min="0"
                      value={yearsExperience}
                      onChange={(e) => setYearsExperience(e.target.value)}
                      placeholder="5"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="space-y-0.5">
                    <Label htmlFor="accepting-toggle" className="cursor-pointer">
                      Accepting New Patients
                    </Label>
                    <p className="text-sm text-muted-foreground">Allow new clients to book appointments with you</p>
                  </div>
                  <Switch
                    id="accepting-toggle"
                    checked={isAcceptingPatients}
                    onCheckedChange={setIsAcceptingPatients}
                  />
                </div>

                {error && (
                  <div
                    className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 p-3 rounded-md"
                    role="alert"
                  >
                    <AlertCircle className="h-4 w-4 mt-0.5" aria-hidden="true" />
                    <span>{error}</span>
                  </div>
                )}

                {success && (
                  <div
                    className="flex items-start gap-2 text-sm text-green-600 bg-green-50 p-3 rounded-md"
                    role="status"
                  >
                    <span>Profile updated successfully!</span>
                  </div>
                )}

                <div className="flex gap-4">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Saving..." : "Save Profile"}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => router.push("/counselor/dashboard")}>
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
