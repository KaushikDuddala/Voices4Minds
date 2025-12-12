import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { MessageSquare, Users, Plus, Pin, ArrowRight, MessageCircle } from "lucide-react"
import { ScrollAnimation } from "@/components/scroll-animation"
import { UserAvatar } from "@/components/user-avatar"

export const metadata = {
  title: "Community Forum | Voices4Minds",
  description:
    "Join our supportive community. Share experiences, ask questions, and connect with others on their mental health journey.",
}

export default async function ForumPage() {
  const supabase = await createClient()

  const { data: categories } = await supabase.from("forum_categories").select("*").order("name")

  const { data: recentPosts } = await supabase
    .from("forum_posts")
    .select(`
      *,
      author:profiles(full_name, avatar_url),
      category:forum_categories(name, slug)
    `)
    .order("created_at", { ascending: false })
    .limit(10)

  const postsWithCounts = await Promise.all(
    (categories || []).map(async (category) => {
      const { count } = await supabase
        .from("forum_posts")
        .select("*", { count: "exact", head: true })
        .eq("category_id", category.id)
      return { ...category, post_count: count || 0 }
    }),
  )

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <div className="space-y-16">
        {/* Header */}
        <ScrollAnimation className="max-w-3xl mx-auto text-center space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold">Community Forum</h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            A safe space to share experiences, ask questions, and support one another
          </p>
          <div className="pt-4">
            <Button asChild size="lg" className="btn-animate">
              <Link href="/forum/new">
                <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                Start a Discussion
              </Link>
            </Button>
          </div>
        </ScrollAnimation>

        {/* Categories */}
        <section>
          <ScrollAnimation className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Browse Categories</h2>
          </ScrollAnimation>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {postsWithCounts.map((category, index) => (
              <ScrollAnimation key={category.id} delay={index * 50}>
                <Card className="h-full card-animate border-2 hover:border-primary/50">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center justify-between text-lg">
                      <span>{category.name}</span>
                      <Badge variant="secondary">{category.post_count}</Badge>
                    </CardTitle>
                    <CardDescription className="text-sm">{category.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" size="sm" asChild className="w-full bg-transparent btn-animate group">
                      <Link href={`/forum/category/${category.slug}`}>
                        Browse Posts
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section>
          <ScrollAnimation className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-semibold">Recent Discussions</h2>
          </ScrollAnimation>
          {recentPosts && recentPosts.length > 0 ? (
            <div className="space-y-4 max-w-4xl mx-auto">
              {recentPosts.map((post, index) => (
                <ScrollAnimation key={post.id} delay={index * 50}>
                  <Card className="card-animate border-2 hover:border-primary/50">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-3">
                            {post.is_pinned && (
                              <Pin className="h-4 w-4 text-primary flex-shrink-0" aria-label="Pinned post" />
                            )}
                            <Badge variant="outline" className="text-xs">
                              {post.category?.name}
                            </Badge>
                          </div>
                          <CardTitle className="text-xl">
                            <Link href={`/forum/post/${post.id}`} className="hover:text-primary transition-colors">
                              {post.title}
                            </Link>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            <div className="flex items-center gap-2">
                              <UserAvatar
                                avatarUrl={post.author?.avatar_url}
                                fullName={post.author?.full_name}
                                size="sm"
                              />
                              <span className="text-sm">
                                By {post.author?.full_name || "Anonymous"} •{" "}
                                {new Date(post.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MessageSquare className="h-4 w-4" aria-hidden="true" />
                            <span>0</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" aria-hidden="true" />
                            <span>{post.view_count}</span>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">{post.content}</p>
                    </CardContent>
                  </Card>
                </ScrollAnimation>
              ))}
            </div>
          ) : (
            <ScrollAnimation>
              <Card className="max-w-2xl mx-auto">
                <CardContent className="py-16 text-center">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" aria-hidden="true" />
                  <h3 className="text-2xl font-semibold mb-3">No posts yet</h3>
                  <p className="text-muted-foreground mb-8 text-lg">Be the first to start a discussion!</p>
                  <Button asChild size="lg" className="btn-animate">
                    <Link href="/forum/new">Create First Post</Link>
                  </Button>
                </CardContent>
              </Card>
            </ScrollAnimation>
          )}
        </section>

        {/* Discord Community Card */}
        <ScrollAnimation delay={100}>
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20 max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <MessageCircle className="h-12 w-12 text-primary" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">Join Our Discord Community</CardTitle>
              <CardDescription className="text-base">
                Connect with others in real-time, participate in group discussions, and get instant support from our
                community
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button asChild size="lg" className="btn-animate">
                <a href="https://discord.gg/Voices4Minds" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5 mr-2" aria-hidden="true" />
                  Join Discord Server
                </a>
              </Button>
            </CardContent>
          </Card>
        </ScrollAnimation>

        {/* Community Guidelines */}
        <ScrollAnimation>
          <Card className="bg-muted/50 max-w-3xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-xl">Community Guidelines</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground max-w-2xl mx-auto">
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Be respectful and supportive of all community members
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Share your experiences, but respect others&apos; privacy
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Avoid giving medical advice—encourage professional help instead
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Report any concerning content to moderators
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  Remember: this is a support space, not a crisis service. Call 988 for emergencies
                </li>
              </ul>
            </CardContent>
          </Card>
        </ScrollAnimation>
      </div>
    </div>
  )
}
