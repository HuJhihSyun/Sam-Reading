import type { AboutData } from '@/types'

export function useAboutApi() {
  const getAbout = async () => {
    return await $fetch<AboutData>(`/api/about`, {
      method: 'GET'
    })
  }

  const saveAbout = async (data: AboutData) => {
    return await $fetch<AboutData>(`/api/about`, {
      method: 'PUT',
      body: data
    })
  }

  return {
    getAbout,
    saveAbout
  }
}
