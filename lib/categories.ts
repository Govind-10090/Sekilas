import { 
  Briefcase, 
  Cpu, 
  Trophy, 
  Film, 
  Heart, 
  FlaskConical, 
  Globe, 
  TrendingUp,
  Newspaper,
  Users,
  Car,
  Plane,
  GraduationCap,
  Shield,
  Leaf,
  DollarSign,
  Building2,
  Palette,
  Gamepad2,
  Camera,
  Music,
  BookOpen,
  Zap,
  Wifi
} from 'lucide-react'

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  icon: any
  color: string
  bgColor: string
  borderColor: string
  subcategories: string[]
  keywords: string[]
  priority: number
  featured: boolean
}

export const categories: Category[] = [
  {
    id: 'general',
    name: 'General',
    slug: 'general',
    description: 'Top stories and breaking news from around the world',
    icon: Newspaper,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    subcategories: ['breaking', 'world', 'politics', 'society'],
    keywords: ['news', 'breaking', 'world', 'global', 'politics', 'society'],
    priority: 1,
    featured: true
  },
  {
    id: 'technology',
    name: 'Technology',
    slug: 'technology',
    description: 'Latest in tech, AI, software, and digital innovation',
    icon: Cpu,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    subcategories: ['artificial-intelligence', 'software', 'hardware', 'startups', 'cybersecurity'],
    keywords: ['tech', 'ai', 'software', 'hardware', 'startup', 'cyber', 'digital', 'innovation'],
    priority: 2,
    featured: true
  },
  {
    id: 'business',
    name: 'Business',
    slug: 'business',
    description: 'Business news, markets, economy, and entrepreneurship',
    icon: Briefcase,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    subcategories: ['markets', 'economy', 'startups', 'corporate', 'finance'],
    keywords: ['business', 'market', 'economy', 'startup', 'corporate', 'finance', 'investment'],
    priority: 3,
    featured: true
  },
  {
    id: 'sports',
    name: 'Sports',
    slug: 'sports',
    description: 'Sports news, scores, and athletic achievements',
    icon: Trophy,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    subcategories: ['football', 'basketball', 'tennis', 'olympics', 'esports'],
    keywords: ['sports', 'football', 'basketball', 'tennis', 'olympics', 'esports', 'athletics'],
    priority: 4,
    featured: true
  },
  {
    id: 'entertainment',
    name: 'Entertainment',
    slug: 'entertainment',
    description: 'Movies, TV shows, music, and celebrity news',
    icon: Film,
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    subcategories: ['movies', 'television', 'music', 'celebrities', 'gaming'],
    keywords: ['entertainment', 'movie', 'tv', 'music', 'celebrity', 'gaming', 'show'],
    priority: 5,
    featured: true
  },
  {
    id: 'health',
    name: 'Health',
    slug: 'health',
    description: 'Health news, medical research, and wellness tips',
    icon: Heart,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    subcategories: ['medical', 'fitness', 'nutrition', 'mental-health', 'research'],
    keywords: ['health', 'medical', 'fitness', 'nutrition', 'mental', 'wellness', 'research'],
    priority: 6,
    featured: true
  },
  {
    id: 'science',
    name: 'Science',
    slug: 'science',
    description: 'Scientific discoveries, research, and breakthroughs',
    icon: FlaskConical,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-200',
    subcategories: ['space', 'physics', 'biology', 'chemistry', 'environment'],
    keywords: ['science', 'research', 'discovery', 'space', 'physics', 'biology', 'chemistry'],
    priority: 7,
    featured: true
  },
  {
    id: 'world',
    name: 'World',
    slug: 'world',
    description: 'International news and global affairs',
    icon: Globe,
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    subcategories: ['international', 'diplomacy', 'conflicts', 'development', 'culture'],
    keywords: ['world', 'international', 'global', 'diplomacy', 'conflict', 'development'],
    priority: 8,
    featured: false
  },
  {
    id: 'politics',
    name: 'Politics',
    slug: 'politics',
    description: 'Political news, elections, and government affairs',
    icon: Users,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-200',
    subcategories: ['elections', 'government', 'policy', 'legislation', 'campaigns'],
    keywords: ['politics', 'election', 'government', 'policy', 'legislation', 'campaign'],
    priority: 9,
    featured: false
  },
  {
    id: 'environment',
    name: 'Environment',
    slug: 'environment',
    description: 'Climate change, sustainability, and environmental news',
    icon: Leaf,
    color: 'text-emerald-600',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    subcategories: ['climate-change', 'sustainability', 'conservation', 'renewable-energy'],
    keywords: ['environment', 'climate', 'sustainability', 'conservation', 'renewable', 'green'],
    priority: 10,
    featured: false
  },
  {
    id: 'education',
    name: 'Education',
    slug: 'education',
    description: 'Educational news, research, and learning resources',
    icon: GraduationCap,
    color: 'text-amber-600',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    subcategories: ['higher-education', 'k-12', 'online-learning', 'research', 'student-life'],
    keywords: ['education', 'learning', 'school', 'university', 'student', 'research'],
    priority: 11,
    featured: false
  },
  {
    id: 'automotive',
    name: 'Automotive',
    slug: 'automotive',
    description: 'Car news, electric vehicles, and automotive industry',
    icon: Car,
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    borderColor: 'border-slate-200',
    subcategories: ['electric-vehicles', 'autonomous-cars', 'racing', 'industry-news'],
    keywords: ['automotive', 'car', 'vehicle', 'electric', 'autonomous', 'racing'],
    priority: 12,
    featured: false
  },
  {
    id: 'travel',
    name: 'Travel',
    slug: 'travel',
    description: 'Travel news, destinations, and tourism updates',
    icon: Plane,
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-200',
    subcategories: ['destinations', 'tourism', 'airlines', 'hotels', 'adventure'],
    keywords: ['travel', 'tourism', 'destination', 'airline', 'hotel', 'adventure'],
    priority: 13,
    featured: false
  },
  {
    id: 'fashion',
    name: 'Fashion',
    slug: 'fashion',
    description: 'Fashion trends, style news, and industry updates',
    icon: Palette,
    color: 'text-rose-600',
    bgColor: 'bg-rose-50',
    borderColor: 'border-rose-200',
    subcategories: ['trends', 'designers', 'runway', 'street-style', 'sustainability'],
    keywords: ['fashion', 'style', 'trend', 'designer', 'runway', 'clothing'],
    priority: 14,
    featured: false
  },
  {
    id: 'gaming',
    name: 'Gaming',
    slug: 'gaming',
    description: 'Video games, esports, and gaming industry news',
    icon: Gamepad2,
    color: 'text-violet-600',
    bgColor: 'bg-violet-50',
    borderColor: 'border-violet-200',
    subcategories: ['video-games', 'esports', 'mobile-gaming', 'streaming', 'reviews'],
    keywords: ['gaming', 'game', 'esports', 'video-game', 'streaming', 'console'],
    priority: 15,
    featured: false
  }
]

export const featuredCategories = categories.filter(cat => cat.featured)
export const allCategories = categories

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find(cat => cat.slug === slug)
}

export function getCategoryById(id: string): Category | undefined {
  return categories.find(cat => cat.id === id)
}

export function getCategoriesByPriority(limit?: number): Category[] {
  const sorted = categories.sort((a, b) => a.priority - b.priority)
  return limit ? sorted.slice(0, limit) : sorted
}

export function searchCategories(query: string): Category[] {
  const lowercaseQuery = query.toLowerCase()
  return categories.filter(cat => 
    cat.name.toLowerCase().includes(lowercaseQuery) ||
    cat.description.toLowerCase().includes(lowercaseQuery) ||
    cat.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  )
}
