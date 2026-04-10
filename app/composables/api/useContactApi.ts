export function useContactApi() {
  const getContact = async () => {
    return await $fetch(`/api/contacts`, {
      method: 'GET'
    })
  }

  const postContact = async (data: any) => {
    return await $fetch(`/api/contacts`, {
      method: 'POST',
      body: data
    })
  }

  const putContact = async (data: any, id: string) => {
    return await $fetch(`/api/contacts/${id}`, {
      method: 'PUT',
      body: data
    })
  }

  const deleteContact = async (id: string) => {
    return await $fetch(`/api/contacts/${id}`, {
      method: 'DELETE'
    })
  }

  return {
    getContact,
    postContact,
    putContact,
    deleteContact
  }
}
