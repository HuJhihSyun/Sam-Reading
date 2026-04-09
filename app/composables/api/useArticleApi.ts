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

  return {
    getArticle,
    getArticleBySlug
  }
}
