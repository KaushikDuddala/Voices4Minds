import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { BookOpen, Calendar, Plus, ArrowRight, Edit } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { UserAvatar } from "@/components/user-avatar"

async function DraftsSection({ userId }: { userId: string }) {
  const supabase = await createClient()

  const { data: drafts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(full_name)
    `)
    .eq("author_id", userId)
    .eq("is_published", false)
    .order("updated_at", { ascending: false })

  if (!drafts || drafts.length === 0) {
    return null
  }

  return (
    <ScrollAnimation>
      <Card className="border-2 bg-yellow-50/50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900">
        <CardHeader>
          <CardTitle className="text-2xl">Your Drafts</CardTitle>
          <CardDescription>Unpublished articles you're working on</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            {drafts.map((draft, index) => (
              <ScrollAnimation key={draft.id} delay={index * 50}>
                <div className="flex flex-col h-full p-4 border rounded-lg bg-background hover:border-primary/50 transition-colors">
                  <h3 className="font-semibold text-lg line-clamp-2 mb-2">{draft.title || "Untitled"}</h3>
                  {draft.excerpt && (
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3 flex-1">{draft.excerpt}</p>
                  )}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                    <Calendar className="h-3 w-3" aria-hidden="true" />
                    <span>Updated {new Date(draft.updated_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" asChild className="flex-1 btn-animate bg-transparent">
                      <Link href={`/blog/${draft.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" aria-hidden="true" />
                        Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" asChild className="flex-1 btn-animate bg-transparent">
                      <Link href={`/blog/${draft.id}`}>Preview</Link>
                    </Button>
                  </div>
                </div>
              </ScrollAnimation>
            ))}
          </div>
        </CardContent>
      </Card>
    </ScrollAnimation>
  )
}

export const metadata = {
  title: "Mental Health Blog | Voices4Minds",
  description: "Read articles, personal stories, and expert advice about mental health, wellness, and recovery.",
}

export default async function BlogPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { data: posts } = await supabase
    .from("blog_posts")
    .select(`
      *,
      author:profiles(full_name, avatar_url)
    `)
    .eq("is_published", true)
    .order("published_at", { ascending: false })

  const categories = Array.from(new Set(posts?.map((p) => p.category).filter(Boolean)))

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="space-y-16">
        {/* Header */}
        <ScrollAnimation className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Mental Health Blog</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Stories, insights, and practical advice for your wellness journey
          </p>
          {user && (
            <div className="pt-4">
              <Button asChild size="lg" className="btn-animate">
                <Link href="/blog/new">
                  <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                  Write an Article
                </Link>
              </Button>
            </div>
          )}
        </ScrollAnimation>

        {/* Categories Filter */}
        {categories.length > 0 && (
          <ScrollAnimation className="flex flex-wrap gap-3 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-primary/10 transition-colors px-4 py-2">
              All Posts
            </Badge>
            {categories.map((category) => (
              <Badge
                key={category}
                variant="secondary"
                className="cursor-pointer hover:bg-primary/20 transition-colors px-4 py-2"
              >
                {category}
              </Badge>
            ))}
          </ScrollAnimation>
        )}

        {/* Blog Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, index) => (
              <ScrollAnimation key={post.id} delay={index * 100}>
                <Card className="flex flex-col h-full card-animate border-2 hover:border-primary/50">
                  {post.featured_image && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg bg-muted">
                      <img
                        src={post.featured_image || "/placeholder.svg"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <CardHeader className="flex-1 pb-4">
                    {post.category && (
                      <Badge variant="secondary" className="mb-3 w-fit">
                        {post.category}
                      </Badge>
                    )}
                    <CardTitle className="text-xl line-clamp-2">
                      <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                        {post.title}
                      </Link>
                    </CardTitle>
                    {post.excerpt && (
                      <CardDescription className="line-clamp-3 leading-relaxed mt-3 text-base">
                        {post.excerpt}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <UserAvatar avatarUrl={post.author?.avatar_url} fullName={post.author?.full_name} size="sm" />
                        <span>{post.author?.full_name || "Anonymous"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" aria-hidden="true" />
                        <span>{post.published_at ? new Date(post.published_at).toLocaleDateString() : "Draft"}</span>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent btn-animate group">
                      <Link href={`/blog/${post.id}`}>
                        Read More
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        ) : (
          <ScrollAnimation>
            <Card className="max-w-2xl mx-auto">
              <CardContent className="py-16 text-center">
                <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" aria-hidden="true" />
                <h3 className="text-2xl font-semibold mb-3">No blog posts yet</h3>
                <p className="text-muted-foreground mb-8 text-lg">Be the first to share your story or insights!</p>
                {user && (
                  <Button asChild size="lg" className="btn-animate">
                    <Link href="/blog/new">Write First Article</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          </ScrollAnimation>
        )}

        {/* Drafts Section */}
        {user && <DraftsSection userId={user.id} />}

        {/* Info Section */}
        <ScrollAnimation>
          <Card className="bg-muted/50 max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Share Your Story</CardTitle>
              <CardDescription className="text-base">
                Your experiences can help others on their mental health journey
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
                We encourage community members to share their stories, insights, and tips for mental wellness. Whether
                it&apos;s about overcoming challenges, coping strategies that worked for you, or simply your journey
                with mental health—your voice matters.
              </p>
              {!user ? (
                <Button asChild size="lg" className="btn-animate">
                  <Link href="/auth/sign-up">Sign Up to Write</Link>
                </Button>
              ) : (
                <Button asChild size="lg" className="btn-animate">
                  <Link href="/blog/new">Start Writing</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  )
}
