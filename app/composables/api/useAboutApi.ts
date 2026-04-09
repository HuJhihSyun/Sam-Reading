export function useAboutApi() {
  //   const baseUrl = 'http://localhost:3000/api/article'

  const getAbout = async () => {
    return await $fetch(`/api/about`, {
      method: 'GET'
    })
  }

  const saveAbout = async (data: any) => {
    return await $fetch(`/api/about`, {
      method: 'PUT',
      body: data
    })
  }

  return {
    getAbout,
    saveAbout
  }
}
