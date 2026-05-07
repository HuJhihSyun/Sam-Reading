import type { Comment } from '@/types'

export function useCommentApi() {
  const getCommentsBySlug = async (slug: string) => {
    return await $fetch<{ data: Comment[] }>(`/api/articles/${slug}/comments`)
  }

  const toggleVisible = async (slug: string, commentId: string, visible: boolean) => {
    return await $fetch<{ data: Comment }>(`/api/articles/${slug}/comments/${commentId}`, {
      method: 'PATCH',
      body: { visible }
    })
  }

  const deleteComment = async (slug: string, commentId: string) => {
    return await $fetch(`/api/articles/${slug}/comments/${commentId}`, { method: 'DELETE' })
  }

  return { getCommentsBySlug, toggleVisible, deleteComment }
}
