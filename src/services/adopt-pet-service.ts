import { OrgRepository } from '../repositories/org-repository'
import { PetRepository } from '../repositories/pet-repository'
import { OrgNotFoundError } from './errors/org-not-found-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

type AdoptPetServiceParams = {
  petId: string
}

export class AdoptPetService {
  constructor(
    private petRepository: PetRepository,
    private orgRepository: OrgRepository,
  ) {}

  async execute({ petId }: AdoptPetServiceParams) {
    const pet = await this.petRepository.findById(petId)

    if (!pet) {
      throw new ResourceNotFoundError()
    }

    const org = await this.orgRepository.findById(pet.organization_id)

    if (!org) {
      throw new OrgNotFoundError()
    }

    const customMessage = encodeURIComponent(
      `Hey! I'd like to adopt the ${pet.name}!`,
    )

    const formattedNumber = org.whatsapp.replace(/\D/g, '')

    const whatsappUrl = `https://api.whatsapp.com/send?phone=${formattedNumber}&text=${customMessage}`

    return { whatsappUrl }
  }
}
