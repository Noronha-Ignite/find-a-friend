import { faker } from '@faker-js/faker'
import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgRepository } from '../repositories/in-memory/in-memory-org-repository'
import { OrgRepository } from '../repositories/org-repository'
import { CreateOrgService } from './create-org-service'

let orgRepository: OrgRepository
let sut: CreateOrgService

describe('Create organization service', async () => {
  beforeEach(async () => {
    orgRepository = new InMemoryOrgRepository()
    sut = new CreateOrgService(orgRepository)
  })

  it('should be able to create an organization', async () => {
    const org = await sut.execute({
      address: faker.location.streetAddress(),
      cep: faker.location.zipCode(),
      email: faker.internet.email(),
      latitude: faker.location.latitude(),
      longitude: faker.location.longitude(),
      password: faker.internet.password(),
      whatsapp: faker.phone.number(),
    })

    expect(org).toEqual(
      expect.objectContaining({
        id: expect.any(String),
      }),
    )

    expect(org).not.toHaveProperty('password_hash')
  })
})