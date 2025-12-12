import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User } from "lucide-react"

interface UserAvatarProps {
  avatarUrl?: string | null
  fullName?: string | null
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function UserAvatar({ avatarUrl, fullName, size = "md", className = "" }: UserAvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
    xl: "h-16 w-16",
  }

  const iconSizes = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
    xl: "h-8 w-8",
  }

  const textSizes = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
    xl: "text-2xl",
  }

  return (
    <Avatar className={`${sizeClasses[size]} ${className}`}>
      <AvatarImage src={avatarUrl || undefined} alt={fullName || "User"} />
      <AvatarFallback className="bg-primary/10">
        {fullName ? (
          <span className={`font-semibold text-primary ${textSizes[size]}`}>{fullName.charAt(0).toUpperCase()}</span>
        ) : (
          <User className={`text-primary ${iconSizes[size]}`} aria-hidden="true" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
