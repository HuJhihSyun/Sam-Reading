import type { ContactMessage, ContactMessageInput } from '@/types'

export function useContactApi() {
  const getContact = async () => {
    return await $fetch<{ data: ContactMessage[] }>(`/api/contacts`, {
      method: 'GET'
    })
  }

  const postContact = async (data: ContactMessageInput) => {
    return await $fetch<{ data: ContactMessage }>(`/api/contacts`, {
      method: 'POST',
      body: data
    })
  }

  const putContact = async (data: Partial<ContactMessage>, id: string) => {
    return await $fetch<{ data: ContactMessage }>(`/api/contacts/${id}`, {
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
