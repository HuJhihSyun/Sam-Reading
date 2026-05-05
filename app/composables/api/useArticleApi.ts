import type { Article, ArticlePayload } from '@/types'

export function useArticleApi() {
  const getArticle = async (onlyPublished = false) => {
    return await $fetch<{ data: Article[] }>(`/api/articles`, {
      method: 'GET',
      query: onlyPublished ? { status: 'published' } : undefined
    })
  }

  const getArticleBySlug = async (slug: string, onlyPublished = false) => {
    return await $fetch<{ data: Article }>(`/api/articles/${slug}`, {
      method: 'GET',
      query: onlyPublished ? { status: 'published' } : undefined
    })
  }

  const updateArticle = async (slug: string, data: Partial<ArticlePayload>) => {
    return await $fetch<{ data: Article }>(`/api/articles/${slug}`, {
      method: 'PUT',
      body: data
    })
  }

  const deleteArticle = async (slug: string) => {
    return await $fetch(`/api/articles/${slug}`, {
      method: 'DELETE'
    })
  }

  const createArticle = async (data: ArticlePayload) => {
    return await $fetch<{ data: Article }>(`/api/articles`, {
      method: 'POST',
      body: data
    })
  }

  return {
    getArticle,
    getArticleBySlug,
    updateArticle,
    createArticle,
    deleteArticle
  }
}
