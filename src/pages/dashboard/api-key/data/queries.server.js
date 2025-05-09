import { clients as initialClients } from '../data/clients'

export const listFilteredClients = ({
  user = '',
  filters,
  currentPage,
  pageSize,
  sortBy,
  sortOrder,
}) => {
  const clients = initialClients
    .filter((client) => {
      // Filter by user
      return client.user.toLowerCase().includes(user.toLowerCase())
    })
    .filter((client) => {
      // Filter by dynamic filters (realm, client status, etc.)
      return Object.entries(filters).every(([key, value]) => {
        if (value.length === 0) return true
        return value.includes(client[key])
      })
    })
    .sort((a, b) => {
      if (!sortBy) return 0

      const aValue = a[sortBy]
      const bValue = b[sortBy]

      if (typeof aValue !== 'string' || typeof bValue !== 'string') {
        console.warn(`Invalid sort field type for ${sortBy}`)
        return 0
      }

      return sortOrder === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue)
    })

  const totalItems = clients.length
  const totalPages = Math.ceil(totalItems / pageSize)
  const newCurrentPage = Math.min(currentPage, totalPages)

  return {
    data: clients.slice(
      (newCurrentPage - 1) * pageSize,
      newCurrentPage * pageSize
    ),
    pagination: {
      currentPage: newCurrentPage,
      pageSize,
      totalPages,
      totalItems,
    },
  }
}

export const getFacetedClientCounts = ({
  facets,
  user = '',
  filters,
}) => {
  const facetedCounts = {}

  for (const facet of facets) {
    const filteredClients = initialClients
      .filter((client) =>
        client.user.toLowerCase().includes(user.toLowerCase())
      )
      .filter((client) => {
        return Object.entries(filters).every(([key, value]) => {
          if (key === facet || value.length === 0) return true
          return value.includes(client[key])
        })
      })

    facetedCounts[facet] = filteredClients.reduce((acc, client) => {
      acc[client[facet]] = (acc[client[facet]] ?? 0) + 1
      return acc
    }, {})
  }

  return facetedCounts
}
