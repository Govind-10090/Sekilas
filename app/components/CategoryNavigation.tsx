"use client"

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Search, Grid3X3, List } from 'lucide-react'
import { categories, getCategoryBySlug, type Category } from '../../lib/categories'
import { Button } from '../../components/ui/button'
import { Input } from '../../components/ui/input'
import { Badge } from '../../components/ui/badge'

interface CategoryNavigationProps {
  showFeatured?: boolean
  showAll?: boolean
  className?: string
  onCategorySelect?: (category: Category) => void
}

export default function CategoryNavigation({ 
  showFeatured = true, 
  showAll = true,
  className = "",
  onCategorySelect
}: CategoryNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [expandedCategories, setExpandedCategories] = useState<string[]>([])
  const pathname = usePathname()

  const currentCategory = pathname.includes('/category/') 
    ? pathname.split('/category/')[1] 
    : null

  const filteredCategories = searchQuery 
    ? categories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cat.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : categories

  const featuredCategories = filteredCategories.filter(cat => cat.featured)
  const otherCategories = filteredCategories.filter(cat => !cat.featured)

  const toggleCategoryExpansion = (categoryId: string) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    )
  }

  const handleCategoryClick = (category: Category) => {
    if (onCategorySelect) {
      onCategorySelect(category)
    }
  }

  const isActive = (slug: string) => currentCategory === slug

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Search and View Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid3X3 className="w-4 h-4 mr-2" />
            Grid
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="w-4 h-4 mr-2" />
            List
          </Button>
        </div>
      </div>

      {/* Featured Categories */}
      {showFeatured && featuredCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <span className="w-2 h-2 bg-gold rounded-full mr-3"></span>
            Featured Categories
          </h3>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {featuredCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={isActive(category.slug)}
                viewMode={viewMode}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* All Categories */}
      {showAll && otherCategories.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center">
            <span className="w-2 h-2 bg-gray-400 rounded-full mr-3"></span>
            All Categories
          </h3>
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" 
            : "space-y-3"
          }>
            {otherCategories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                isActive={isActive(category.slug)}
                viewMode={viewMode}
                onClick={() => handleCategoryClick(category)}
              />
            ))}
          </div>
        </div>
      )}

      {/* No Results */}
      {filteredCategories.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <p>No categories found matching "{searchQuery}"</p>
          <Button 
            variant="outline" 
            onClick={() => setSearchQuery('')}
            className="mt-2"
          >
            Clear Search
          </Button>
        </div>
      )}
    </div>
  )
}

interface CategoryCardProps {
  category: Category
  isActive: boolean
  viewMode: 'grid' | 'list'
  onClick: () => void
}

function CategoryCard({ category, isActive, viewMode, onClick }: CategoryCardProps) {
  const IconComponent = category.icon

  if (viewMode === 'list') {
    return (
      <Link href={`/category/${category.slug}`} onClick={onClick}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
            isActive 
              ? `${category.borderColor} ${category.bgColor} shadow-lg` 
              : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
          }`}
        >
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${category.bgColor} ${category.color}`}>
              <IconComponent className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                {category.name}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {category.description}
              </p>
              <div className="flex flex-wrap gap-1 mt-2">
                {category.subcategories.slice(0, 3).map((sub) => (
                  <Badge key={sub} variant="secondary" className="text-xs">
                    {sub}
                  </Badge>
                ))}
                {category.subcategories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{category.subcategories.length - 3} more
                  </Badge>
                )}
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </div>
        </motion.div>
      </Link>
    )
  }

  return (
    <Link href={`/category/${category.slug}`} onClick={onClick}>
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`p-6 rounded-xl border-2 transition-all duration-200 cursor-pointer text-center ${
          isActive 
            ? `${category.borderColor} ${category.bgColor} shadow-lg` 
            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
        }`}
      >
        <div className={`p-4 rounded-full ${category.bgColor} ${category.color} w-16 h-16 mx-auto mb-4 flex items-center justify-center`}>
          <IconComponent className="w-8 h-8" />
        </div>
        <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">
          {category.name}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {category.description}
        </p>
        <div className="flex flex-wrap gap-1 justify-center">
          {category.subcategories.slice(0, 2).map((sub) => (
            <Badge key={sub} variant="secondary" className="text-xs">
              {sub}
            </Badge>
          ))}
          {category.subcategories.length > 2 && (
            <Badge variant="outline" className="text-xs">
              +{category.subcategories.length - 2}
            </Badge>
          )}
        </div>
      </motion.div>
    </Link>
  )
}
