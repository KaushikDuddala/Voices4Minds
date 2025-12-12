"use client"

import type React from "react"
import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, User } from "lucide-react"
import { uploadAvatar } from "@/app/actions/upload-avatar"

interface ProfilePictureUploadProps {
  userId: string
  currentAvatarUrl?: string | null
}

export function ProfilePictureUpload({ userId, currentAvatarUrl }: ProfilePictureUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(currentAvatarUrl)
  const [error, setError] = useState<string | null>(null)

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      setError(null)

      if (!event.target.files || event.target.files.length === 0) {
        return
      }

      const file = event.target.files[0]

      // Client-side validation
      if (!file.type.startsWith("image/")) {
        setError("Please upload an image file")
        return
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB")
        return
      }

      const formData = new FormData()
      formData.append("file", file)

      const result = await uploadAvatar(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.url) {
        setAvatarUrl(result.url)
      }
    } catch (error) {
      console.error("Error uploading avatar:", error)
      setError("Error uploading image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-6">
      <Avatar className="h-32 w-32">
        <AvatarImage src={avatarUrl || undefined} alt="Profile picture" />
        <AvatarFallback className="text-4xl">
          <User className="h-16 w-16 text-muted-foreground" />
        </AvatarFallback>
      </Avatar>

      <div className="flex flex-col items-center gap-2">
        {error && <p className="text-sm text-red-500 mb-2 text-center">{error}</p>}
        <label htmlFor="avatar-upload">
          <Button disabled={uploading} className="cursor-pointer btn-animate" asChild>
            <span>
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  {avatarUrl ? "Change Picture" : "Upload Picture"}
                </>
              )}
            </span>
          </Button>
        </label>
        <input
          id="avatar-upload"
          type="file"
          accept="image/*"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
        <p className="text-xs text-muted-foreground text-center">JPG, PNG, or GIF. Max size 5MB.</p>
      </div>
    </div>
  )
}
