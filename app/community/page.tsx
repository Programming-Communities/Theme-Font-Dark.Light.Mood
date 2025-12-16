// File 60: app/community/page.tsx
/**
 * Community Page - Showcase community features, members, and activities
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { getCommunityStats, getRecentActivities, getTopMembers } from '@/lib/wordpress/api';
import { FluidContainer } from '@/components/layout/FluidContainer';
import { GridContainer } from '@/components/layout/GridContainer';
import CommunityStats from '@/components/community/CommunityStats';
import ActivityFeed from '@/components/community/ActivityFeed';
import MemberCard from '@/components/community/MemberCard';
import DiscussionList from '@/components/community/DiscussionList';
import ResourceList from '@/components/community/ResourceList';
import EventCalendar from '@/components/community/EventCalendar';

export const metadata: Metadata = {
  title: 'Community - English Learners in Pakistan',
  description: 'Join Pakistan\'s largest English learning community. Connect with learners, participate in discussions, and grow together.',
  keywords: ['English community', 'language learners', 'study groups', 'discussions', 'Pakistan English'],
  openGraph: {
    title: 'Community - English Learners in Pakistan',
    description: 'Join Pakistan\'s largest English learning community. Connect with learners, participate in discussions, and grow together.',
    type: 'website',
  },
};

export default async function CommunityPage() {
  try {
    // Fetch community data
    const [stats, activities, topMembers] = await Promise.all([
      getCommunityStats(),
      getRecentActivities(),
      getTopMembers({ limit: 8 }),
    ]);
    
    return (
      <FluidContainer>
        <div className="theme-transition bg-background">
          {/* Hero Section */}
          <section className="relative py-20 bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="container mx-auto px-4 relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h1 className="text-5xl md:text-6xl font-bold mb-6">
                  Welcome to Our Community
                </h1>
                <p className="text-xl md:text-2xl mb-8 opacity-90">
                  Join thousands of English learners in Pakistan. 
                  Learn together, grow together, and achieve fluency together.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Join Free
                  </Link>
                  <Link
                    href="/community/discussions"
                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Explore Discussions
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          {/* Community Stats */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <CommunityStats stats={stats} />
            </div>
          </section>
          
          {/* Main Features */}
          <section className="py-12 bg-card">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Community Features
              </h2>
              
              <GridContainer columns={3}>
                {[
                  {
                    title: 'Discussion Forums',
                    description: 'Ask questions, share insights, and discuss English learning topics with community members.',
                    icon: '💬',
                    features: ['Topic-based discussions', 'Q&A sections', 'Peer support', 'Expert answers'],
                    link: '/community/discussions',
                    color: 'from-blue-500 to-cyan-500'
                  },
                  {
                    title: 'Study Groups',
                    description: 'Join or create study groups based on your level, goals, and schedule.',
                    icon: '👥',
                    features: ['Level-based groups', 'Goal-oriented learning', 'Accountability partners', 'Weekly meetings'],
                    link: '/community/groups',
                    color: 'from-green-500 to-emerald-500'
                  },
                  {
                    title: 'Resource Sharing',
                    description: 'Access and share learning materials, notes, and resources with the community.',
                    icon: '📚',
                    features: ['Study materials', 'Practice exercises', 'Grammar guides', 'Vocabulary lists'],
                    link: '/community/resources',
                    color: 'from-purple-500 to-pink-500'
                  },
                  {
                    title: 'Live Events',
                    description: 'Participate in webinars, workshops, and speaking practice sessions.',
                    icon: '🎤',
                    features: ['Weekly webinars', 'Speaking clubs', 'Writing workshops', 'Guest speakers'],
                    link: '/community/events',
                    color: 'from-orange-500 to-red-500'
                  },
                  {
                    title: 'Progress Tracking',
                    description: 'Track your learning progress, earn badges, and celebrate achievements.',
                    icon: '📈',
                    features: ['Progress dashboard', 'Achievement badges', 'Learning streaks', 'Level progression'],
                    link: '/community/progress',
                    color: 'from-yellow-500 to-amber-500'
                  },
                  {
                    title: 'Peer Review',
                    description: 'Get feedback on your writing and speaking from fellow learners and experts.',
                    icon: '✍️',
                    features: ['Writing feedback', 'Pronunciation checks', 'Grammar corrections', 'Peer evaluations'],
                    link: '/community/review',
                    color: 'from-indigo-500 to-blue-500'
                  }
                ].map((feature) => (
                  <Link
                    key={feature.title}
                    href={feature.link}
                    className="block p-6 rounded-xl bg-background hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center text-2xl mb-4`}>
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                    <p className="text-muted-foreground mb-4">
                      {feature.description}
                    </p>
                    <ul className="space-y-2 mb-6">
                      {feature.features.map((item) => (
                        <li key={item} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="text-primary font-semibold">
                      Explore →
                    </div>
                  </Link>
                ))}
              </GridContainer>
            </div>
          </section>
          
          {/* Activity Feed & Top Members */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Activity Feed */}
                <div className="lg:col-span-2">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold mb-6">
                      Recent Community Activity
                    </h2>
                    <ActivityFeed 
                      activities={activities}
                      limit={10}
                      showUserAvatar={true}
                      showTimestamp={true}
                    />
                  </div>
                  
                  {/* Discussions */}
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold">
                        Hot Discussions
                      </h2>
                      <Link
                        href="/community/discussions"
                        className="text-primary hover:underline"
                      >
                        View All →
                      </Link>
                    </div>
                    <DiscussionList 
                      limit={5}
                      showCategory={true}
                      showReplies={true}
                      showVotes={true}
                    />
                  </div>
                </div>
                
                {/* Sidebar */}
                <div className="lg:col-span-1">
                  <div className="sticky top-24 space-y-8">
                    {/* Top Members */}
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-lg font-bold">
                          Top Community Members
                        </h3>
                        <Link
                          href="/community/members"
                          className="text-sm text-primary hover:underline"
                        >
                          View All
                        </Link>
                      </div>
                      <div className="space-y-4">
                        {topMembers.map((member, index) => (
                          <MemberCard
                            key={member.id}
                            member={member}
                            rank={index + 1}
                            showPoints={true}
                            showBadges={true}
                            compact={true}
                          />
                        ))}
                      </div>
                    </div>
                    
                    {/* Community Resources */}
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold mb-6">
                        Popular Resources
                      </h3>
                      <ResourceList 
                        limit={5}
                        showDownloads={true}
                        showRating={true}
                      />
                    </div>
                    
                    {/* Event Calendar */}
                    <div className="bg-card rounded-xl p-6 shadow-sm">
                      <h3 className="text-lg font-bold mb-6">
                        Upcoming Events
                      </h3>
                      <EventCalendar 
                        view="mini"
                        limit={3}
                        showDescription={false}
                      />
                      <Link
                        href="/community/events"
                        className="block mt-4 text-center text-primary hover:underline"
                      >
                        View Full Calendar →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          
          {/* Learning Levels */}
          <section className="py-12 bg-gradient-to-r from-primary/10 to-secondary/10">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                Find Your Learning Level
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  {
                    level: 'Beginner',
                    description: 'Just starting with English? Build your foundation here.',
                    members: '2,500+ learners',
                    features: ['Basic vocabulary', 'Simple grammar', 'Everyday phrases', 'Pronunciation basics'],
                    color: 'from-green-400 to-emerald-600'
                  },
                  {
                    level: 'Intermediate',
                    description: 'Can hold basic conversations? Take it to the next level.',
                    members: '3,800+ learners',
                    features: ['Conversation practice', 'Complex grammar', 'Idioms & phrases', 'Writing skills'],
                    color: 'from-blue-400 to-cyan-600'
                  },
                  {
                    level: 'Advanced',
                    description: 'Fluent but want refinement? Master advanced concepts.',
                    members: '1,200+ learners',
                    features: ['Advanced vocabulary', 'Business English', 'Academic writing', 'Cultural nuances'],
                    color: 'from-purple-400 to-pink-600'
                  },
                  {
                    level: 'Expert',
                    description: 'Teaching or professional use? Join our expert community.',
                    members: '500+ members',
                    features: ['Teaching resources', 'Professional development', 'Mentorship', 'Research'],
                    color: 'from-orange-400 to-red-600'
                  }
                ].map((level) => (
                  <div
                    key={level.level}
                    className="bg-background rounded-xl p-6 shadow-lg"
                  >
                    <div className={`h-2 rounded-full bg-gradient-to-r ${level.color} mb-6`} />
                    <h3 className="text-2xl font-bold mb-3">{level.level}</h3>
                    <p className="text-muted-foreground mb-4">
                      {level.description}
                    </p>
                    <div className="text-sm text-primary font-semibold mb-4">
                      {level.members}
                    </div>
                    <ul className="space-y-2 mb-6">
                      {level.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-sm">
                          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={`/community/levels/${level.level.toLowerCase()}`}
                      className="block w-full py-2 text-center rounded-lg bg-primary text-white hover:bg-primary-dark transition-colors"
                    >
                      Join Level
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Testimonials */}
          <section className="py-12">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">
                What Our Members Say
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                  {
                    name: 'Ahmed Raza',
                    role: 'Intermediate Learner',
                    avatar: 'AR',
                    content: 'This community transformed my English learning journey. The support and resources are incredible!',
                    progress: 'From A1 to B1 in 6 months'
                  },
                  {
                    name: 'Sara Khan',
                    role: 'University Student',
                    avatar: 'SK',
                    content: 'The study groups helped me improve my academic writing significantly. Highly recommended!',
                    progress: 'IELTS 7.5 achieved'
                  },
                  {
                    name: 'Bilal Ahmed',
                    role: 'Professional',
                    avatar: 'BA',
                    content: 'Business English resources and networking opportunities have been invaluable for my career.',
                    progress: 'Promoted to international team'
                  }
                ].map((testimonial) => (
                  <div
                    key={testimonial.name}
                    className="bg-card rounded-xl p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <h4 className="font-bold">{testimonial.name}</h4>
                        <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-muted-foreground mb-6 italic">
                      "{testimonial.content}"
                    </p>
                    <div className="text-sm text-primary font-semibold">
                      {testimonial.progress}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
          
          {/* Call to Action */}
          <section className="py-12 bg-gradient-primary text-white">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-4xl font-bold mb-6">
                  Ready to Join Our Community?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                  Start your English learning journey with thousands of supportive learners.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/auth/register"
                    className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                  >
                    Create Free Account
                  </Link>
                  <Link
                    href="/community/tour"
                    className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                  >
                    Take a Tour
                  </Link>
                </div>
                <p className="text-sm opacity-75 mt-6">
                  Already a member?{' '}
                  <Link href="/auth/login" className="underline hover:no-underline">
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>
          </section>
        </div>
      </FluidContainer>
    );
  } catch (error) {
    console.error('Error loading community page:', error);
    return (
      <FluidContainer>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Community Page</h1>
            <p className="text-muted-foreground">
              Join Pakistan's largest English learning community.
            </p>
          </div>
        </div>
      </FluidContainer>
    );
  }
}