export function useArticleApi() {
  //   const baseUrl = 'http://localhost:3000/api/article'

  const getArticle = async () => {
    return await $fetch(`/api/articles`, {
      method: 'GET'
    })
  }

  const getArticleBySlug = async (slug: string) => {
    return await $fetch(`/api/articles/${slug}`, {
      method: 'GET'
    })
  }

  const updateArticle = async (slug: string, data: any) => {
    return await $fetch(`/api/articles/${slug}`, {
      method: 'PUT',
      body: data
    })
  }

  const deleteArticle = async (slug: string) => {
    return await $fetch(`/api/articles/${slug}`, {
      method: 'DELETE'
    })
  }

  const createArticle = async (data: any) => {
    return await $fetch(`/api/articles`, {
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
