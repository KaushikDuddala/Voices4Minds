"use server"

import { createClient } from "@/lib/supabase/server"
import { put } from "@vercel/blob"
import { revalidatePath } from "next/cache"

export async function uploadAvatar(formData: FormData) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return { error: "Unauthorized" }
    }

    const file = formData.get("file") as File

    if (!file) {
      return { error: "No file provided" }
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return { error: "File must be an image" }
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      return { error: "File size must be less than 5MB" }
    }

    const fileExt = file.name.split(".").pop()
    const fileName = `${user.id}-${Date.now()}.${fileExt}`

    // Upload to Vercel Blob
    const blob = await put(fileName, file, {
      access: "public",
    })

    // Update user profile with new avatar URL
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: blob.url }).eq("id", user.id)

    if (updateError) {
      return { error: updateError.message }
    }

    // Revalidate pages that display the avatar
    revalidatePath("/profile")
    revalidatePath("/blog")
    revalidatePath("/forum")
    revalidatePath("/dashboard")

    return { success: true, url: blob.url }
  } catch (error) {
    console.error("Error uploading avatar:", error)
    return { error: "Failed to upload image. Please try again." }
  }
}
