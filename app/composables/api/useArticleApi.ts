import type { Article, ArticlePayload } from '@/types'

export function useArticleApi() {
  const getArticle = async () => {
    return await $fetch<{ data: Article[] }>(`/api/articles`, {
      method: 'GET'
    })
  }

  const getArticleBySlug = async (slug: string) => {
    return await $fetch<{ data: Article }>(`/api/articles/${slug}`, {
      method: 'GET'
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
