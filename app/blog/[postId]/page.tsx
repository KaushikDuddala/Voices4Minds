import { createClient } from "@/lib/supabase/server"
import { notFound } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeft, Calendar, Eye } from "lucide-react"
import { UserAvatar } from "@/components/user-avatar"

export async function generateMetadata({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const supabase = await createClient()

  const { data: post } = await supabase.from("blog_posts").select("title, excerpt").eq("id", postId).single()

  return {
    title: post ? `${post.title} | Blog` : "Blog Post",
    description: post?.excerpt || "Read this article on Voices4Minds",
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ postId: string }> }) {
  const { postId } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: post, error } = await supabase
    .from("blog_posts")
    .select(
      `
      *,
      author:profiles(full_name, avatar_url)
    `,
    )
    .eq("id", postId)
    .single()

  if (error || !post) {
    notFound()
  }

  if (!post.is_published && post.author_id !== user?.id) {
    notFound()
  }

  await supabase
    .from("blog_posts")
    .update({ view_count: post.view_count + 1 })
    .eq("id", postId)

  return (
    <div className="flex items-center justify-center min-h-screen py-8 md:py-12">
      <div className="container w-full">
        <article className="max-w-4xl mx-auto space-y-8">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/blog">
              <ArrowLeft className="h-4 w-4 mr-2" aria-hidden="true" />
              Back to Blog
            </Link>
          </Button>

          <header className="space-y-4">
            {post.category && <Badge variant="secondary">{post.category}</Badge>}
            {!post.is_published && (
              <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                Draft
              </Badge>
            )}
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">{post.title}</h1>
            {post.excerpt && <p className="text-xl text-muted-foreground leading-relaxed">{post.excerpt}</p>}

            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
              <div className="flex items-center gap-2">
                <UserAvatar avatarUrl={post.author?.avatar_url} fullName={post.author?.full_name} size="sm" />
                <span>{post.author?.full_name || "Anonymous"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" aria-hidden="true" />
                <span>
                  {post.published_at
                    ? new Date(post.published_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : "Unpublished"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Eye className="h-4 w-4" aria-hidden="true" />
                <span>{post.view_count} views</span>
              </div>
            </div>
          </header>

          {post.featured_image && (
            <div className="aspect-video w-full overflow-hidden rounded-lg">
              <img src={post.featured_image || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
            </div>
          )}

          <Card>
            <CardContent className="pt-8">
              <div className="prose prose-lg max-w-none">
                <p className="text-base leading-relaxed whitespace-pre-wrap">{post.content}</p>
              </div>
            </CardContent>
          </Card>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag: string, idx: number) => (
                <Badge key={idx} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          <Card className="bg-muted/50">
            <CardHeader>
              <CardTitle>About the Author</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-start gap-4">
                <UserAvatar avatarUrl={post.author?.avatar_url} fullName={post.author?.full_name} size="xl" />
                <div>
                  <p className="font-semibold text-lg">{post.author?.full_name || "Anonymous"}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Community member sharing their mental health journey
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Continue Your Journey</CardTitle>
              <CardDescription>Explore more resources and support</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              <Button asChild variant="outline">
                <Link href="/blog">Read More Articles</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/resources">View Resources</Link>
              </Button>
              <Button asChild>
                <Link href="/appointments">Find a Counselor</Link>
              </Button>
            </CardContent>
          </Card>
        </article>
      </div>
    </div>
  )
}
