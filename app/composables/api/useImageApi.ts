import type { ImageFile } from '@/types'

export const useImageApi = () => {
  const getImages = (): Promise<{ data: ImageFile[] }> =>
    $fetch('/api/images')

  const deleteImage = (key: string): Promise<{ success: boolean }> =>
    $fetch('/api/images', { method: 'DELETE', body: { key } })

  return { getImages, deleteImage }
}
