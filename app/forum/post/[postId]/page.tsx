import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ReplyForm } from "@/components/reply-form"
import { MessageSquare, ArrowLeft, Pin } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const supabase = await createClient()

  const { data: post } = await supabase.from("forum_posts").select("title").eq("id", postId).single()

  return {
    title: post ? `${post.title} | Forum` : "Forum Post",
    description: "Community discussion on Voices4Minds",
  }
}

export default async function ForumPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from("forum_posts")
    .select(
      `
      *,
      author:profiles(full_name, avatar_url),
      category:forum_categories(name, slug)
    `,
    )
    .eq("id", postId)
    .single()

  if (error || !post) {
    notFound()
  }

  await supabase
    .from("forum_posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", postId)

  const { data: replies } = await supabase
    .from("forum_replies")
    .select(
      `
      *,
      author:profiles(full_name, avatar_url)
    `,
    )
    .eq("post_id", postId)
    .order("created_at", { ascending: true })

  return (
    <div className="container py-8 md:py-12">
      <div className="max-w-4xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/forum">
            <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
            Back to Forum
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 mb-3">
              {post.is_pinned && <Pin className="h-4 w-4 text-primary" aria-label="Pinned post" />}
              <Badge variant="outline">{post.category?.name}</Badge>
              <span className="text-sm text-muted-foreground">•</span>
              <span className="text-sm text-muted-foreground">{new Date(post.created_at).toLocaleDateString()}</span>
            </div>
            <CardTitle className="text-3xl">{post.title}</CardTitle>
            <CardDescription>
              <div className="flex items-center gap-2 mt-2">
                <UserAvatar avatarUrl={post.author?.avatar_url} fullName={post.author?.full_name} size="sm" />
                <span>Posted by {post.author?.full_name || "Anonymous"}</span>
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
            <div className="flex items-center gap-4 mt-6 pt-6 border-t text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" aria-hidden="true" />
                <span>
                  {replies?.length || 0} {replies?.length === 1 ? "reply" : "replies"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {replies && replies.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Replies</h2>
            {replies.map((reply) => (
              <Card key={reply.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <UserAvatar avatarUrl={reply.author?.avatar_url} fullName={reply.author?.full_name} size="sm" />
                      <CardDescription>
                        {reply.author?.full_name || "Anonymous"} • {new Date(reply.created_at).toLocaleDateString()} at{" "}
                        {new Date(reply.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                </CardContent>
              </Card>
            ))}
          </section>
        )}

        {user ? (
          <Card>
            <CardHeader>
              <CardTitle>Add Your Reply</CardTitle>
              <CardDescription>Share your thoughts or support with the community</CardDescription>
            </CardHeader>
            <CardContent>
              <ReplyForm postId={postId} userId={user.id} />
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">Sign in to reply to this post</p>
              <Button asChild>
                <Link href="/auth/login">Sign In</Link>
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
