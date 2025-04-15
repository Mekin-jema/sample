// This file contains mock data for the API key management page.
import { faker } from '@faker-js/faker'
import { format } from 'timeago.js'

export const clients = Array.from({ length: 24 }, () => {
  const firstName = faker.person.firstName()
  return {
    id: faker.string.uuid(),
    apiKey: faker.string.uuid(),
    user: faker.internet.email(firstName).toLocaleLowerCase(),
    realm: 'reserved',
    createdAt: format(faker.date.recent()), // timeago format
    status:  faker.helpers.arrayElement([
      'active',
      'inactive',
   
    ]),
    actions: ['view', 'copy', 'delete'], // for icon placeholders
    selected: faker.datatype.boolean(), // to simulate checkboxes
  }
})
