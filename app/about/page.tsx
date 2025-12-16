// File 62: app/about/page.tsx
/**
 * About Page - Company information, mission, team, and values
 */

import { Metadata } from 'next';
import Link from 'next/link';
import { FluidContainer } from '@/components/layout/FluidContainer';
import { GridContainer } from '@/components/layout/GridContainer';
import TeamMember from '@/components/about/TeamMember';
import ValueCard from '@/components/about/ValueCard';
import AchievementCard from '@/components/about/AchievementCard';
import Timeline from '@/components/about/Timeline';

export const metadata: Metadata = {
  title: 'About Us - English Communities PK',
  description: 'Learn about our mission to make English learning accessible for everyone in Pakistan. Meet our team and see our journey.',
  keywords: ['about us', 'English Pakistan', 'language mission', 'team', 'values'],
  openGraph: {
    title: 'About Us - English Communities PK',
    description: 'Learn about our mission to make English learning accessible for everyone in Pakistan. Meet our team and see our journey.',
    type: 'website',
  },
};

export default function AboutPage() {
  // Team members data
  const teamMembers = [
    {
      id: 1,
      name: 'Dr. Sarah Ahmed',
      role: 'Founder & CEO',
      bio: 'PhD in Linguistics with 15+ years experience in language education. Passionate about making English accessible to all Pakistanis.',
      image: '/team/sarah.jpg',
      social: {
        twitter: 'SarahLinguist',
        linkedin: 'sarah-ahmed-linguistics',
      },
      expertise: ['Linguistics', 'Curriculum Design', 'Teacher Training']
    },
    {
      id: 2,
      name: 'Ali Raza',
      role: 'Head of Content',
      bio: 'MA in English Literature. Former university lecturer with expertise in creating engaging learning materials.',
      image: '/team/ali.jpg',
      social: {
        twitter: 'AliWriterPK',
        linkedin: 'aliraza-content',
      },
      expertise: ['Content Creation', 'Creative Writing', 'Educational Design']
    },
    {
      id: 3,
      name: 'Fatima Khan',
      role: 'Community Manager',
      bio: 'Specialist in online community building. Creates welcoming spaces for learners to connect and grow together.',
      image: '/team/fatima.jpg',
      social: {
        twitter: 'FatimaConnect',
        linkedin: 'fatimakhan-community',
      },
      expertise: ['Community Building', 'User Engagement', 'Social Media']
    },
    {
      id: 4,
      name: 'Bilal Mahmood',
      role: 'Tech Lead',
      bio: 'Full-stack developer passionate about using technology to enhance learning experiences.',
      image: '/team/bilal.jpg',
      social: {
        twitter: 'BilalDevPK',
        github: 'bilal-tech',
      },
      expertise: ['Web Development', 'EdTech', 'UX/UI Design']
    },
    {
      id: 5,
      name: 'Ayesha Malik',
      role: 'Learning Strategist',
      bio: 'Expert in language acquisition and instructional design. Focuses on effective learning methodologies.',
      image: '/team/ayesha.jpg',
      social: {
        twitter: 'AyeshaLearn',
        linkedin: 'ayeshamalik-learning',
      },
      expertise: ['Learning Science', 'Instructional Design', 'Assessment']
    },
    {
      id: 6,
      name: 'Omar Farooq',
      role: 'Partnerships Director',
      bio: 'Connects with educational institutions and organizations to expand our reach and impact.',
      image: '/team/omar.jpg',
      social: {
        twitter: 'OmarEduConnect',
        linkedin: 'omarfarooq-partnerships',
      },
      expertise: ['Partnerships', 'Business Development', 'Education Policy']
    }
  ];
  
  // Company values
  const values = [
    {
      title: 'Accessibility',
      description: 'Making English learning available to everyone, regardless of background or location.',
      icon: '🌍',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Quality',
      description: 'Providing high-quality, research-based learning materials and resources.',
      icon: '⭐',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      title: 'Community',
      description: 'Building supportive networks where learners can grow together.',
      icon: '👥',
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Innovation',
      description: 'Continuously improving and innovating our teaching methods and technology.',
      icon: '💡',
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Empowerment',
      description: 'Empowering individuals through language skills for better opportunities.',
      icon: '🚀',
      color: 'from-orange-500 to-red-500'
    },
    {
      title: 'Inclusivity',
      description: 'Creating welcoming spaces for learners from all backgrounds and abilities.',
      icon: '❤️',
      color: 'from-red-500 to-pink-500'
    }
  ];
  
  // Achievements
  const achievements = [
    {
      year: '2020',
      title: 'Platform Launch',
      description: 'Launched with 1,000 registered users in the first month.',
      icon: '🚀'
    },
    {
      year: '2021',
      title: '10K Members',
      description: 'Reached 10,000 active community members across Pakistan.',
      icon: '👥'
    },
    {
      year: '2022',
      title: 'Mobile App',
      description: 'Launched mobile app for on-the-go learning.',
      icon: '📱'
    },
    {
      year: '2023',
      title: '50K Resources',
      description: 'Published 50,000+ free learning resources.',
      icon: '📚'
    },
    {
      year: '2024',
      title: 'National Recognition',
      description: 'Recognized by Ministry of Education for contribution to language education.',
      icon: '🏆'
    }
  ];
  
  // Timeline events
  const timelineEvents = [
    {
      date: 'January 2020',
      title: 'Foundation',
      description: 'English Communities PK was founded with a mission to make English learning accessible.'
    },
    {
      date: 'June 2020',
      title: 'First 1,000 Users',
      description: 'Reached our first 1,000 registered users within six months of launch.'
    },
    {
      date: 'December 2020',
      title: 'Community Forums Launch',
      description: 'Launched discussion forums for peer-to-peer learning and support.'
    },
    {
      date: 'March 2021',
      title: 'Mobile App Release',
      description: 'Released iOS and Android apps for mobile learning.'
    },
    {
      date: 'September 2021',
      title: '10K Members Milestone',
      description: 'Celebrated 10,000 active community members.'
    },
    {
      date: 'January 2022',
      title: 'Resource Library Launch',
      description: 'Launched comprehensive free resource library with 10,000+ materials.'
    },
    {
      date: 'June 2022',
      title: 'Partner Program',
      description: 'Started partnerships with schools and educational institutions.'
    },
    {
      date: 'December 2022',
      title: '50K Downloads',
      description: 'Resources downloaded 50,000+ times by learners.'
    },
    {
      date: 'March 2023',
      title: 'New Learning Platform',
      description: 'Launched redesigned platform with improved learning features.'
    },
    {
      date: 'Present',
      title: 'Growing Community',
      description: 'Continuing to grow and serve English learners across Pakistan.'
    }
  ];
  
  return (
    <FluidContainer>
      <div className="theme-transition bg-background">
        {/* Hero Section */}
        <section className="relative py-20 bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
          <div className="absolute inset-0 bg-black/20" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                About English Communities PK
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90">
                Empowering Pakistan through English language education. 
                Making quality learning accessible to everyone.
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-6">
                <span>Our Mission</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Making English Learning Accessible to All Pakistanis
              </h2>
              <div className="prose prose-lg mx-auto">
                <p className="text-xl text-muted-foreground mb-8">
                  English Communities PK was founded with a simple but powerful vision: 
                  to make quality English education accessible to every Pakistani, 
                  regardless of their background, location, or financial situation.
                </p>
                <p className="text-xl text-muted-foreground">
                  We believe that language skills open doors to better education, 
                  career opportunities, and global connections. Our platform combines 
                  expert-led content with community support to create a comprehensive 
                  learning ecosystem for Pakistani English learners.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <h2 className="text-4xl font-bold text-center mb-12">
              Our Core Values
            </h2>
            
            <GridContainer columns={3}>
              {values.map((value) => (
                <ValueCard
                  key={value.title}
                  value={value}
                />
              ))}
            </GridContainer>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <span>Our Team</span>
              </div>
              <h2 className="text-4xl font-bold mb-6">
                Meet Our Dedicated Team
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Passionate educators, technologists, and community builders 
                working together to transform English learning in Pakistan.
              </p>
            </div>
            
            <GridContainer columns={3}>
              {teamMembers.map((member) => (
                <TeamMember
                  key={member.id}
                  member={member}
                />
              ))}
            </GridContainer>
          </div>
        </section>
        
        {/* Timeline Section */}
        <section className="py-16 bg-gradient-to-r from-primary/10 to-secondary/10">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">
                Our Journey
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                From a small startup to Pakistan's largest English learning community.
              </p>
            </div>
            
            <Timeline events={timelineEvents} />
          </div>
        </section>
        
        {/* Achievements Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">
                Milestones & Achievements
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              {achievements.map((achievement) => (
                <AchievementCard
                  key={achievement.year}
                  achievement={achievement}
                />
              ))}
            </div>
            
            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { number: '100K+', label: 'Community Members' },
                { number: '50K+', label: 'Learning Resources' },
                { number: '500+', label: 'Cities & Towns' },
                { number: '24/7', label: 'Active Community' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-primary mb-2">
                    {stat.number}
                  </div>
                  <div className="text-muted-foreground">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Partners Section */}
        <section className="py-16 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold mb-6">
                Our Partners & Supporters
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Working with leading educational institutions and organizations 
                to expand our impact.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
              {[
                { name: 'HEC Pakistan', logo: '/partners/hec.png' },
                { name: 'PSF', logo: '/partners/psf.png' },
                { name: 'EdTech Pakistan', logo: '/partners/edtech.png' },
                { name: 'Literacy Foundation', logo: '/partners/literacy.png' },
                { name: 'Digital Pakistan', logo: '/partners/digital.png' },
                { name: 'Youth Education', logo: '/partners/youth.png' }
              ].map((partner) => (
                <div
                  key={partner.name}
                  className="flex items-center justify-center p-6 bg-background rounded-lg"
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🏢</div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {partner.name}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Join Us Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold mb-6">
                Join Our Mission
              </h2>
              <p className="text-xl mb-8 opacity-90">
                Whether you're a learner, educator, or supporter, 
                there's a place for you in our community.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/register"
                  className="px-8 py-3 bg-white text-primary font-semibold rounded-lg hover:bg-white/90 transition-colors"
                >
                  Join as Learner
                </Link>
                <Link
                  href="/community/volunteer"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Volunteer
                </Link>
                <Link
                  href="/contact"
                  className="px-8 py-3 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
                >
                  Partner With Us
                </Link>
              </div>
            </div>
          </div>
        </section>
        
        {/* Contact Info */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-4 mx-auto">
                  📧
                </div>
                <h3 className="text-xl font-bold mb-2">Email Us</h3>
                <p className="text-muted-foreground">
                  <a href="mailto:contact@english.communities.pk" className="hover:text-primary">
                    contact@english.communities.pk
                  </a>
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-4 mx-auto">
                  📍
                </div>
                <h3 className="text-xl font-bold mb-2">Visit Us</h3>
                <p className="text-muted-foreground">
                  123 Learning Street<br />
                  Lahore, Pakistan
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl mb-4 mx-auto">
                  📞
                </div>
                <h3 className="text-xl font-bold mb-2">Call Us</h3>
                <p className="text-muted-foreground">
                  <a href="tel:+923001234567" className="hover:text-primary">
                    +92 300 1234567
                  </a>
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </FluidContainer>
  );
}