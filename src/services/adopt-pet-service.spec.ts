import { beforeEach, describe, expect, it } from 'vitest'

import { InMemoryOrgRepository } from '../repositories/in-memory/in-memory-org-repository'
import { InMemoryPetRepository } from '../repositories/in-memory/in-memory-pet-repository'
import { OrgRepository } from '../repositories/org-repository'
import { PetRepository } from '../repositories/pet-repository'
import { createOrganization } from '../utils/tests/create-organization'
import { createPet } from '../utils/tests/create-pet'
import { AdoptPetService } from './adopt-pet-service'

import { OrgNotFoundError } from './errors/org-not-found-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

let petRepository: PetRepository
let orgRepository: OrgRepository
let sut: AdoptPetService

describe('Adopt pet service', async () => {
  beforeEach(async () => {
    orgRepository = new InMemoryOrgRepository()
    petRepository = new InMemoryPetRepository(orgRepository)
    sut = new AdoptPetService(petRepository, orgRepository)
  })

  it('should be able to adopt a pet', async () => {
    const { id: orgId } = await createOrganization(orgRepository)

    const { id: petId } = await createPet(petRepository, orgId)

    const { whatsappUrl } = await sut.execute({
      petId,
    })

    expect(whatsappUrl).toMatch(
      /^https:\/\/api\.whatsapp\.com\/send\?phone=\d+(&text=.*)?$/,
    )
  })

  it('should not be able to adopt if org does not exist', async () => {
    const { id: petId } = await createPet(petRepository, 'non-existing-org-id')

    await expect(() =>
      sut.execute({
        petId,
      }),
    ).rejects.toBeInstanceOf(OrgNotFoundError)
  })

  it('should not be able to adopt if pet does not exist', async () => {
    await expect(() =>
      sut.execute({
        petId: 'non-existing-pet-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
