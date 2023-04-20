import { Hotel } from '@prisma/client';
import hotelsRepository from '@/repositories/hotels-repository';

async function getAllHotels(): Promise<Hotel[]> {
  const hotels: Hotel[] = await hotelsRepository.findAllHotels();
  return hotels;
}

export default { getAllHotels };
